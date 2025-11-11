import * as React from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
}

export const ImageWithFallback = React.forwardRef<HTMLImageElement, ImageWithFallbackProps>(
  ({ src, alt, fallback, onError, ...props }, ref) => {
    const [imgSrc, setImgSrc] = React.useState(src);
    const [hasError, setHasError] = React.useState(false);

    // Reset when src changes
    React.useEffect(() => {
      setImgSrc(src);
      setHasError(false);
    }, [src]);

    const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (!hasError) {
        setHasError(true);
        const fallbackSrc = fallback || `https://images.unsplash.com/photo-1447933601403-0c6688de566e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MXx8fHwxNzU1NzcwMzQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral`;
        setImgSrc(fallbackSrc);
      }
      
      if (onError) {
        onError(event);
      }
    };

    return (
      <img
        ref={ref}
        src={imgSrc}
        alt={alt}
        onError={handleError}
        {...props}
      />
    );
  }
);

ImageWithFallback.displayName = 'ImageWithFallback';