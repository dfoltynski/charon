/* eslint-disable  @typescript-eslint/no-explicit-any */

export const debounce = (callback: (...args: any) => void, wait: number) => {
  let timeoutId: number;
  console.log("asdasd");
  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), wait);
  };
};
