import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DripWall - Beautiful Wallpapers",
  description:
    "Discover, collect, and share stunning wallpapers. DripWall is your destination for high-quality wallpapers.",
};

const page = () => {
  return (
    <section className="grid h-dvh place-items-center">
      <div className="space-y-4 text-center">
        <h1 className="text-5xl font-semibold">Welcome to DripWall</h1>
        <h2 className="text-3xl">
          Discover, collect, and share stunning wallpapers
        </h2>
      </div>
    </section>
  );
};

export default page;
