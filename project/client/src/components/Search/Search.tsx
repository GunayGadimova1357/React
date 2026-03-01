import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IoIosArrowBack } from "react-icons/io";
import { FiSearch, FiX } from "react-icons/fi";
import { Loader2, Grid2X2, AlertCircle } from "lucide-react";

import {
  searchApi,
  SearchResponse,
  SearchResultItem,
  SearchResultType,
} from "@/api/searchApi";
import { genreApi, GenreResponse } from "@/api/genreApi";
import { usePlayer } from "@/context/PlayerContext";
import useDebounce from "@/hooks/useDebounce";
import useIsMobile from "@/hooks/useIsMobile";
import MusicCover from "../MusicCover";
import { EmptyState } from "../VisualHelper";

const Search: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { playWithId } = usePlayer();
  const isMobile = useIsMobile();

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 400);

  const [genres, setGenres] = useState<GenreResponse[]>([]);
  const [isGenresLoading, setIsGenresLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SearchResultType | "all">("all");

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
        setIsGenresLoading(true);
        const data = await genreApi.getGenres();
        setGenres(data);
      } catch (err) {
        console.error("Genres load error:", err);
      } finally {
        setIsGenresLoading(false);
      }
    })();
  }, []);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults(null);
      setIsSearchLoading(false);
      return;
    }
    try {
      setIsSearchLoading(true);
      const data = await searchApi.search(query);
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const groupedResults = useMemo(() => {
    if (!results) return {};
    return results.items.reduce(
      (acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
        return acc;
      },
      {} as Record<SearchResultType, SearchResultItem[]>,
    );
  }, [results]);

  const handleItemClick = (item: SearchResultItem) => {
    switch (item.type) {
      case "song":
        playWithId(item.id);
        break;
      case "artist":
        navigate(`/artist/${item.id}`);
        break;
      case "album":
        navigate(`/album/${item.id}`);
        break;
      case "playlist":
        navigate(`/playlist/${item.id}`);
        break;
    }
  };

  const tabs: { id: SearchResultType | "all"; label: string }[] = [
    { id: "all", label: t("common.all") },
    { id: "song", label: t("search.type.song") },
    { id: "artist", label: t("search.type.artist") },
    { id: "album", label: t("search.type.album") },
    { id: "playlist", label: t("search.type.playlist") },
  ];

  return (
    <div className="w-full h-full bg-[#121212] text-zinc-100 overflow-auto custom-scrollbar">
      <header className="sticky top-0 z-20 bg-[#121212]/95 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-zinc-500 hover:text-white transition active:scale-90"
            >
              <IoIosArrowBack size={24} />
            </button>
            <div className="relative flex-1">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-11 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-700 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
            {isSearchLoading && (
              <Loader2
                className="animate-spin text-zinc-500 shrink-0"
                size={20}
              />
            )}
          </div>

          {isMobile && searchQuery && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all active:scale-95 ${
                    activeTab === tab.id
                      ? "bg-white text-black border-white shadow-lg"
                      : "bg-zinc-900 text-zinc-500 border-zinc-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8 pb-32">
        {!searchQuery ? (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between mb-8 border-b border-zinc-900 pb-4">
              <h2 className="text-xl font-bold text-white">
                {t("search.top_genres")}
              </h2>
              {!isGenresLoading && genres.length > 0 && (
                <button
                  onClick={() => navigate("/search/genres")}
                  className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-2 transition group"
                >
                  {t("common.show_all")}
                  <Grid2X2
                    size={14}
                    className="group-hover:rotate-90 transition-transform"
                  />
                </button>
              )}
            </div>

            {isGenresLoading ? (
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 bg-zinc-900/50 rounded-lg animate-pulse border border-zinc-800/50"
                  />
                ))}
              </div>
            ) : genres.length === 0 ? (
              <div className="py-10">
                <EmptyState
                  title={t("search.genres_empty_title")}
                  message={t("search.genres_empty_message")}
                  icon={AlertCircle}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-4">
                {genres.slice(0, 5).map((genre) => (
                  <div
                    key={genre.id}
                    onClick={() => navigate(`/genre/${genre.id}`)}
                    className="relative h-28 p-5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all cursor-pointer overflow-hidden flex items-end active:scale-95 group"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${getGenreGradient(genre.id)} to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                    <p className="relative z-10 font-bold text-white transition-transform group-hover:translate-x-1 origin-left">
                      {genre.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <div className="animate-in fade-in duration-300">
            {isMobile ? (
              <div className="flex flex-col gap-1">
                {results?.items
                  .filter(
                    (item) => activeTab === "all" || item.type === activeTab,
                  )
                  .map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleItemClick(item)}
                      className="flex items-center gap-4 p-3 rounded-md active:bg-zinc-800/40 transition"
                    >
                      <MusicCover
                        src={item.coverUrl}
                        className={`w-12 h-12 shadow-lg ${item.type === "artist" ? "rounded-full" : "rounded-md"}`}
                      />
                      <div className="flex-1 truncate">
                        <h3 className="text-sm font-medium text-zinc-200 truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1">
                          {item.subtitle || t(`search.type.${item.type}`)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="space-y-12">
                {groupedResults.song && (
                  <section>
                    <h2 className="text-xl font-bold text-white mb-6 border-l-2 border-zinc-800 pl-4">
                      {t("search.songs")}
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                      {groupedResults.song.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => playWithId(item.id)}
                          className="flex items-center gap-4 p-2 rounded-md hover:bg-zinc-900 transition group cursor-pointer border border-transparent hover:border-zinc-800/50"
                        >
                          <MusicCover
                            src={item.coverUrl}
                            className="w-11 h-11 rounded shadow-md"
                          />
                          <div className="truncate">
                            <p className="text-sm font-medium text-zinc-300 group-hover:text-white truncate transition-colors">
                              {item.title}
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {Object.entries({
                  artist: "artists",
                  album: "albums",
                  playlist: "playlists",
                }).map(
                  ([type, label]) =>
                    groupedResults[type as SearchResultType] && (
                      <section key={type}>
                        <h2 className="text-xl font-bold text-white mb-6 border-l-2 border-zinc-800 pl-4">
                          {t(`search.${label}`)}
                        </h2>
                        <div className="grid grid-cols-5 gap-6">
                          {groupedResults[type as SearchResultType]!.map(
                            (item) => (
                              <div
                                key={item.id}
                                onClick={() => handleItemClick(item)}
                                className="flex flex-col p-4 rounded-lg hover:bg-zinc-900 transition group cursor-pointer border border-transparent hover:border-zinc-800/50"
                              >
                                <MusicCover
                                  src={item.coverUrl}
                                  className={`aspect-square w-full mb-4 shadow-2xl transition-transform group-hover:scale-105 ${type === "artist" ? "rounded-full" : "rounded-md"}`}
                                />
                                <p className="text-sm font-bold text-zinc-100 group-hover:text-white truncate">
                                  {item.title}
                                </p>
                                <p className="text-xs text-zinc-500 mt-1 truncate">
                                  {item.subtitle}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </section>
                    ),
                )}
              </div>
            )}

            {results?.items.length === 0 && !isSearchLoading && (
              <div className="py-20 flex justify-center">
                <EmptyState
                  title={t("search.no_results_title")}
                  message={`${t("search.no_results_message")} "${searchQuery}"`}
                  icon={FiSearch}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
