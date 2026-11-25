import React, { useState } from "react";
import GameViewGrid from "./GameViewGrid";
import GameViewList from "./GameViewList";

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

export default function GameView({ games, genres }: Props) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [genre, setGenre] = useState("");
  const [completedOnly, setCompletedOnly] = useState(false);
  const [playingOnly, setPlayingOnly] = useState(false);
  const [selectedOnly, setSelectedOnly] = useState(false);
  const [selectedGameIds, setSelectedGameIds] = useState<string[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");

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

  const toggleSelection = (id: string) => {
    setSelectedGameIds((ids) =>
      ids.includes(id) ? ids.filter((selectedId) => selectedId !== id) : [...ids, id],
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

        <div className="flex shrink-0 rounded-lg border border-gray-300 p-1" aria-label="Game view">
          <button
            type="button"
            aria-pressed={view === "grid"}
            onClick={() => setView("grid")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${view === "grid" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
          >
            Grid
          </button>
          <button
            type="button"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${view === "list" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
          >
            List
          </button>
        </div>
      </div>

      {filteredImages.length > 0 ? (
        view === "grid" ? (
          <GameViewGrid
            games={sortedImages()}
            selectedGameIds={selectedGameIds}
            onToggleSelection={toggleSelection}
          />
        ) : (
          <GameViewList
            games={sortedImages()}
            selectedGameIds={selectedGameIds}
            onToggleSelection={toggleSelection}
          />
        )
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">No games match "{query}".</p>
        </div>
      )}
    </div>
  );
}
