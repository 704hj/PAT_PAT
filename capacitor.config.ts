import type { CapacitorConfig } from '@capacitor/cli';

const isDev = process.env.CAP_ENV === 'local';

const config: CapacitorConfig = {
  appId: 'com.patpat.app',
  appName: 'PAT PAT',
  webDir: 'out',
  server: {
    url: 'http://10.0.2.2:3000',
    cleartext: true,
  },
  // server: isDev
  //   ? {
  //       // 로컬: 에뮬레이터 → 맥 localhost (실기기라면 192.168.x.x:3000)
  //       url: 'http://10.0.2.2:3000',
  //       cleartext: true,
  //     }
  //   : {
  //       // 운영: Vercel 배포 서버
  //       url: 'https://pat-pat.vercel.app',
  //       cleartext: false,
  //     },
};

export default config;
