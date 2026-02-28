// Jest setup file

// Mock React Native Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'web',
  select: jest.fn((options) => options.web || options.default),
}));

// Mock native modules
jest.mock('metronome-module', () => ({
  isNativeAvailable: () => false,
  start: jest.fn(),
  stop: jest.fn(),
  setBpm: jest.fn(),
  setTimeSignature: jest.fn(),
  setAccentPattern: jest.fn(),
  addBeatListener: jest.fn(),
}), { virtual: true });

jest.mock('audio-player-module', () => ({
  isNativeAvailable: () => false,
}), { virtual: true });

// Mock Firebase
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

// Mock Web Audio API
class MockAudioContext {
  currentTime = 0;
  state = 'running';

  createOscillator() {
    return {
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      frequency: { value: 440 },
      type: 'sine',
    };
  }

  createGain() {
    return {
      connect: jest.fn(),
      gain: {
        value: 1,
        setValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn(),
      },
    };
  }

  get destination() {
    return {};
  }

  resume() {
    return Promise.resolve();
  }

  close() {
    return Promise.resolve();
  }
}

global.AudioContext = MockAudioContext;
global.window = { AudioContext: MockAudioContext };
