import type { GameItem } from "./GameView";
import { formatBytes, getFlagImage } from "./GameViewUtils";

interface Props {
  games: GameItem[];
  selectedGameIds: string[];
  onToggleSelection: (id: string) => void;
}

function Badge({ value, icon, title }: { value: string | boolean; icon: string; title: string }) {
  if (!value) return null;
  return (
    <p className="text-right font-medium text-xl text-black" title={title}>
      {icon}
    </p>
  );
}

export default function GameViewGrid({ games, selectedGameIds, onToggleSelection }: Props) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {games.map((img) => {
        const selected = selectedGameIds.includes(img.id);

        return (
          <div
            key={img.src}
            className={`group overflow-hidden rounded-lg border transition ${
              selected
                ? "border-blue-600 bg-blue-50 shadow-xl ring-4 ring-blue-400"
                : "border-gray-200 bg-white shadow-sm hover:shadow-md"
            }`}
          >
            <div className="relative aspect-square overflow-hidden bg-gray-100" title={img.id}>
              <button
                type="button"
                aria-label={`${selected ? "Deselect" : "Select"} ${img.name}`}
                aria-pressed={selected}
                onClick={() => onToggleSelection(img.id)}
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
              {selected && (
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
                <p className="ml-2 text-sm text-gray-700 text-nowrap" title={img.id}>
                  {formatBytes(img.size)}
                </p>
              </div>

              {img.dlcs && (
                <p className="truncate pt-1 text-xs font-medium text-gray-500" title={img.dlcs}>
                  DLC: {img.dlcs}
                </p>
              )}
              {img.comment && (
                <p className="truncate pt-1 text-xs font-medium text-gray-500" title={img.comment}>
                  Comment: {img.comment}
                </p>
              )}
              <div className="flex justify-between gap-2 pt-2">
                <span className="truncate rounded bg-blue-500/85 px-2 py-1 text-xs font-medium text-white">
                  🏷️ {img.genre}
                </span>
                <img src={getFlagImage(img.region)} alt={img.region} className="h-6 w-auto" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
