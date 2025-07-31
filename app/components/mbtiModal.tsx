interface MbtiModalProps {
  onClose: (type: "T" | "F") => void;
}

export default function MbtiModal({ onClose }: MbtiModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 "
      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
    >
      <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center shadow-lg mx-4">
        <h2 className="text-2xl font-semibold mb-6">MBTI를 선택해주세요</h2>
        <div className="flex justify-around">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={() => onClose("T")}
          >
            T (Thinking)
          </button>
          <button
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
            onClick={() => onClose("F")}
          >
            F (Feeling)
          </button>
        </div>
      </div>
    </div>
  );
}
