export interface Quote {
  id: string;
  qId: string;
  serviceType: string;
  Submitted: string;
  additionalNotes: string;
  status: "pending" | "in_review" | "send" | "closed";
}

export interface QuoteDetails {
  id: string;
  qId: string;
  Submitted: string;
  LastUpdated: string;
  ServiceType: string;
  Details: {
    ServiceRequested: string | null;
    propertyType: string;
    currentProgress: string;
    notes: string | null;
  };
  UploadedPhotos: {
    count: number;
    url: string[];
  };
}

export interface QuotesApiResponse {
  success: boolean;
  message: string;
  data: Quote[];
}

export interface QuoteDetailsApiResponse {
  success: boolean;
  message: string;
  data: QuoteDetails;
}

export type FilterTab = "All" | "pending" | "in_review" | "send" | "closed";

export const FILTER_TABS: FilterTab[] = [
  "All",
  "pending",
  "in_review",
  "send",
  "closed",
];

export const statusStyles: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  pending: {
    label: "Pending",
    bg: "bg-yellow-100",
    text: "text-yellow-700",
  },
  in_review: {
    label: "In Review",
    bg: "bg-blue-100",
    text: "text-blue-700",
  },
  send: {
    label: "Sent",
    bg: "bg-purple-100",
    text: "text-purple-700",
  },
  closed: {
    label: "Closed",
    bg: "bg-gray-100",
    text: "text-gray-700",
  },
};

export const badgeColorMap: Record<string, string> = {
  pending: "#D97706",
  in_review: "#2563EB",
  send: "#7C3AED",
  closed: "#6B7280",
};
