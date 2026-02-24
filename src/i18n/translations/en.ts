import type { TranslationKeys } from './ja';

export const en: TranslationKeys = {
  // Common
  common: {
    start: 'Start',
    stop: 'Stop',
    pause: 'Pause',
    resume: 'Resume',
    reset: 'Reset',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    confirm: 'Confirm',
    close: 'Close',
    select: 'Select',
    upload: 'Upload',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  },

  // Header
  header: {
    language: 'Language',
    subscription: 'Subscription',
    login: 'Login',
    logout: 'Logout',
    menu: 'Menu',
  },

  // Metronome
  metronome: {
    title: 'Metronome',
    bpm: 'BPM',
    timeSignature: 'Time Signature',
    selectTimeSignature: 'Select time signature',
    accentPattern: 'Accent',
    selectAccent: 'Select accent',
    selectBpmPreset: 'Select BPM',
    savePreset: 'Save preset',
    presetName: 'Preset name',
  },

  // Accent patterns
  accent: {
    first: '1st beat',
    firstThird: '1st & 3rd beats',
    secondFourth: '2nd & 4th beats',
  },

  // Timer
  timer: {
    title: 'Timer',
    selectTimePreset: 'Select time',
    timeUp: "Time's up!",
    addTime: 'Add time',
  },

  // Audio Player
  audio: {
    title: 'Audio Player',
    selectFile: 'Select file',
    noFileSelected: 'No file selected',
    loop: 'Loop',
    speed: 'Speed',
    loopStart: 'Start (A)',
    loopEnd: 'End (B)',
    saveLoopPoint: 'Save loop point',
    fileSizeLimit: 'Maximum file size: 20MB',
    unsupportedFormat: 'Supported formats: mp3, wav',
  },

  // Subscription
  subscription: {
    title: 'Premium Plan',
    price: '¥200/month',
    subscribe: 'Subscribe',
    cancel: 'Cancel',
    cancelConfirm: 'Cancel Subscription',
    cancelMessage:
      'After canceling, you will lose access to premium features at the end of your billing period. Are you sure?',
    features: {
      title: 'Premium Features',
      bpmPresets: 'BPM presets (up to 10)',
      timerPresets: 'Timer presets (up to 10)',
      abRepeat: 'A-B repeat',
      loopPoints: 'Loop points (up to 3)',
      speedControl: 'Playback speed control',
      backgroundPlay: 'Background playback (iOS)',
      noAds: 'No ads',
    },
  },

  // Login
  login: {
    title: 'Login',
    withGoogle: 'Sign in with Google',
    required: 'Login required to use this feature',
  },

  // Errors
  errors: {
    network: 'Please check your internet connection',
    loginFailed: 'Login failed. Please try again',
    paymentFailed: 'Payment failed. Please check your card information',
    fileReadFailed: 'Failed to read file',
    fileTooLarge: 'File size too large (max: 20MB)',
    unsupportedFormat: 'Unsupported file format',
    saveFailed: 'Failed to save',
    presetLimitReached: 'Preset limit reached',
  },

  // Premium required
  premium: {
    required: 'This feature is available with Premium plan',
    upgrade: 'Upgrade',
  },
};
