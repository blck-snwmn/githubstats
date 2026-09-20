/**
 * Language statistics mapping language names to metric values
 */
export interface LanguageStats {
  [language: string]: number;
}

/**
 * Language data with calculated percentage
 */
export interface LanguageData {
  language: string;
  value: number;
  percentage: number;
}
