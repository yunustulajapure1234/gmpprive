import React, { useState, useEffect } from "react";

const OptimizedImage = ({ src, alt, className }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;

    img.onload = () => setStatus("loaded");
    img.onerror = () => setStatus("error");
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {/* Skeleton */}
      {status === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200" />
      )}

      {/* Fallback */}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-xs text-gray-400 font-semibold">
            {alt || "Service"}
          </span>
        </div>
      )}

      {/* Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          status === "loaded" ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default OptimizedImage;
