import React, { useState } from "react";

export interface GalleryImage {
  src: string;
  filename: string;
  name?: string;
  id: string;
  size: number;
}

interface Props {
  images: GalleryImage[];
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024; // Change to 1000 for decimal units
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export default function ImageGallery({ images }: Props) {
  const [query, setQuery] = useState("");

  // Filter images case-insensitively based on the filename
  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(query.toLowerCase().trim()),
  );

  return (
    <div className="space-y-6">
      {/* Filter Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by filename (e.g. sunset, forest)..."
          className="w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-sm text-gray-500">
          Showing {filteredImages.length} of {images.length} images
        </p>
      </div>

      {/* Responsive Image Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img) => (
            <div
              key={img.src}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={img.src}
                  alt={img.filename}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end justify-end p-4">
                  <p className="text-right font-small text-black">
                    {img.pkgInfo?.LatestUpdate}
                  </p>
                </div>
              </div>
              <div className="p-3">
                <p
                  className="truncate text-sm font-medium text-gray-700"
                  title={img.id}
                >
                  {img.name} ({formatBytes(img.size)})
                </p>
              </div>
              <div className="p-3">
                {/* <p
                  className="truncate text-sm font-medium text-gray-700"
                  title={img.id}
                >
                  {img.genre}
                </p> */}
                <span className="bottom-3 right-3 rounded-md bg-blue-500/75 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                   {img.genre}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">No images match "{query}".</p>
        </div>
      )}
    </div>
  );
}
