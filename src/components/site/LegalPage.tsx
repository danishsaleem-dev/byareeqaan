import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";

export type LegalSection = {
  heading: string;
  body: ReactNode[];
};

export function LegalPage({
  eyebrow = "Policies",
  title,
  intro,
  updated,
  sections,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  updated?: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} subtitle={intro} />
      <article className="mx-auto max-w-2xl px-5 pb-28 sm:px-6">
        {updated && (
          <p className="mb-10 text-xs uppercase tracking-luxe text-muted">
            Last updated · {updated}
          </p>
        )}
        <div className="space-y-10">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-2xl font-medium text-ink">
                {s.heading}
              </h2>
              <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted">
                {s.body.map((b, i) => (
                  <p key={i}>{b}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
