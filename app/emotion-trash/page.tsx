import { Dongle } from "next/font/google";

const dongle = Dongle({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dongle",
  display: "swap",
});

export default function EmotionTrash() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-[#fefefe] text-[#333]">
      {/* 감정 쓰레기통 이미지 */}
      <div className="mb-8">
        <img
          src="/images/trash.png"
          alt="감정 쓰레기통"
          className="w-60 h-60 object-contain animate-bounce-slow"
        />
      </div>

      {/* 일기 입력 폼 */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-4">
        <textarea
          className={`${dongle.variable} font-dongle  w-full min-h-[150px] p-4 text-2xl  bg-white border border-gray-300 rounded-lg resize-none placeholder:text-gray-400 focus:outline-none`}
          placeholder="지금 감정을 일기에 털어놔 보세요..."
        />

        <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition">
          감정 버리기
        </button>
      </div>
    </div>
  );
}
