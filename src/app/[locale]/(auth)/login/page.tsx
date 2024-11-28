import { LoginForm } from "@/components/login-form";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function RegisterPage({ params }: IDefaultPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <main className="flex items-center justify-center flex-1">
      <LoginForm />
    </main>
  );
}
