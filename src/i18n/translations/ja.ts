// Translation type definitions
export interface TranslationKeys {
  common: {
    start: string;
    stop: string;
    pause: string;
    resume: string;
    reset: string;
    save: string;
    cancel: string;
    delete: string;
    confirm: string;
    close: string;
    select: string;
    upload: string;
    loading: string;
    error: string;
    success: string;
  };
  header: {
    language: string;
    subscription: string;
    login: string;
    logout: string;
    menu: string;
  };
  metronome: {
    title: string;
    bpm: string;
    timeSignature: string;
    selectTimeSignature: string;
    accentPattern: string;
    selectAccent: string;
    selectBpmPreset: string;
    savePreset: string;
    presetName: string;
  };
  accent: {
    first: string;
    firstThird: string;
    secondFourth: string;
  };
  timer: {
    title: string;
    selectTimePreset: string;
    timeUp: string;
    addTime: string;
  };
  audio: {
    title: string;
    selectFile: string;
    noFileSelected: string;
    loop: string;
    speed: string;
    loopStart: string;
    loopEnd: string;
    saveLoopPoint: string;
    fileSizeLimit: string;
    unsupportedFormat: string;
  };
  subscription: {
    title: string;
    price: string;
    subscribe: string;
    cancel: string;
    cancelConfirm: string;
    cancelMessage: string;
    features: {
      title: string;
      bpmPresets: string;
      timerPresets: string;
      abRepeat: string;
      loopPoints: string;
      speedControl: string;
      backgroundPlay: string;
      noAds: string;
    };
  };
  login: {
    title: string;
    withGoogle: string;
    required: string;
  };
  errors: {
    network: string;
    loginFailed: string;
    paymentFailed: string;
    fileReadFailed: string;
    fileTooLarge: string;
    unsupportedFormat: string;
    saveFailed: string;
    presetLimitReached: string;
  };
  premium: {
    required: string;
    upgrade: string;
  };
}

export const ja: TranslationKeys = {
  // Common
  common: {
    start: '開始',
    stop: '停止',
    pause: '一時停止',
    resume: '再開',
    reset: 'リセット',
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    confirm: '確認',
    close: '閉じる',
    select: '選択',
    upload: 'アップロード',
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
  },

  // Header
  header: {
    language: '言語',
    subscription: 'サブスクリプション',
    login: 'ログイン',
    logout: 'ログアウト',
    menu: 'メニュー',
  },

  // Metronome
  metronome: {
    title: 'メトロノーム',
    bpm: 'BPM',
    timeSignature: '拍子',
    selectTimeSignature: '拍子を選択',
    accentPattern: 'アクセント',
    selectAccent: 'アクセントを選択',
    selectBpmPreset: 'BPMを選択',
    savePreset: 'プリセットを保存',
    presetName: 'プリセット名',
  },

  // Accent patterns
  accent: {
    first: '1拍目',
    firstThird: '1・3拍目',
    secondFourth: '2・4拍目',
  },

  // Timer
  timer: {
    title: 'タイマー',
    selectTimePreset: '時間を選択',
    timeUp: '時間です！',
    addTime: '時間を追加',
  },

  // Audio Player
  audio: {
    title: '音源再生',
    selectFile: 'ファイルを選択',
    noFileSelected: 'ファイルが選択されていません',
    loop: 'ループ',
    speed: '再生速度',
    loopStart: '開始点 (A)',
    loopEnd: '終了点 (B)',
    saveLoopPoint: 'ループポイントを保存',
    fileSizeLimit: 'アップロードする音源ファイルは20MB以下にしてください',
    unsupportedFormat: '対応形式: mp3, wav',
  },

  // Subscription
  subscription: {
    title: 'プレミアムプラン',
    price: '月額 ¥200',
    subscribe: '購入する',
    cancel: '解約',
    cancelConfirm: 'プランの解約',
    cancelMessage:
      '解約すると、次の請求日以降はプレミアム機能が利用できなくなります。よろしいですか？',
    features: {
      title: 'プレミアム機能',
      bpmPresets: 'BPMプリセット保存（10個まで）',
      timerPresets: 'タイマープリセット保存（10個まで）',
      abRepeat: 'A-Bリピート',
      loopPoints: 'ループポイント保存（3個まで）',
      speedControl: '再生速度変更',
      backgroundPlay: 'バックグラウンド再生（iOS）',
      noAds: '広告非表示',
    },
  },

  // Login
  login: {
    title: 'ログイン',
    withGoogle: 'Googleでログイン',
    required: 'この機能を使用するにはログインが必要です',
  },

  // Errors
  errors: {
    network: 'インターネット接続を確認してください',
    loginFailed: 'ログインに失敗しました。再度お試しください',
    paymentFailed: '決済に失敗しました。カード情報をご確認ください',
    fileReadFailed: 'ファイルを読み込めませんでした',
    fileTooLarge: 'ファイルサイズが大きすぎます（上限: 20MB）',
    unsupportedFormat: '対応していないファイル形式です',
    saveFailed: '保存に失敗しました',
    presetLimitReached: 'プリセットの上限に達しました',
  },

  // Premium required
  premium: {
    required: 'この機能はプレミアムプランでご利用いただけます',
    upgrade: 'アップグレード',
  },
};
