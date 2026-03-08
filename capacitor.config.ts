import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.patpat.app',
  appName: 'PAT PAT',
  webDir: 'out',
  server: {
    url: 'https://pat-pat.vercel.app',
    cleartext: false,
    // url: 'http://10.0.2.2:3000',
    // cleartext: true,
  },
};

export default config;
