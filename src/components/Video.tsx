import React, { FC } from 'react';

interface VideoProps {}

const VideoEmbed: FC<VideoProps> = ({}) => {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: '9Vjfxn5soBs',
    controls: '0',
    modestbranding: '1',
    rel: '0',
    fs: '0',
    disablekb: '1',
    playsinline: '1',
  });

  return (
    <div className="relative w-full h-full overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/9Vjfxn5soBs?${params.toString()}`}
        className="absolute inset-[-1%] w-[102%] h-[102%] object-fill pointer-events-none border-0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="YouTube video background"
      ></iframe>
    </div>
  );
};

export default VideoEmbed;
