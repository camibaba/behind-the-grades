import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Sign up · Behind the Grades" };

export default function SignupPage() {
  return (
    <div className="container page">
      <AuthForm mode="signup" />
    </div>
  );
}
