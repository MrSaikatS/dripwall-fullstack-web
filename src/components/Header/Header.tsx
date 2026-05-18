import Link from "next/link";
import ThemeToggleButton from "../Buttons/ThemeToggleButton";

const Header = () => {
  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 border-b shadow"
      aria-label="app-header">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href={"/"}>
          <h1
            className="text-2xl font-semibold"
            aria-label="App Name">
            DripWall
          </h1>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
            Sign in
          </Link>

          <Link
            href="/register"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
            Sign up
          </Link>

          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
};

export default Header;
