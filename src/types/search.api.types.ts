// ─── Quotes Search Types ──────────────────────────────────────────────────────

export interface QuoteSearchResult {
  type: string;
  id: string;
  qId: string;
  serviceType: string;
  status: string;
}

export interface SearchQuotesResponse {
  success: boolean;
  message: string;
  data: QuoteSearchResult[];
}
