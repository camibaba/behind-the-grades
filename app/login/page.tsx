import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Log in · Behind the Grades" };

export default function LoginPage() {
  return (
    <div className="container auth-page">
      <AuthForm mode="login" />
    </div>
  );
}
