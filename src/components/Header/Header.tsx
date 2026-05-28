import Link from "next/link";
import AuthHeader from "../Auth/AuthHeader";
import ThemeToggleButton from "../Buttons/ThemeToggleButton";

const Header = () => {
  return (
    <header
      className="fixed top-0 z-50 w-dvw border-b shadow"
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
          <div className="flex items-center gap-4">
            <AuthHeader />
          </div>

          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
};

export default Header;
