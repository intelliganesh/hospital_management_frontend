import { useState, useEffect } from "react";

export const useWindowDimension = () => {
  const [dimension, setDimension] = useState<[number, number]>([
    window.innerWidth,
    window.innerHeight,
  ]);
  /* function start */
  useEffect(() => {
    const debouncedResizeHandler = debounce(() => {
      setDimension([window.innerWidth, window.innerHeight]);
    }, 100); // 100ms
    window.addEventListener("resize", debouncedResizeHandler);
    return () => window.removeEventListener("resize", debouncedResizeHandler);
  }, []);
  return dimension;
};
/* function end */

function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout> | null;
  return (...args: Parameters<T>): void => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, ms);
  };
}
