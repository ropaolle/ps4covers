import React, { useState } from "react";
import usFlag from "../assets/us_flag.svg";
import euFlag from "../assets/eu_flag.svg";
import japanFlag from "../assets/japan_flag.svg";

export interface GameItem {
  src: string | undefined;
  filename: string;
  name: string;
  id: string;
  size: number;
  genre: string;
  backup: string;
  owner: boolean;
  played: boolean;
  version: string;
  working: boolean;
  dlcs: string | null;
  latestUpdate: string;
  region: string;
  altName: string;
}

interface Props {
  games: GameItem[];
}

function getFlagImage(region: string) {
  switch (region.toLowerCase()) {
    case "us":
      return usFlag.src;
    case "eu":
      return euFlag.src;
    case "japan":
      return japanFlag.src;
    default:
      return "";
  }
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024; // Change to 1000 for decimal units
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export default function GameView({ games }: Props) {
  const [query, setQuery] = useState("");

  // Filter games case-insensitively based on the filename
  const filteredImages = games.filter(
    (img) =>
      // img.name.toLowerCase().includes(query.toLowerCase().trim()),
      img.genre.toLowerCase().includes(query.toLowerCase().trim()) ||
      img.name.toLowerCase().includes(query.toLowerCase().trim()),
  );

  const sortedImages = filteredImages.sort((a, b) => a.name.localeCompare(b.name));
  // const sortedImages = filteredImages.sort((a, b) => a.id.localeCompare(b.id));
  // const sortedImages = filteredImages.sort((a, b) => b.size - a.size);

  return (
    <div className="space-y-6">
      {/* Filter Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name and tag..."
          className="w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-sm text-gray-500">
          Showing {filteredImages.length} of {games.length} games
        </p>
      </div>

      {/* Responsive Image Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedImages.map((img) => (
            <div
              key={img.src}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={img.src}
                  alt={img.filename}
                  loading="lazy"
                  className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${img.working ? "" : "grayscale opacity-25"}`}
                />
                <div className="absolute inset-0 flex items-end justify-end p-4">
                  <p
                    className="text-right font-medium text-xl text-black"
                    title={`${img.version} (latest ${img.latestUpdate})`}
                  >
                    {img.latestUpdate !== "No Update" && img.latestUpdate > img.version ? "⚠️" : ""}
                  </p>
                  {img.dlcs && (
                    <p className="text-right font-medium text-xl text-black" title={`${img.dlcs}`}>
                      📦
                    </p>
                  )}
                  {img.backup && (
                    <p className="text-right font-medium text-xl text-black" title={`${img.backup}`}>
                      💾
                    </p>
                  )}
                  {img.owner && (
                    <p className="text-right font-medium text-xl text-black" title="Köpt">
                      💳
                    </p>
                  )}
                </div>
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-gray-700" title={JSON.stringify(img)}>
                  {img.altName} ({formatBytes(img.size)})
                </p>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="bottom-3 right-3 rounded-md bg-blue-500/75 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  🏷️ {img.genre}
                </span>
                <img
                  src={getFlagImage(img.region)}
                  alt="{img.region}"
                  className="w-8 h-auto border border-gray-300 rounded-xs"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">No games match "{query}".</p>
        </div>
      )}
    </div>
  );
}
