"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";
import { Button, Input } from "./ui";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-[13px] font-medium text-plum">
          Password
        </label>
        <Input
          name="password"
          type="password"
          autoFocus
          required
          placeholder="Enter admin password"
        />
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
