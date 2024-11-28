export const parseObjectToQuery = (obj: Record<string, any>) => {
  let s = "";
  for (const key in obj) {
    if (s != "") {
      s += "&";
    }
    s += key + "=" + encodeURIComponent(obj[key]);
  }

  return s;
};
