import React, { useEffect, useState } from "react";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

import { albumApi } from "@/api/albumApi";
import { mapAlbumToUi, UiAlbum } from "@/mappers/musicMappers";
import { usePlayer } from "@/context/PlayerContext";
import { EmptyState, renderSkeleton } from "./VisualHelper";
import { Library, Play } from "lucide-react";

const DisplayHome = () => {
  const { t } = useTranslation();
  const { tracks } = usePlayer();
  const [albums, setAlbums] = useState<UiAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const data = await albumApi.getAll();
        setAlbums(data.map(mapAlbumToUi));
      } catch (error) {
        console.error("Failed to load albums", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  const swiperConfig = {
    modules: [FreeMode, Mousewheel],
    spaceBetween: 15,
    slidesPerView: "auto" as const,
    freeMode: true,
    mousewheel: { forceToAxis: true },
  };

  return (
    <div className="flex flex-col min-h-full transition-all duration-300">
      <div className="px-6 pb-20">
        
        <section className="mb-10">
          <div className="flex justify-between items-end mb-6">
            <h1 className="font-bold text-2xl text-white">{t("home.featured_charts")}</h1>
            
          </div>

          {loading ? (
            renderSkeleton()
          ) : albums.length > 0 ? (
            <Swiper {...swiperConfig} className="album-swiper !overflow-visible">
              {albums.map((item) => (
                <SwiperSlide key={item.id} className="!w-[180px]">
                  <AlbumItem name={item.name} desc={item.desc} id={item.id} image={item.image} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <EmptyState 
              title={t("home.no_albums_title", "Nothing here yet")}
              message={t("home.no_albums_desc", "We couldn't find any charts. Please check your connection or try again later.")}
              icon={Library}
            />
          )}
        </section>

        <section className="mb-10">
          <h1 className="my-5 font-bold text-2xl text-white">{t("home.todays_hits")}</h1>
          
          {tracks.length === 0 && loading ? (
            renderSkeleton()
          ) : tracks.length > 0 ? (
            <Swiper {...swiperConfig} className="song-swiper !overflow-visible">
              {tracks.map((item) => (
                <SwiperSlide key={item.id} className="!w-[180px]">
                  <SongItem name={item.name} desc={item.artist} id={item.id} image={item.image} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <EmptyState 
              title={t("home.no_songs_title", "Quiet for now...")}
              message={t("home.no_songs_desc", "Looks like today's hits are taking a break. They'll be back soon!")}
              icon={Play}
            />
          )}
        </section>
        
      </div>
    </div>
    
  );
  
};

export default DisplayHome;