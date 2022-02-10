export function transformSource(source, opts) {
  return {
    source: source + "\r\n\r\n" + "// loader2",
  };
}
