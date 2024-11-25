import { DEFAULT_LOCALE, LOCALES } from "@/common/constants";

import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: LOCALES,

  defaultLocale: DEFAULT_LOCALE,
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
