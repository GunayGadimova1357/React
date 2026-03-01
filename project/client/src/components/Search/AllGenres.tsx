import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IoIosArrowBack } from "react-icons/io";
import { genreApi, GenreResponse } from "@/api/genreApi";
import { Loader2 } from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";

const AllGenres: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [genres, setGenres] = useState<GenreResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const mutedGradients = useMemo(
    () => [
      "from-purple-900/40",
      "from-blue-900/40",
      "from-emerald-900/40",
      "from-rose-900/40",
      "from-amber-900/30",
      "from-indigo-900/40",
    ],
    [],
  );

  const getGenreGradient = (id: string) => {
    const hash = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return mutedGradients[hash % mutedGradients.length];
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await genreApi.getGenres();
        setGenres(data);
      } catch (err) {
        console.error("Failed to fetch genres:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="w-full h-full bg-[#121212] text-zinc-100 overflow-auto custom-scrollbar">
      <header className="sticky top-0 z-20 bg-[#121212]/95 backdrop-blur-xl border-b border-zinc-900 px-6 py-5 flex items-center gap-5">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full text-zinc-500 hover:text-white transition-colors active:scale-90"
        >
          <IoIosArrowBack size={26} />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          {t("search.all_genres_title")}
        </h1>
      </header>

      <main className="p-6 max-w-[1400px] mx-auto pb-40">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-zinc-600" size={32} />
            <span className="text-sm font-medium text-zinc-500">
              {t("common.loading")}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 animate-in fade-in duration-500">
            {genres.map((genre) => (
              <div
                key={genre.id}
                onClick={() => navigate(`/genre/${genre.id}`)}
                className="group relative h-32 p-5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer overflow-hidden flex items-end active:scale-[0.98]"
              >
                <div
                  className={`
                  absolute inset-0 bg-gradient-to-br ${getGenreGradient(genre.id)} to-transparent 
                  transition-opacity duration-500
                  ${isMobile ? "opacity-40" : "opacity-20 group-hover:opacity-60"}
                `}
                />

                <span
                  className={`
                  relative z-10 font-bold text-base transition-transform duration-300 origin-left
                  ${isMobile ? "text-white" : "text-zinc-100 group-hover:scale-105 group-hover:text-white"}
                `}
                >
                  {genre.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllGenres;
