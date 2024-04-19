import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'game.bounce.app',
  appName: 'Bounce',
  webDir: 'out',
  bundledWebRuntime: false,
  server: { hostname: 'localhost:3000', iosScheme: 'https', androidScheme: 'https' },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
