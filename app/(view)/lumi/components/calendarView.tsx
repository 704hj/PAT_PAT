"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React from "react";
//calendar 라이브러리
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarView({
  onSelectDate,
}: {
  // ✅ string → Date 로 바꿈 (Date 그대로 부모에게 넘겨야 별자리 계산 가능)
  onSelectDate: (date: Date) => void;
}) {
  //calendar 라이브러리
  const [value, onChange] = useState<Value>(new Date());
  //달력 모달
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleCalendar = () => {
    setIsOpen(!isOpen);
  };

  const handelDateChange = (selectedDate: any) => {
    onChange(selectedDate);
    setIsOpen(false);
    // moment 라이브러리 제거, 부모에게 Date 객체 그대로 전달
    onSelectDate(selectedDate);
  };
  /**
   * > 달력 아이콘 클릭
   *    > 달력 모달 열림
   *    > 오늘 날짜 체크된 채로 모달 열림
   *    > 다른 날짜 클릭시 해당 날짜의 값 받아오기
   *        > 클릭된 날짜가 어떤 별자리에 속하는지?
   */

  return (
    <div>
      <div
        className="text-white/90 text-[16px] mb-3"
        onClick={handleToggleCalendar}
      >
        달력!!
      </div>
      {isOpen && (
        <Calendar
          onChange={handelDateChange}
          value={value}
          calendarType="gregory" // 일요일부터 시작
          minDetail="year" // 월, 년도 보기 까지만 지원
          prev2Label={null}
          next2Label={null}
          showNeighboringMonth={false} // 이번 달 날짜만 렌더링
        />
      )}
      ;
    </div>
  );
}
