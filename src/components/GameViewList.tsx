import type { GameItem } from "./GameView";
import { formatBytes, getFlagImage } from "./GameViewUtils";

interface Props {
  games: GameItem[];
  selectedGameIds: string[];
  onToggleSelection: (id: string) => void;
}

export default function GameViewList({ games, selectedGameIds, onToggleSelection }: Props) {
  return (
    <div className="space-y-3">
      {games.map((game) => {
        const selected = selectedGameIds.includes(game.id);

        return (
          <button
            key={game.id}
            type="button"
            aria-label={`${selected ? "Deselect" : "Select"} ${game.name}`}
            aria-pressed={selected}
            onClick={() => onToggleSelection(game.id)}
            className={`flex w-full h-32 items-center gap-4 rounded-lg border p-3 text-left transition sm:gap-6 ${
              selected
                ? "border-blue-600 bg-blue-50 shadow-md ring-2 ring-blue-400"
                : "border-gray-200 bg-white shadow-sm hover:bg-gray-50"
            }`}
          >
            <img
              src={game.src}
              alt=""
              loading="lazy"
              className={`h-20 w-20 shrink-0 rounded object-cover sm:h-24 sm:w-24 ${game.working ? "" : "grayscale opacity-25"}`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <span className="truncate font-medium text-gray-900">{game.altName}</span>
              </div>
              <p className="mt-1 truncate text-sm text-gray-500" title={game.name}>
                {game.name} · {game.id}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                <span className="font-medium">{game.genre}</span>
                {game.backup && <span>Backup: {game.backup}</span>}
                {game.dlcs && <span>DLC: {game.dlcs}</span>}
                {game.comment && (
                  <span className="truncate" title={game.comment}>
                    Comment: {game.comment}
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium">
                {game.owner && <span className="rounded bg-gray-100 px-2 py-1">Owned</span>}
                {game.completed && <span className="rounded bg-green-100 px-2 py-1 text-green-800">Completed</span>}
                {game.playing && <span className="rounded bg-blue-100 px-2 py-1 text-blue-800">Playing</span>}
                {game.latestUpdate !== "No Update" && game.latestUpdate > game.version && (
                  <span
                    className="rounded bg-amber-100 px-2 py-1 text-amber-800"
                    title={`${game.version} (latest ${game.latestUpdate})`}
                  >
                    Update available
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between min-h-full">
              <img src={getFlagImage(game.region)} alt={game.region} className="hidden h-6 w-auto shrink-0 sm:block" />
              <div className="text-sm text-gray-600">{formatBytes(game.size)}</div>
            </div>
            {selected && <span className="shrink-0 text-sm font-semibold text-green-700">Selected</span>}
          </button>
        );
      })}
    </div>
  );
}
