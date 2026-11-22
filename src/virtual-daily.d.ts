declare module 'virtual:daily' {
  const data: {
    cutoff: string;
    issues: unknown[];
    syllabi: Record<string, unknown>;
  };
  export default data;
}
