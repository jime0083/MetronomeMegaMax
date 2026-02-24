import type { TranslationKeys } from './ja';

export const es: TranslationKeys = {
  // Common
  common: {
    start: 'Iniciar',
    stop: 'Detener',
    pause: 'Pausar',
    resume: 'Reanudar',
    reset: 'Reiniciar',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    confirm: 'Confirmar',
    close: 'Cerrar',
    select: 'Seleccionar',
    upload: 'Subir',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
  },

  // Header
  header: {
    language: 'Idioma',
    subscription: 'Suscripción',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    menu: 'Menú',
  },

  // Metronome
  metronome: {
    title: 'Metrónomo',
    bpm: 'BPM',
    timeSignature: 'Compás',
    selectTimeSignature: 'Seleccionar compás',
    accentPattern: 'Acento',
    selectAccent: 'Seleccionar acento',
    selectBpmPreset: 'Seleccionar BPM',
    savePreset: 'Guardar preset',
    presetName: 'Nombre del preset',
  },

  // Accent patterns
  accent: {
    first: '1er tiempo',
    firstThird: '1er y 3er tiempo',
    secondFourth: '2do y 4to tiempo',
  },

  // Timer
  timer: {
    title: 'Temporizador',
    selectTimePreset: 'Seleccionar tiempo',
    timeUp: '¡Tiempo!',
    addTime: 'Añadir tiempo',
  },

  // Audio Player
  audio: {
    title: 'Reproductor',
    selectFile: 'Seleccionar archivo',
    noFileSelected: 'Ningún archivo seleccionado',
    loop: 'Bucle',
    speed: 'Velocidad',
    loopStart: 'Inicio (A)',
    loopEnd: 'Fin (B)',
    saveLoopPoint: 'Guardar punto de bucle',
    fileSizeLimit: 'Tamaño máximo de archivo: 20MB',
    unsupportedFormat: 'Formatos soportados: mp3, wav',
  },

  // Subscription
  subscription: {
    title: 'Plan Premium',
    price: '¥200/mes',
    subscribe: 'Suscribirse',
    cancel: 'Cancelar',
    cancelConfirm: 'Cancelar Suscripción',
    cancelMessage:
      'Al cancelar, perderás acceso a las funciones premium al final de tu período de facturación. ¿Estás seguro?',
    features: {
      title: 'Funciones Premium',
      bpmPresets: 'Presets de BPM (hasta 10)',
      timerPresets: 'Presets de temporizador (hasta 10)',
      abRepeat: 'Repetición A-B',
      loopPoints: 'Puntos de bucle (hasta 3)',
      speedControl: 'Control de velocidad',
      backgroundPlay: 'Reproducción en segundo plano (iOS)',
      noAds: 'Sin anuncios',
    },
  },

  // Login
  login: {
    title: 'Iniciar sesión',
    withGoogle: 'Iniciar sesión con Google',
    required: 'Debes iniciar sesión para usar esta función',
  },

  // Errors
  errors: {
    network: 'Por favor, verifica tu conexión a internet',
    loginFailed: 'Error al iniciar sesión. Por favor, intenta de nuevo',
    paymentFailed: 'Error en el pago. Por favor, verifica tu tarjeta',
    fileReadFailed: 'Error al leer el archivo',
    fileTooLarge: 'Archivo demasiado grande (máx: 20MB)',
    unsupportedFormat: 'Formato de archivo no soportado',
    saveFailed: 'Error al guardar',
    presetLimitReached: 'Límite de presets alcanzado',
  },

  // Premium required
  premium: {
    required: 'Esta función está disponible con el plan Premium',
    upgrade: 'Actualizar',
  },
};
