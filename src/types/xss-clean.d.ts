// xss-clean.d.ts
declare module 'xss-clean' {
  export function clean(input: string): string;

  const xssClean: any;
  export default xssClean;
}
