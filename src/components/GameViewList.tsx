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
            className={`flex w-full h-38 items-center999 gap-4 rounded-lg border p-3 text-left transition sm:gap-6 ${
              selected
                ? "border-blue-600 bg-blue-50 shadow-md ring-2 ring-blue-400"
                : "border-gray-200 bg-white shadow-sm hover:bg-gray-50"
            }`}
          >
            <img
              src={game.src}
              alt=""
              loading="lazy"
              className={`h-20 w-20 shrink-0 rounded object-cover sm:h-32 sm:w-32 ${game.working ? "" : "grayscale opacity-25"}`}
            />

            <div className="flex gap-0 flex-col justify-between2 h-full">
              <div className="flex justify-between items-center">
                <div className="font-medium text-gray-900">{game.altName}</div>
                <div className="">
                  <img
                    src={getFlagImage(game.region)}
                    alt={game.region}
                    className="hidden h-6 w-auto shrink-0 sm:block"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {game.id} · {formatBytes(game.size)} · <span>Backup: {game.backup}</span>
              </div>
              <div className="text-sm text-gray-500">
                {game.dlcs && (
                  <div>
                    <span className="font-medium">Dlc's:</span> {game.dlcs}
                  </div>
                )}
                {game.comment && (
                  <div className="">
                    <span className="font-medium">Comment:</span> {game.comment}
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mt-auto">
                <div className="truncate rounded bg-blue-500/85 px-2 py-1 text-xs font-medium text-white">
                  🏷️ {game.genre}
                </div>

                <div className="text-xs font-medium">
                  {game.owner && <span className="rounded px-2 py-1 mr-2 rounded bg-blue-100 text-blue-800">Own</span>}
                  {game.completed && (
                    <span className="rounded px-2 mr-2 py-1 rounded bg-green-100 text-green-800">Completed</span>
                  )}
                  {game.playing && (
                    <span className="rounded px-2 mr-2 py-1 rounded bg-orange-100 text-orange-800">Playing</span>
                  )}
                  {game.latestUpdate !== "No Update" && game.latestUpdate > game.version && (
                    <span
                      className="rounded  px-2 py-1 bg-red-100 text-red-800"
                      title={`${game.version} (latest ${game.latestUpdate})`}
                    >
                      Update available
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
