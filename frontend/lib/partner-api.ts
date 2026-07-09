export const partnerApiBaseUrl = process.env.PARTNER_API_URL || "http://localhost:4100";

export function partnerApiUrl(path: string) {
  return new URL(path.replace(/^\/+/, ""), `${partnerApiBaseUrl.replace(/\/+$/, "")}/`).toString();
}
