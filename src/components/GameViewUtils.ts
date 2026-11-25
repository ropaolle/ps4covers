import usFlag from "../assets/us_flag.svg";
import euFlag from "../assets/eu_flag.svg";
import japanFlag from "../assets/japan_flag.svg";

const FLAG_MAP: Record<string, { src: string }> = {
  us: usFlag,
  eu: euFlag,
  japan: japanFlag,
};

export function getFlagImage(region: string): string {
  return FLAG_MAP[region.toLowerCase()]?.src ?? "";
}

export function formatBytes(bytes: number, decimals = 0): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
