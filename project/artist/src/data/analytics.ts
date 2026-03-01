export type StatItem = {
  label: string;
  value: string;
  change: string;
  isUp: boolean;
};

export type AnalyticsSource = {
  label: string;
  count: number;
  percentage: number;
};

export const analyticsData = {

  overview: [
    { label: "Total Streams", value: "128,432", change: "+12.5%", isUp: true },
    { label: "Monthly Listeners", value: "12,042", change: "+5.2%", isUp: true },
    { label: "Avg. Listen Time", value: "3:42", change: "-1.1%", isUp: false },
  ] as StatItem[],

  sources: [
    { label: "Editorial Playlists", count: 57800, percentage: 45 },
    { label: "User Libraries", count: 32100, percentage: 25 },
    { label: "Search & Radio", count: 19200, percentage: 15 },
    { label: "Other", count: 19200, percentage: 15 },
  ] as AnalyticsSource[],

  lastUpdated: "2026-01-15T12:00:00Z",
};