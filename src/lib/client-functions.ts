export const fetchLogin = async (__data: { email: string; password: string }) => {
  await new Promise((resolve, reject) =>
    setTimeout(reject, 1000)
  );
};
