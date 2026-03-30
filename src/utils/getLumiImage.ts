export function getLumiImage(
  polarity: string | undefined,
  intensity: number | null | undefined
): string {
  if (polarity === 'POSITIVE') {
    if (intensity != null && intensity >= 4)
      return '/images/icon/emotion/pos/love.png';
    if (intensity === 3) return '/images/icon/emotion/pos/excited.png';
    return '/images/icon/emotion/pos/happy.png';
  }
  if (polarity === 'NEGATIVE') {
    if (intensity != null && intensity >= 4)
      return '/images/icon/emotion/neg/sad.png';
    if (intensity === 3) return '/images/icon/emotion/neg/jealousy.png';

    return '/images/icon/emotion/neg/fear.png';
  }
  return '/images/icon/lumi/lumi_main.svg';
}
