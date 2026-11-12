// Escapes "</" so a value containing a literal "</script>" can never
// prematurely close the JSON-LD <script> tag it's embedded in.
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/<\//g, "<\\/");
}
