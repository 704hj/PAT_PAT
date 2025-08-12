// LoginPage.tsx
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fefcf5] px-4">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* 아이디 입력 */}
        <input
          type="text"
          placeholder="아이디"
          className="w-full p-3 mb-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#cde08f] transition"
        />
        {/* 비밀번호 입력 */}
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#cde08f] transition"
        />
        {/* 로그인 버튼 */}
        <button className="w-full p-3 bg-[#d9e69f] hover:bg-[#cde08f] rounded-md text-sm font-medium transition">
          로그인
        </button>

        {/* 회원 관련 링크 */}
        <div className="flex justify-around w-full my-4 text-xs text-gray-500 gap-2 flex-wrap">
          <a href="#" className="hover:underline">
            회원가입
          </a>
          <a href="#" className="hover:underline">
            아이디 찾기
          </a>
          <a href="#" className="hover:underline">
            비밀번호 찾기
          </a>
        </div>

        {/* 구분선 */}
        <div className="flex items-center w-full my-2 text-xs text-gray-400">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="mx-3 whitespace-nowrap">또는</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* 소셜 로그인 */}
        <div className="flex gap-6 mt-4">
          <button className="w-12 h-12 rounded-full overflow-hidden shadow hover:scale-105 transition">
            <img
              src="/google.png"
              alt="Google 로그인"
              className="w-full h-full object-cover"
            />
          </button>
          <button className="w-12 h-12 rounded-full overflow-hidden shadow hover:scale-105 transition">
            <img
              src="/kakao.png"
              alt="Kakao 로그인"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
