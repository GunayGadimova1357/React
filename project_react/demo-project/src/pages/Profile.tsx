import { StreakChart } from "@/components/StreakChart";
import { useTranslation } from "react-i18next";
import useIsMobile from "@/hooks/useIsMobile";

export default function Profile() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const current = 3;
  const max = 5;

  return (
    <div className={`p-6 space-y-6 ${isMobile ? "pb-20" : ""}`}>
      <div>
        <h1 className="text-2xl font-semibold text-gray-100">
          {t("profile.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("profile.streak", { current, max })}
        </p>
      </div>

      <StreakChart />
    </div>
  );
}