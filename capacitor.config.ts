import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.patpat.app',
  appName: 'PAT PAT',
  webDir: 'out',
  server: {
    url: process.env.NEXT_URL,
    cleartext: false,
  },
};

export default config;
