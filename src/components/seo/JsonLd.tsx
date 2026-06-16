/**
 * Renders a JSON-LD <script> for structured data. Server-safe; the payload is
 * serialised once at render. Use one per schema object (or pass an array).
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; we only embed our own data.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
