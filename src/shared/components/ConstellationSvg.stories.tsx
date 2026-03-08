import type { Meta, StoryObj } from '@storybook/react';
import ConstellationSvg from './ConstellationSvg';

/**
 * ConstellationSvg 스토리: 수정하신 십자 스파이크 효과와 테마들을 확인합니다.
 */
const meta: Meta<typeof ConstellationSvg> = {
  title: 'Components/ConstellationSvg',
  component: ConstellationSvg,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'space',
      values: [{ name: 'space', value: '#050B18' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['default', 'healing', 'warm', 'deep', 'lumi'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConstellationSvg>;

const mockData = {
  anchorPoints: [
    { x: 20, y: 80 },
    { x: 40, y: 40 },
    { x: 60, y: 60 },
    { x: 80, y: 20 },
  ],
  daysCount: 10,
  dates: [
    '2024-01-01',
    '2024-01-02',
    '2024-01-03',
    '2024-01-04',
    '2024-01-05',
    '2024-01-06',
    '2024-01-07',
    '2024-01-08',
    '2024-01-09',
    '2024-01-10',
  ],
  todayDate: '2024-01-05',
  entries: {
    '2024-01-01': {
      content: '강한 긍정',
      emotion_polarity: 'POSITIVE',
      emotion_intensity: 5,
    },
    '2024-01-03': {
      content: '중간 긍정',
      emotion_polarity: 'POSITIVE',
      emotion_intensity: 3,
    },
    '2024-01-05': {
      content: '약한 부정',
      emotion_polarity: 'NEGATIVE',
      emotion_intensity: 2,
    },
    '2024-01-07': {
      content: '강한 부정',
      emotion_polarity: 'NEGATIVE',
      emotion_intensity: 5,
    },
  } as any,
};

export const Default: Story = {
  args: {
    ...mockData,
    theme: 'default',
  },
};

export const HealingGalaxy: Story = {
  name: '1. 치유의 은하수 (민트 & 퍼플)',
  args: {
    ...mockData,
    theme: 'healing',
  },
};

export const WarmStarlight: Story = {
  name: '2. 따뜻한 별빛 (골드 & 로즈)',
  args: {
    ...mockData,
    theme: 'warm',
  },
};

export const DeepSpace: Story = {
  name: '3. 심해의 우주 (아쿠아 & 인디고)',
  args: {
    ...mockData,
    theme: 'deep',
  },
};

export const StarTemperature: Story = {
  name: '4. 실제 별의 온도 기반 (연청 & 주황)',
  args: {
    ...mockData,
    theme: 'lumi',
  },
};
