type TLocale = "vi" | "en";

type TSession = {
  id: number;
  email: string;
  role: ENUM_USER_ROLE;
};

type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;