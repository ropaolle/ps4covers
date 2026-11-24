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
  completed: boolean;
  playing: boolean;
  version: string;
  working: boolean;
  dlcs: string;
  comment: string;
  latestUpdate: string;
  region: string;
  altName: string;
}

interface Props {
  games: GameItem[];
  genres: [string, number][];
}

const FLAG_MAP: Record<string, { src: string }> = { us: usFlag, eu: euFlag, japan: japanFlag };

function getFlagImage(region: string): string {
  return FLAG_MAP[region.toLowerCase()]?.src ?? "";
}

function formatBytes(bytes: number, decimals = 0) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024; // Change to 1000 for decimal units
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export default function GameView({ games, genres }: Props) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [genre, setGenre] = useState("");
  const [completedOnly, setCompletedOnly] = useState(false);
  const [playingOnly, setPlayingOnly] = useState(false);
  const [selectedOnly, setSelectedOnly] = useState(false);
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([]);

  const filteredImages = games.filter(
    (img) =>
      (!completedOnly || img.completed) &&
      (!playingOnly || img.playing) &&
      (!selectedOnly || selectedGameIds.includes(img.id)) &&
      (!genre || img.genre.split(",").some((item) => item.trim() === genre)) &&
      (img.genre.toLowerCase().includes(query.toLowerCase().trim()) ||
        img.name.toLowerCase().includes(query.toLowerCase().trim())),
  );

  const sortedImages = () => {
    if (!sort) return filteredImages;

    const direction = sortDirection === "asc" ? 1 : -1;

    return [...filteredImages].sort((a, b) => {
      if (sort === "size") {
        return (a.size - b.size) * direction;
      }
      if (sort === "owner") {
        return (Number(a.owner) - Number(b.owner)) * direction;
      }

      const aValue = String(a[sort as keyof GameItem] ?? "");
      const bValue = String(b[sort as keyof GameItem] ?? "");
      return aValue.localeCompare(bValue) * direction;
    });
  };

  const Badge = ({ value, icon, title }: { value: string | boolean; icon: string; title: string }) => {
    if (!value) return null;
    return (
      <p className="text-right font-medium text-xl text-black" title={`${title}`}>
        {icon}
      </p>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <p className="text-sm text-gray-500">
          Showing {filteredImages.length} of {games.length} games · {selectedGameIds.length} selected
        </p>
      </div>

      {selectedGameIds.length > 0 && (
        <div>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Selected:</span> {selectedGameIds.join(", ")}
          </p>
        </div>
      )}

      {/* Filter Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name and tag..."
          className="w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <select
          name="sort"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setSortDirection("desc");
          }}
          className="w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="name">Name</option>
          <option value="id">Id</option>
          <option value="size">Size</option>
          <option value="genre">Genre</option>
          <option value="backup">Backup</option>
          <option value="region">Region</option>
          <option value="dlcs">DLC's</option>
          <option value="owner">Owner</option>
          <option value="comment">Comment</option>
        </select>

        <button
          type="button"
          onClick={() => setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"))}
          className="shrink-0 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          title={`Sort ${sortDirection === "asc" ? "ascending" : "descending"}; click to reverse`}
        >
          {sortDirection === "asc" ? "Asc ↑" : "Desc ↓"}
        </button>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">ALL ({games.length})</option>
          {genres.map(([genre, count]) => (
            <option key={genre} value={genre}>
              {genre} ({count})
            </option>
          ))}
        </select>

        <label className="flex shrink-0 items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={completedOnly}
            onChange={(e) => setCompletedOnly(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Completed
        </label>
        <label className="flex shrink-0 items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={playingOnly}
            onChange={(e) => setPlayingOnly(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Playing
        </label>
        <label className="flex shrink-0 items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={selectedOnly}
            onChange={(e) => setSelectedOnly(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Selected
        </label>
      </div>

      {/* Responsive Image Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedImages().map((img) => (
            <div
              key={img.src}
              className={`group overflow-hidden rounded-lg border transition ${
                selectedGameIds.includes(img.id)
                  ? "border-blue-600 bg-blue-50 shadow-xl ring-4 ring-blue-400"
                  : "border-gray-200 bg-white shadow-sm hover:shadow-md"
              }`}
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100" title={img.id}>
                <button
                  type="button"
                  aria-label={`${selectedGameIds.includes(img.id) ? "Deselect" : "Select"} ${img.name}`}
                  aria-pressed={selectedGameIds.includes(img.id)}
                  onClick={() =>
                    setSelectedGameIds((ids) =>
                      ids.includes(img.id) ? ids.filter((id) => id !== img.id) : [...ids, img.id],
                    )
                  }
                  className="relative block h-full w-full cursor-pointer p-0"
                >
                  <img
                    src={img.src}
                    alt=""
                    loading="lazy"
                    className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${img.working ? "" : "grayscale opacity-25"}`}
                  />
                  <div className="absolute bottom-4 right-4 rounded border border-white/20 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/75">
                    <Badge
                      value={img.latestUpdate !== "No Update" && img.latestUpdate > img.version}
                      icon="⚠️"
                      title={`${img.version} (latest ${img.latestUpdate})`}
                    />
                    <Badge value={img.dlcs} icon="📦" title={img.dlcs} />
                    <Badge value={img.backup} icon="💾" title={img.backup} />
                    <Badge value={img.owner} icon="💳" title="Köpt i PSN" />
                    <Badge value={img.completed} icon="👍" title="Completed" />
                  </div>
                </button>
                {selectedGameIds.includes(img.id) && (
                  <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-green-700 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                    ✓ Selected
                  </span>
                )}
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between">
                  <p
                    className="truncate text-sm font-medium text-gray-700"
                    title={`${img.id} - ${img.altName}: ${formatBytes(img.size, 2)}`}
                  >
                    {img.altName}
                  </p>
                  <p className="text-sm text-gray-700 ml-2 text-nowrap" title={img.id}>
                    {formatBytes(img.size)}
                  </p>
                </div>

                {img.dlcs && (
                  <p className="truncate text-xs font-medium text-gray-500 pt-1" title={img.dlcs}>
                    DLC: {img.dlcs}
                  </p>
                )}
                {img.comment && (
                  <p className="truncate text-xs font-medium text-gray-500 pt-1" title={img.comment}>
                    Comment: {img.comment}
                  </p>
                )}
                <div className="flex justify-between gap-2 pt-2">
                  <span className="truncate bg-blue-500/85 text-white px-2 py-1 rounded text-xs font-medium">
                    🏷️ {img.genre}
                  </span>
                  <img src={getFlagImage(img.region)} alt={img.region} className="h-6 w-auto" />
                </div>
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
