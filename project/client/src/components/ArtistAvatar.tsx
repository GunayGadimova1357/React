import { User } from "lucide-react";
import React, { useState } from "react";

interface ArtistAvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
}

const ArtistAvatar: React.FC<ArtistAvatarProps> = ({ src, alt, className = "w-7 h-7" }) => {
  const [hasError, setHasError] = useState(false);

  const Fallback = (
    <div className={`${className} rounded-full bg-[#2a2a2a] flex items-center justify-center overflow-hidden`}>
      <User />
    </div>
  );

  if (!src || hasError) return Fallback;

  return (
    <div className={`${className} rounded-full overflow-hidden bg-[#2a2a2a] shadow-inner`}>
      <img
        src={src}
        alt={alt || "Artist"}
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export default ArtistAvatar;