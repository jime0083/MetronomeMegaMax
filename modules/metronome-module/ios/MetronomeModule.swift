import ExpoModulesCore
import AVFoundation
import Foundation

// Accent pattern types matching TypeScript
enum AccentPattern: String {
    case first = "first"
    case firstThird = "first-third"
    case secondFourth = "second-fourth"
}

public class MetronomeModule: Module {
    // Audio engine components
    private var audioEngine: AVAudioEngine?
    private var normalClickBuffer: AVAudioPCMBuffer?
    private var accentClickBuffer: AVAudioPCMBuffer?

    // Metronome state
    private var isPlaying = false
    private var bpm: Double = 120.0
    private var beatsPerMeasure: Int = 4
    private var accentPattern: AccentPattern = .first
    private var currentBeat: Int = 0

    // Scheduling
    private var schedulerTimer: DispatchSourceTimer?
    private var nextBeatTime: AVAudioTime?
    private let scheduleAheadTime: Double = 0.1  // 100ms look-ahead
    private let schedulerInterval: Double = 0.025  // 25ms check interval

    // Player nodes pool for overlapping sounds
    private var playerNodes: [AVAudioPlayerNode] = []
    private let maxPlayerNodes = 4

    public func definition() -> ModuleDefinition {
        Name("MetronomeModule")

        // Initialize audio engine on module load
        OnCreate {
            self.setupAudioEngine()
            self.generateClickBuffers()
        }

        // Cleanup on module destroy
        OnDestroy {
            self.stop()
            self.audioEngine?.stop()
            self.audioEngine = nil
        }

        // Start metronome
        AsyncFunction("start") { () -> Void in
            try self.start()
        }

        // Stop metronome
        Function("stop") { () -> Void in
            self.stop()
        }

        // Set BPM (can be called while playing)
        Function("setBpm") { (newBpm: Double) -> Void in
            self.bpm = max(20, min(300, newBpm))
        }

        // Set time signature
        Function("setTimeSignature") { (signature: String) -> Void in
            if let beats = Int(signature.split(separator: "/").first ?? "4") {
                self.beatsPerMeasure = beats
            }
        }

        // Set accent pattern
        Function("setAccentPattern") { (pattern: String) -> Void in
            self.accentPattern = AccentPattern(rawValue: pattern) ?? .first
        }

        // Get current playing state
        Function("isPlaying") { () -> Bool in
            return self.isPlaying
        }

        // Event emitter for beat updates
        Events("onBeat")
    }

    // MARK: - Audio Setup

