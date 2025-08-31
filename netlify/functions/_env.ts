export function mustGet(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}
export function maybeGet(name: string): string | undefined {
  return process.env[name] || undefined;
}
export function okJson(body: any, extraHeaders: Record<string,string> = {}) {
  return { statusCode: 200, headers: { "content-type":"application/json", ...extraHeaders }, body: JSON.stringify(body) };
}
export function err(status: number, msg: string) {
  return { statusCode: status, body: msg };
}
