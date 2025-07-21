/**
 * Language statistics mapping language names to byte counts
 */
export interface LanguageStats {
  [language: string]: number;
}

/**
 * Language data with calculated percentage
 */
export interface LanguageData {
  language: string;
  bytes: number;
  percentage: number;
}
