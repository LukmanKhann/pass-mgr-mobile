module.exports = {
  preset: '@react-native/jest-preset',
  resolver: 'react-native-worklets/jest/resolver.js',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-worklets|react-native-reanimated|@react-navigation)/)',
  ],
};
