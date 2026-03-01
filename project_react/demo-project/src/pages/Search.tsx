import { useTranslation } from "react-i18next";
import { SearchHistoryItem, type SearchItem } from "@/components/SearchHistoryItem";
import useIsMobile from "@/hooks/useIsMobile";

const mockSearches: SearchItem[] = [
  { id: 1, query: "React hooks best practices", date: "2025-09-11" },
  { id: 2, query: "Firebase authentication", date: "2025-09-10" }
];

export default function Search() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className={`p-6 space-y-4 ${isMobile ? "pb-20" : ""}`}>
      <h1 className="text-2xl font-semibold text-gray-100 mb-4">
        {t("search.title")}
      </h1>

      <div className="w-full">
        <input
          type="text"
          placeholder={t("search.placeholder")}
          className="w-full rounded-full bg-[#2a2a2a] text-gray-100 px-4 py-2"
        />
      </div>

      {mockSearches.length === 0 ? (
        <p className="text-gray-400">{t("search.empty")}</p>
      ) : (
        mockSearches.map((s) => <SearchHistoryItem key={s.id} item={s} />)
      )}
    </div>
  );
}
