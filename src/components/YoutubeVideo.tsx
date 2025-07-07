import React, { FC } from 'react';

interface VideoProps {
  videoId: string;
  options?: {
    autoplay?: '0' | '1';
    mute?: '0' | '1';
    loop?: '0' | '1';
    playlist: string;
    controls: '0' | '1';
    modestbranding: '0' | '1';
    rel: '0' | '1';
    fs: '0' | '1';
    disablekb: '0' | '1';
    playsinline: '0' | '1';
  };
}

const YoutubeVideo: FC<VideoProps> = ({ videoId, options }) => {
  const params = new URLSearchParams();

  // Add options to params
  if (options) {
    for (const [key, value] of Object.entries(options)) {
      params.append(key, value);
    }
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
        className="absolute inset-[-1%] w-[102%] h-[102%] object-fill pointer-events-none border-0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="YouTube video background"
      />
    </div>
  );
};

export default YoutubeVideo;
