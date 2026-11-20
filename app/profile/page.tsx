import { Metadata } from "next";
import ProfileView from "@/frontend/views/ProfileView";

export const metadata: Metadata = {
  title: "My Subscribed Services & Agreements | Money Vriksh",
  description:
    "View your subscribed research advisory services, payment status, and signed SEBI MITC compliance agreements.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
