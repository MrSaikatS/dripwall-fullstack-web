"use client";

import { MoonStarIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="focus-visible:outline-ring relative flex cursor-pointer items-center focus-visible:outline-2">
      <SunIcon
        size={20}
        className="-rotate-90 opacity-100 transition-all duration-300 dark:rotate-0 dark:opacity-0"
      />

      <MoonStarIcon
        size={20}
        className="absolute -rotate-90 opacity-0 transition-all duration-300 dark:rotate-0 dark:opacity-100"
      />
    </button>
  );
};

export default ThemeToggleButton;
