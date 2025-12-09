import React, { FC } from 'react';

interface FacebookPostProps {
  postUrl: string;
  width?: number;
  height?: number;
}

/**
 * Composant pour afficher un post Facebook via iframe
 * Utilise le plugin standard de Facebook
 */
export const FacebookPost: FC<FacebookPostProps> = ({ 
  postUrl, 
  width = 500, 
  height = 667 
}) => {
  const fbIframeUrl = `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(postUrl)}&show_text=true&width=${width}`;

  return (
    <div className="flex justify-center my-4">
      <iframe
        src={fbIframeUrl}
        width={width}
        height={height}
        style={{
          border: 'none',
          overflow: 'hidden'
        }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    </div>
  );
};
