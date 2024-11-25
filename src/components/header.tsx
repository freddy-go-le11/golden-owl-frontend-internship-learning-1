import { ToggleTheme } from "./toggle-theme";

export function Header() {
  return (
    <header className="top-0 sticky flex justify-center items-center w-full h-16">
      <div className="w-full max-w-6xl flex justify-between mx-4">
        <div />
        <ToggleTheme />
      </div>
    </header>
  );
}
