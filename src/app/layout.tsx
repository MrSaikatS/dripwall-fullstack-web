import Header from "@/components/Header/Header";
import ThemeProvider from "@/components/Providers/ThemeProvider";
import { geistSans } from "@/lib/fonts";
import { LayoutChildrenProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | DripWall",
    default: "DripWall",
  },
  description: "Discover, collect, and share stunning wallpapers.",
};

const RootLayout = ({ children }: LayoutChildrenProps) => {
  return (
    <html
      lang="en"
      className={cn("font-sans", geistSans.variable)}
      suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute={"class"}
          defaultTheme="dark"
          enableSystem={false}>
          <Header />

          <main className="pt-16">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
