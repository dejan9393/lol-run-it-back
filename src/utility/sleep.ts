export const sleep = <T>(timeoutMs: number): Promise<T> => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, timeoutMs);
  });
};
