import AuthView from "@/frontend/views/AuthView";
import { Suspense } from "react";

export const metadata = {
  title: "Create Account - Money Vriksh SEBI Registered Research Analyst",
  description: "Register for Money Vriksh client portal and research advisory access.",
};

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
      <AuthView />
    </Suspense>
  );
}
