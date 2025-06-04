import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ambrosioApp',
  webDir: 'www',
  plugins: {
    ScreenOrientation: {
      locked: 'portrait'
    }
  },
  server:{
    cleartext: true,
    androidScheme: 'http',
  }
};

export default config;