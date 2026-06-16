import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="font-display text-3xl font-semibold text-violet-deep">
            By Areeqaan
          </div>
          <p className="mt-1 text-sm text-muted">Admin dashboard</p>
        </div>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
          <LoginForm />
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          Protected area · authorised access only
        </p>
      </div>
    </div>
  );
}
