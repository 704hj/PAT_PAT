import BlackHolePurge from "@/app/components/blackHolePurge";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

const meta = {
  title: "Effects/BlackHolePurge",
  component: BlackHolePurge,
  parameters: { layout: "fullscreen" },
  argTypes: {
    show: { control: "boolean" },
    text: { control: "text" },
    durationMs: { control: { type: "number", min: 600, step: 100 } },
  },
  args: {
    show: false,
    text: "...ㅇ라ㅓㅇ",
    durationMs: 1600,
  },
} satisfies Meta<typeof BlackHolePurge>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: any) => {
    const [running, setRunning] = useState(args.show ?? false);
    return (
      <div className="min-h-screen bg-[#0b0f1e] text-white flex flex-col items-center justify-center gap-6 p-6">
        <BlackHolePurge
          {...args}
          show={running}
          onFinished={() => setRunning(false)}
        />
        <button
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition"
          onClick={() => setRunning(true)}
        >
          제거
        </button>
      </div>
    );
  },
};
