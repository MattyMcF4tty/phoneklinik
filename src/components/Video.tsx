import React from 'react';

const VideoEmbed = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <iframe
        src="https://www.youtube.com/embed/9Vjfxn5soBs?autoplay=1&mute=1&loop=1&playlist=9Vjfxn5soBs&controls=0&modestbranding=1&rel=0&fs=0"
        className="absolute inset-0 w-full h-full object-cover"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="YouTube video background"
      ></iframe>
    </div>
  );
};

export default VideoEmbed;
