export const fetchLogin = async (__data: { email: string; password: string }) => {
  await new Promise((resolve, reject) =>
    // setTimeout(Math.random() > 0.5 ? () => resolve(data) : reject, 1000)
    setTimeout(reject, 1000)
  );
};
