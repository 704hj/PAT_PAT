import { motion } from "framer-motion";

interface Props {
  onClose: () => void;
}

export default function SuccessModal({ onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="bg-white rounded-2xl p-6 text-center shadow-lg max-w-[280px] w-full"
      >
        <img
          src="/images/icon/monster_happy.svg"
          alt="Happy Monster"
          className="mx-auto w-20 h-20 mb-4" // 크기 줄이고 하단 여백 추가
        />
        <p className="text-gray-600 mb-6">다 먹었어요! ✨</p>
        <button
          onClick={onClose}
          className="bg-sky-600 hover:bg-pink-600 text-white rounded-full px-4 py-1.5 text-sm shadow-sm"
        >
          확인
        </button>
      </motion.div>
    </motion.div>
  );
}
