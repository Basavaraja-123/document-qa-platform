'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => {
    const [imgLoaded, setImgLoaded] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted',
          className
        )}
        {...props}
      >
        {src && (
          <img
            src={src}
            alt={alt}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(false)}
            className={cn(
              'aspect-square h-full w-full object-cover',
              !imgLoaded && 'hidden'
            )}
          />
        )}
        {!imgLoaded && fallback && (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
            {fallback}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };
