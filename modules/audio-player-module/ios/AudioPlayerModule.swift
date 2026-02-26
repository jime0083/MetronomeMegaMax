import ExpoModulesCore
import AVFoundation
import Foundation
import UniformTypeIdentifiers
import UIKit

public class AudioPlayerModule: Module {
    // Audio player
    private var audioPlayer: AVAudioPlayer?

    // Playback state
    private var isPlaying = false
    private var playbackSpeed: Float = 1.0
    private var loopStart: Double?
    private var loopEnd: Double?
    private var isLooping = false

    // Timer for loop checking and time updates
    private var updateTimer: Timer?

    public func definition() -> ModuleDefinition {
        Name("AudioPlayerModule")

        // Initialize audio session
        OnCreate {
            self.setupAudioSession()
        }

        // Cleanup
        OnDestroy {
            self.stop()
            self.unload()
        }

        // Load audio file from URL
        AsyncFunction("loadUrl") { (urlString: String) -> [String: Any] in
            return try await self.loadAudioFromUrl(urlString)
        }

        // Play
        Function("play") { () -> Void in
            self.play()
        }

        // Pause
        Function("pause") { () -> Void in
            self.pause()
        }

        // Stop
        Function("stop") { () -> Void in
            self.stop()
        }

        // Seek to time
        Function("seek") { (time: Double) -> Void in
            self.seek(to: time)
        }

        // Skip back (default 15 seconds)
        Function("skipBack") { (seconds: Double) -> Void in
            self.skipBack(seconds: seconds)
        }

        // Skip forward (default 15 seconds)
        Function("skipForward") { (seconds: Double) -> Void in
            self.skipForward(seconds: seconds)
        }

        // Set playback speed
        Function("setPlaybackSpeed") { (speed: Float) -> Void in
            self.setPlaybackSpeed(speed)
        }

        // Set loop start
        Function("setLoopStart") { () -> Void in
            self.setLoopStart()
        }

        // Set loop end
        Function("setLoopEnd") { () -> Void in
            self.setLoopEnd()
        }

        // Clear loop
        Function("clearLoop") { () -> Void in
            self.clearLoop()
        }

        // Toggle loop
        Function("toggleLoop") { () -> Void in
            self.toggleLoop()
        }

        // Get current time
        Function("getCurrentTime") { () -> Double in
            return self.audioPlayer?.currentTime ?? 0
        }

        // Get duration
        Function("getDuration") { () -> Double in
            return self.audioPlayer?.duration ?? 0
        }

        // Get playing state
        Function("isPlaying") { () -> Bool in
            return self.isPlaying
        }

        // Unload audio
        Function("unload") { () -> Void in
            self.unload()
        }

        // Present file picker
        AsyncFunction("pickFile") { () -> [String: Any]? in
            return try await self.pickAudioFile()
        }

        // Events
        Events("onTimeUpdate", "onPlaybackEnded", "onError")
    }

    // MARK: - Audio Session Setup

    private func setupAudioSession() {
        do {
            let session = AVAudioSession.sharedInstance()
            // Use playback category and mix with other audio (for metronome)
            try session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
            try session.setActive(true)
        } catch {
            print("AudioPlayerModule: Failed to setup audio session: \(error)")
        }
    }

    // MARK: - Loading

    private func loadAudioFromUrl(_ urlString: String) async throws -> [String: Any] {
        guard let url = URL(string: urlString) else {
            throw NSError(domain: "AudioPlayerModule", code: 1, userInfo: [NSLocalizedDescriptionKey: "Invalid URL"])
        }

        // Download or use local file
        let fileUrl: URL
        if url.isFileURL {
            fileUrl = url
        } else {
            // Download remote file
            let (localUrl, _) = try await URLSession.shared.download(from: url)
            fileUrl = localUrl
        }

        return try loadAudioFromFile(fileUrl)
    }

    private func loadAudioFromFile(_ url: URL) throws -> [String: Any] {
        // Stop current playback
        stop()

        // Create audio player
        audioPlayer = try AVAudioPlayer(contentsOf: url)
        audioPlayer?.enableRate = true
        audioPlayer?.prepareToPlay()

        // Reset state
        playbackSpeed = 1.0
        loopStart = nil
        loopEnd = nil
        isLooping = false

        return [
            "duration": audioPlayer?.duration ?? 0,
            "fileName": url.lastPathComponent
        ]
    }

    // MARK: - Playback Control

    private func play() {
        guard let player = audioPlayer else { return }

        player.rate = playbackSpeed
        player.play()
        isPlaying = true

        startUpdateTimer()
    }

