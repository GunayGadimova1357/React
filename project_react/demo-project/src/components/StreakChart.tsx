import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useIsMobile from "@/hooks/useIsMobile";
import { useTranslation } from "react-i18next";

const data = [
  { day: "Mon", value: 1 },
  { day: "Tue", value: 1 },
  { day: "Wed", value: 0 },
  { day: "Thu", value: 1 },
  { day: "Fri", value: 1 },
  { day: "Sat", value: 1 },
  { day: "Sun", value: 0 },
];

export function StreakChart() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  return (
    <Card className="w-full max-w-2xl mx-auto bg-zinc-900 text-white shadow-md rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t("chart.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={isMobile ? 160 : 260}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="streakGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a52a2a" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#a52a2a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#374151" />
            <XAxis dataKey="day" tick={{ fill: "#d1d5db", fontSize: 12 }} />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 1]}
              tick={{ fill: "#d1d5db", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderRadius: "8px",
                border: "none",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#a52a2a"
              fillOpacity={1}
              fill="url(#streakGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}