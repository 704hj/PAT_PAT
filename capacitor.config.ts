import type { CapacitorConfig } from '@capacitor/cli';

const isProd = process.env.CAPACITOR_ENV === 'production';

const config: CapacitorConfig = {
  appId: 'com.patpat.app',
  appName: 'PAT PAT',
  webDir: 'out',
  server: isProd
    ? { url: 'https://pat-pat.vercel.app', androidScheme: 'https' }
    : { url: 'http://10.0.2.2:3000', cleartext: true },
};

export default config;
