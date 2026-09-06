export type ApiKeySummary = {
  id: string;
  name: string | null;
  start: string | null;
  lastRequest: Date | null;
};

// Better Auth declares lastRequest as a Date but sends an ISO string over its
// API layer, so the value is normalised where it enters the app.
export function toApiKeySummary(apiKey: {
  id: string;
  name: string | null;
  start: string | null;
  lastRequest: Date | string | null;
}): ApiKeySummary {
  return {
    id: apiKey.id,
    name: apiKey.name,
    start: apiKey.start,
    lastRequest: apiKey.lastRequest ? new Date(apiKey.lastRequest) : null,
  };
}
