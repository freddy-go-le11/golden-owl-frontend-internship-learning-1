import { ResponseError } from "@/lib/DTO";

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

export const errorHandler = async (
  func: () => Promise<any>
): Promise<[any, null] | [null, any]> => {
  try {
    const result = await func();
    return [result, null];
  } catch (error) {
    return [null, error];
  }
};

interface ICustomizeFetchParams {
  url: string;
  method: string;
  metadata: Omit<RequestInit, "method" | "credentials">;
}

const DEFAULT_CUSTOMIZE_FETCH_PARAMS = {
  method: "GET",
};

export async function customizeFetch(
  params: ICustomizeFetchParams
): Promise<[any, null] | [null, ResponseError]> {
  const { url, method, metadata } = Object.assign(
    DEFAULT_CUSTOMIZE_FETCH_PARAMS,
    params
  );

  return errorHandler(async () => {
    const res = await fetch(url, {
      method: method,
      credentials: "include",
      ...metadata,
      headers: {
        "Content-Type": "application/json",
        ...(metadata?.headers ?? {}),
      },
    });

    if (!res.ok) throw new ResponseError(res);

    const payload = await res.json();
    return payload.data;
  });
}
