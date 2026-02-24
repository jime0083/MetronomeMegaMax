module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/hooks': './src/hooks',
            '@/utils': './src/utils',
            '@/services': './src/services',
            '@/types': './src/types',
            '@/i18n': './src/i18n',
            '@/constants': './src/constants',
          },
        },
      ],
    ],
  };
};
