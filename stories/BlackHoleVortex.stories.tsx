import BlackHoleVortex from "@/app/components/BlackHoleVortex";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

const meta = {
  title: "Effects/BlackHoleVortex",
  component: BlackHoleVortex,
  parameters: { layout: "fullscreen" },
  argTypes: {
    show: { control: "boolean" },
    durationMs: { control: { type: "number", min: 600, step: 100 } },
    particleCount: { control: { type: "number", min: 200, step: 50 } },
  },
  args: {
    show: false,
    durationMs: 1500,
    particleCount: 900,
  },
} satisfies Meta<typeof BlackHoleVortex>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: any) => {
    const [running, setRunning] = useState(args.show ?? false);
    return (
      <div className="min-h-screen bg-[#0b0f1e] text-white flex flex-col items-center justify-center gap-6 p-6">
        <BlackHoleVortex
          {...args}
          show={running}
          onFinished={() => setRunning(false)}
        />
        <button
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition"
          onClick={() => setRunning(true)}
        >
          소용돌이 시작
        </button>
      </div>
    );
  },
};
