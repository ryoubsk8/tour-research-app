// 検索に関する定数（半径オプション・表示件数）。

/** 検索半径の選択肢（FR-9: ユーザーが切替可能） */
export const RADIUS_OPTIONS: { label: string; meters: number }[] = [
  { label: '徒歩圏 (約1km)', meters: 1000 },
  { label: '近隣 (約3km)', meters: 3000 },
  { label: '広め (約10km)', meters: 10000 },
];

/** デフォルトの検索半径（近隣 約3km） */
export const DEFAULT_RADIUS_METERS = 3000;

/** 各カテゴリで表示する最大件数（FR-6: 約10件） */
export const RESULT_LIMIT = 10;
