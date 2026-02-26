/**
 * Presets Services
 * Central export for preset-related functionality
 */

// BPM Presets
export {
  getBpmPresets,
  getBpmPreset,
  saveBpmPreset,
  deleteBpmPreset,
  generatePresetId,
} from './bpmPresets';

// Timer Presets
export {
  getTimerPresets,
  getTimerPreset,
  saveTimerPreset,
  deleteTimerPreset,
  generateTimerPresetId,
  formatDuration,
} from './timerPresets';

// Loop Points
export {
  getLoopPoints,
  getLoopPoint,
  saveLoopPoint,
  deleteLoopPoint,
  generateLoopPointId,
  uploadAudioFile,
  deleteAudioFile,
  validateAudioFile,
  type UploadProgressCallback,
  type SaveLoopPointOptions,
} from './loopPoints';
