// FILE: src/components/common/ItemImage.jsx
// Optimized image component with lazy loading, WebP fallback, and blur-up placeholder

import { useState, useRef, useEffect, memo } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * ItemImage - Optimized catalog item image with progressive loading
 * 
 * Features:
 * - Native lazy loading via Intersection Observer
 * - WebP with PNG fallback
 * - LQIP (Low Quality Image Placeholder) blur-up effect
 * - Error state with fallback icon
 * - Responsive srcset for 1x/2x displays
 * 
 * @param {Object} props
 * @param {string} props.src - Base path to image (without extension)
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.size - Size in pixels (default: 64)
 */
export const ItemImage = memo(function ItemImage({ 
  src, 
  alt, 
  className = '', 
  size = 64 
}) {
  const [status, setStatus] = useState('idle'); // idle | loading | loaded | error
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' } // Start loading 100px before viewport
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Generate srcset for responsive images
  const srcSet = src ? `${src} 1x, ${src.replace('.webp', '@2x.webp')} 2x` : '';
  
  // Fallback to PNG if WebP fails
  const fallbackSrc = src?.replace('.webp', '.png');

  const handleLoad = () => setStatus('loaded');
  const handleError = (e) => {
    // Try PNG fallback
    if (e.target.src.endsWith('.webp') && fallbackSrc) {
      e.target.src = fallbackSrc;
    } else {
      setStatus('error');
    }
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden bg-stone-800/50 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Blur placeholder */}
      <div 
        className={`
          absolute inset-0 bg-gradient-to-br from-stone-700 to-stone-900
          transition-opacity duration-300
          ${status === 'loaded' ? 'opacity-0' : 'opacity-100'}
        `}
      />
      
      {/* Main image */}
      {isInView && src && status !== 'error' && (
        <img
          src={src}
          srcSet={srcSet}
          alt={alt}
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full object-contain
            transition-opacity duration-300
            ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}
          `}
        />
      )}
      
      {/* Error fallback */}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center text-stone-500">
          <ImageOff size={size * 0.5} />
        </div>
      )}
      
      {/* Loading shimmer */}
      {isInView && status !== 'loaded' && status !== 'error' && (
        <div className="absolute inset-0 shimmer" />
      )}
    </div>
  );
});

/**
 * ItemImagePlaceholder - Static placeholder for items without images
 * Uses item type icon as fallback
 */
export const ItemImagePlaceholder = memo(function ItemImagePlaceholder({ 
  Icon, 
  className = '', 
  size = 64,
  color = 'text-stone-500'
}) {
  return (
    <div 
      className={`
        flex items-center justify-center 
        bg-stone-800/50 rounded
        ${className}
      `}
      style={{ width: size, height: size }}
    >
      {Icon && <Icon size={size * 0.5} className={color} />}
    </div>
  );
});

export default ItemImage;
