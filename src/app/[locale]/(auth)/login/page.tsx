import { LoginForm } from "@/components/login-form";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center flex-1">
      <LoginForm />
    </main>
  );
}
