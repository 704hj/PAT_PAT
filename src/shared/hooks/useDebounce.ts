"use client";

import { useEffect, useState } from "react";

/**
 * value 변경을 delay(ms) 만큼 지연시킨 값을 반환
 * - 검색어, 필터 등에 사용
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
