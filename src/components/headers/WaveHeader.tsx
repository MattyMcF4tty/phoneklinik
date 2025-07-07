import React, { FC } from 'react';

interface WaveHeaderProps {
  title: string;
  subtitle?: string;
}

const WaveHeader: FC<WaveHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-[#12308b] via-[#1561c9] to-[#08a5f4] flex flex-col items-center justify-center text-center pt-10 pb-32">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 h-10">
        {title}
      </h1>
      {subtitle && (
        <h2 className="text-white text-base md:text-lg opacity-90">
          {subtitle}
        </h2>
      )}

      {/* decorative bottom wave */}
      <svg
        className="absolute inset-x-0 -bottom-1 w-full h-24 text-gray-50"
        viewBox="0 0 1439 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,192L60,170.7C120,149,240,107,360,90.7C480,75,600,85,720,117.3C840,149,960,203,1080,202.7C1200,203,1320,149,1380,122.7L1440,96V400H0Z"
        />
      </svg>
    </header>
  );
};

export default WaveHeader;
