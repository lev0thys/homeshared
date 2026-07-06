/**
 * Point d'entrée mobile : enregistre le handler des widgets Android puis charge Expo Router.
 * Requis pour react-native-android-widget (headless JS).
 */
const { Platform } = require('react-native');

if (Platform.OS === 'android' && process.env.EXPO_NO_ANDROID_WIDGETS !== 'true') {
  const { registerWidgetTaskHandler } = require('react-native-android-widget');
  const { widgetTaskHandler } = require('./src/widgets/widget-task-handler');
  registerWidgetTaskHandler(widgetTaskHandler);
}

require('expo-router/entry');
