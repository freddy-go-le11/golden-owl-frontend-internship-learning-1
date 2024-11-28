import { authMiddleware } from "./middlewares/auth-middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default authMiddleware(createMiddleware(routing));

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
