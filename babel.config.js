module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['module:react-native-dotenv', { moduleName: '@env' }],
    ['module-resolver', {
      root: ['./src'],
      alias: {
        '@components': './src/components',
        '@screens': './src/screens',
        '@hooks': './src/hooks',
        '@theme': './src/theme',
        '@navigation': './src/navigation',
        '@context': './src/context',
        '@global': './src/global',
        '@motion': './src/motion'
      }
    }],
    // React Native Reanimated 4 requires the Worklets Babel plugin.
    // IMPORTANT: it must be listed LAST.
    'react-native-worklets/plugin'
  ]
};
