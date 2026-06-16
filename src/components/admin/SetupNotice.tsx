export function SetupNotice() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-display text-2xl font-semibold text-amber-900">
          Connect Supabase to finish setup
        </h2>
        <p className="mt-2 text-sm text-amber-800">
          The dashboard is installed, but it needs your Supabase project to store
          data. Three quick steps:
        </p>
        <ol className="mt-4 space-y-3 text-sm text-amber-900">
          <li>
            <strong>1.</strong> In the Supabase SQL editor, run the script at{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5">
              supabase/schema.sql
            </code>{" "}
            (creates tables + the <code>media</code> storage bucket).
          </li>
          <li>
            <strong>2.</strong> Copy{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5">.env.example</code>{" "}
            to <code className="rounded bg-amber-100 px-1.5 py-0.5">.env.local</code>{" "}
            and fill in your project URL + keys (Settings → API).
          </li>
          <li>
            <strong>3.</strong> Restart the dev server. This screen will
            disappear automatically.
          </li>
        </ol>
      </div>
    </div>
  );
}
