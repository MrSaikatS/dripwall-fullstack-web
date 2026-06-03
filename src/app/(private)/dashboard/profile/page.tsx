import type { Metadata } from "next";
import { ProfileContent } from "@/components/Dashboard/ProfileContent";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your profile settings and account.",
};

const ProfilePage = () => {
  return <ProfileContent />;
};

export default ProfilePage;
