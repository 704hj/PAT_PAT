import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MemoProps {
  onClick: () => void;
}

export default function Memo({ onClick }: MemoProps) {
  const [memo, setMemo] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const router = useRouter();

  const addTag = () => {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setTags([...tags, value]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  useEffect(() => {
    console.log("tags ", tags);
  }, [tags]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="relative bg-white rounded-2xl shadow-lg p-5 w-[90%] max-w-sm border-2 border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* <h2 className="text-lg font-bold mb-3 text-gray-600 text-center">
          메모
        </h2> */}

        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="버리고 싶은 기억을 써보세요."
          className="w-full h-40 sm:h-48 border-2 border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white resize-none"
        />

        <div className="mt-3">
          <label className="text-sm text-gray-500 mb-1 block">태그</label>

          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="flex items-center bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm cursor-pointer select-none"
                onClick={() => removeTag(i)}
              >
                {tag} ✕
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyUp={handleTagKeyDown}
              placeholder="태그를 입력하세요"
              className="flex-1 border-2 border-gray-300 rounded-xl p-3 text-sm text-white  focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            {/*  태그 추가 버튼 */}
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2  text-white rounded-xl transition"
            >
              추가
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-around space-x-2 align-middle">
          <button
            className="
  w-[5%]                   
    aspect-[1/1]                /* 1:1 비율 유지 */     
      bg-[url('/images/icon/close.png')] bg-cover bg-center
      flex items-center justify-center

  "
            onClick={() => {
              console.log("메모:", memo);
              console.log("태그:", tags);
              onClick(); // 모달 닫기
            }}
          >
            &nbsp;
          </button>

          <button
            className="w-[10%] h-[40%]      
      bg-[url('/images/icon/check.png')] bg-cover bg-center
      flex items-center justify-center
"
            onClick={() => {
              onClick();
              router.push("/emotion-bin");
            }}
          >
            &nbsp;
          </button>
        </div>
      </div>
    </div>
  );
}
