import AuthView from "@/frontend/views/AuthView";
import { Suspense } from "react";

export const metadata = {
  title: "Login & Signup - Money Vriksh SEBI Registered Research Analyst",
  description: "Sign in or register for Money Vriksh client portal and research advisory access.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
      <AuthView />
    </Suspense>
  );
}