    private func setupAudioEngine() {
        audioEngine = AVAudioEngine()

        guard let engine = audioEngine else { return }

        // Create player node pool
        for _ in 0..<maxPlayerNodes {
            let playerNode = AVAudioPlayerNode()
            engine.attach(playerNode)
            engine.connect(playerNode, to: engine.mainMixerNode, format: nil)
            playerNodes.append(playerNode)
        }

        // Configure audio session
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
            try session.setActive(true)
        } catch {
            print("MetronomeModule: Failed to setup audio session: \(error)")
        }
    }

    // Generate click sound buffers using oscillator synthesis
    private func generateClickBuffers() {
        guard let engine = audioEngine else { return }

        let sampleRate = engine.mainMixerNode.outputFormat(forBus: 0).sampleRate
        let format = AVAudioFormat(standardFormatWithSampleRate: sampleRate, channels: 1)!

        // Click duration: 50ms
        let clickDuration: Double = 0.05
        let frameCount = AVAudioFrameCount(sampleRate * clickDuration)

        // Normal click (800Hz)
        normalClickBuffer = createClickBuffer(
            frequency: 800,
            amplitude: 0.3,
            duration: clickDuration,
            format: format,
            frameCount: frameCount
        )

        // Accent click (1000Hz, louder)
        accentClickBuffer = createClickBuffer(
            frequency: 1000,
            amplitude: 0.5,
            duration: clickDuration,
            format: format,
            frameCount: frameCount
        )
    }

    private func createClickBuffer(
        frequency: Double,
        amplitude: Float,
        duration: Double,
        format: AVAudioFormat,
        frameCount: AVAudioFrameCount
    ) -> AVAudioPCMBuffer? {
        guard let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: frameCount) else {
            return nil
        }

        buffer.frameLength = frameCount
        let sampleRate = format.sampleRate

        guard let channelData = buffer.floatChannelData?[0] else { return nil }

        for frame in 0..<Int(frameCount) {
            let time = Double(frame) / sampleRate

            // Sine wave with exponential decay envelope
            let envelope = Float(exp(-time * 80))  // Quick decay
            let sample = sin(2.0 * Double.pi * frequency * time)

            channelData[frame] = Float(sample) * amplitude * envelope
        }

        return buffer
    }

    // MARK: - Playback Control

    private func start() throws {
        guard let engine = audioEngine else {
            throw NSError(domain: "MetronomeModule", code: 1, userInfo: [NSLocalizedDescriptionKey: "Audio engine not initialized"])
        }

        if !engine.isRunning {
            try engine.start()
        }

        // Start all player nodes
        for playerNode in playerNodes {
            if !playerNode.isPlaying {
                playerNode.play()
            }
        }

        isPlaying = true
        currentBeat = 0

        // Calculate first beat time
        let now = AVAudioTime(hostTime: mach_absolute_time())
        let sampleRate = engine.mainMixerNode.outputFormat(forBus: 0).sampleRate
        let delayFrames = AVAudioFramePosition(0.05 * sampleRate)  // 50ms delay for smooth start
        nextBeatTime = AVAudioTime(sampleTime: now.sampleTime + delayFrames, atRate: sampleRate)

        // Start scheduler
        startScheduler()
    }

    private func stop() {
        isPlaying = false

        // Stop scheduler
        schedulerTimer?.cancel()
        schedulerTimer = nil

        // Stop and reset player nodes
        for playerNode in playerNodes {
            playerNode.stop()
        }

        currentBeat = 0
    }

    // MARK: - Look-ahead Scheduler

    private func startScheduler() {
        let timer = DispatchSource.makeTimerSource(queue: DispatchQueue.global(qos: .userInteractive))
        timer.schedule(deadline: .now(), repeating: schedulerInterval)

        timer.setEventHandler { [weak self] in
            self?.scheduleBeats()
        }

        schedulerTimer = timer
        timer.resume()
    }

    private func scheduleBeats() {
        guard isPlaying,
              let engine = audioEngine,
              engine.isRunning,
              var nextTime = nextBeatTime else { return }

        let sampleRate = engine.mainMixerNode.outputFormat(forBus: 0).sampleRate
        let now = AVAudioTime(hostTime: mach_absolute_time())
        let nowSeconds = Double(now.sampleTime) / sampleRate
        let scheduleUntil = nowSeconds + scheduleAheadTime

        // Schedule all beats within the look-ahead window
        while true {
            let nextTimeSeconds = Double(nextTime.sampleTime) / sampleRate

            if nextTimeSeconds >= scheduleUntil {
                break
            }

            // Schedule this beat
            let beat = currentBeat
            let isAccent = isAccentBeat(beat)
            scheduleClick(at: nextTime, isAccent: isAccent)

            // Emit beat event (on main queue for UI updates)
            let beatToEmit = beat
            DispatchQueue.main.async { [weak self] in
                self?.sendEvent("onBeat", ["beat": beatToEmit])
            }

            // Advance to next beat
            currentBeat = (currentBeat + 1) % beatsPerMeasure

            // Calculate next beat time
            let beatInterval = 60.0 / bpm
            let intervalFrames = AVAudioFramePosition(beatInterval * sampleRate)
            nextTime = AVAudioTime(sampleTime: nextTime.sampleTime + intervalFrames, atRate: sampleRate)
            nextBeatTime = nextTime
        }
    }

    private func isAccentBeat(_ beat: Int) -> Bool {
        switch accentPattern {
        case .first:
            return beat == 0
        case .firstThird:
            return beat == 0 || beat == 2
        case .secondFourth:
            return beat == 1 || beat == 3
        }
    }

    private func scheduleClick(at time: AVAudioTime, isAccent: Bool) {
        let buffer = isAccent ? accentClickBuffer : normalClickBuffer
        guard let clickBuffer = buffer else { return }

        // Find an available player node
        for playerNode in playerNodes {
            // Schedule the buffer
            playerNode.scheduleBuffer(clickBuffer, at: time, options: [], completionHandler: nil)
            break  // Only schedule on one node per beat
        }
    }
}