    private func pause() {
        audioPlayer?.pause()
        isPlaying = false
        stopUpdateTimer()
    }

    private func stop() {
        audioPlayer?.stop()
        audioPlayer?.currentTime = 0
        isPlaying = false
        stopUpdateTimer()
    }

    private func seek(to time: Double) {
        guard let player = audioPlayer else { return }
        let clampedTime = max(0, min(player.duration, time))
        player.currentTime = clampedTime
    }

    private func skipBack(seconds: Double) {
        guard let player = audioPlayer else { return }
        seek(to: player.currentTime - seconds)
    }

    private func skipForward(seconds: Double) {
        guard let player = audioPlayer else { return }
        seek(to: player.currentTime + seconds)
    }

    private func setPlaybackSpeed(_ speed: Float) {
        playbackSpeed = max(0.5, min(2.0, speed))
        if isPlaying {
            audioPlayer?.rate = playbackSpeed
        }
    }

    private func unload() {
        stop()
        audioPlayer = nil
    }

    // MARK: - Loop

    private func setLoopStart() {
        loopStart = audioPlayer?.currentTime
    }

    private func setLoopEnd() {
        loopEnd = audioPlayer?.currentTime
    }

    private func clearLoop() {
        loopStart = nil
        loopEnd = nil
        isLooping = false
    }

    private func toggleLoop() {
        isLooping = !isLooping
    }

    // MARK: - Update Timer

    private func startUpdateTimer() {
        stopUpdateTimer()

        updateTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            self?.handleTimerUpdate()
        }
    }

    private func stopUpdateTimer() {
        updateTimer?.invalidate()
        updateTimer = nil
    }

    private func handleTimerUpdate() {
        guard let player = audioPlayer else { return }

        let currentTime = player.currentTime

        // Send time update event
        sendEvent("onTimeUpdate", ["currentTime": currentTime])

        // Handle loop
        if isLooping, let loopEnd = loopEnd, currentTime >= loopEnd {
            if let loopStart = loopStart {
                player.currentTime = loopStart
            }
        }

        // Check if playback ended
        if !player.isPlaying && isPlaying {
            isPlaying = false
            stopUpdateTimer()
            sendEvent("onPlaybackEnded", [:])
        }
    }

    // MARK: - File Picker

    @MainActor
    private func pickAudioFile() async throws -> [String: Any]? {
        return try await withCheckedThrowingContinuation { continuation in
            let documentPicker = UIDocumentPickerViewController(forOpeningContentTypes: [.audio, .mp3])
            documentPicker.allowsMultipleSelection = false

            let delegate = DocumentPickerDelegate { [weak self] result in
                switch result {
                case .success(let url):
                    do {
                        // Start accessing security-scoped resource
                        guard url.startAccessingSecurityScopedResource() else {
                            throw NSError(domain: "AudioPlayerModule", code: 3, userInfo: [NSLocalizedDescriptionKey: "Cannot access file"])
                        }

                        defer { url.stopAccessingSecurityScopedResource() }

                        // Copy to temporary location
                        let tempDir = FileManager.default.temporaryDirectory
                        let tempUrl = tempDir.appendingPathComponent(url.lastPathComponent)

                        // Remove existing file if present
                        try? FileManager.default.removeItem(at: tempUrl)
                        try FileManager.default.copyItem(at: url, to: tempUrl)

                        let info = try self?.loadAudioFromFile(tempUrl) ?? [:]
                        continuation.resume(returning: info)
                    } catch {
                        continuation.resume(throwing: error)
                    }

                case .failure(let error):
                    continuation.resume(throwing: error)

                case .cancelled:
                    continuation.resume(returning: nil)
                }
            }

            documentPicker.delegate = delegate
            // Keep delegate alive
            objc_setAssociatedObject(documentPicker, "delegate", delegate, .OBJC_ASSOCIATION_RETAIN)

            // Present picker
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let rootVC = windowScene.windows.first?.rootViewController {
                rootVC.present(documentPicker, animated: true)
            }
        }
    }
}

// MARK: - Document Picker Delegate

private enum DocumentPickerResult {
    case success(URL)
    case failure(Error)
    case cancelled
}

private class DocumentPickerDelegate: NSObject, UIDocumentPickerDelegate {
    private let completion: (DocumentPickerResult) -> Void

    init(completion: @escaping (DocumentPickerResult) -> Void) {
        self.completion = completion
    }

    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        guard let url = urls.first else {
            completion(.cancelled)
            return
        }
        completion(.success(url))
    }

    func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {
        completion(.cancelled)
    }
}
