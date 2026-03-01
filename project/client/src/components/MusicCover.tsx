import React, { useState } from "react";

interface MusicCoverProps {
  src?: string | null;
  alt?: string;
  className?: string;
}

const MusicCover: React.FC<MusicCoverProps> = ({ src, alt, className = "w-full aspect-square" }) => {
  const [hasError, setHasError] = useState(false);

  const Fallback = (
    <div className={`${className} rounded bg-[#242424] flex items-center justify-center shadow-lg`}>
      <div className="w-[40%] h-[40%] rounded-full border-[3px] border-[#ffffff10] flex items-center justify-center">
        <div className="w-[20%] h-[20%] rounded-full bg-[#ffffff10]" />
      </div>
    </div>
  );

  if (!src || hasError) {
    return Fallback;
  }

  return (
    <img
      src={src}
      alt={alt || "Cover"}
      className={`${className} object-cover rounded shadow-lg`}
      onError={() => setHasError(true)}
    />
  );
};

export default MusicCover;