import type { CSSProperties } from "hono/jsx";
import { languageColors } from "../lib/language-colors";
import {
  cardContainerStyle,
  titleStyle,
  colorDotStyle,
  progressBarBackgroundStyle,
  secondaryTextStyle,
  languageItemStyle,
  colors,
} from "../lib/common-styles";

interface LanguageData {
  language: string;
  bytes: number;
  percentage: number;
}

interface CompactLanguageStatsProps {
  username: string;
  languages: LanguageData[];
}

export const CompactLanguageStats = ({ languages }: CompactLanguageStatsProps) => {
  const containerStyle: CSSProperties = {
    ...cardContainerStyle,
    width: "100%",
    height: "100%",
  };

  // Progress bar container
  const progressBarContainerStyle: CSSProperties = {
    ...progressBarBackgroundStyle,
    width: "100%",
    height: "8px",
    borderRadius: "4px",
    display: "flex",
    marginBottom: "20px",
  };

  // Grid container for language items
  const gridContainerStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  };

  // Individual language item (extends base style)
  const languageListItemStyle: CSSProperties = {
    ...languageItemStyle,
    width: "48%",
    padding: "4px",
  };

  const languageNameStyle: CSSProperties = {
    fontSize: "12px",
    fontWeight: "500",
    flexGrow: 1,
  };

  const percentageStyle: CSSProperties = {
    ...secondaryTextStyle,
    fontSize: "12px",
  };

  // Take only top 6 languages
  const topLanguages = languages.slice(0, 6);

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Most Used Languages</h2>

      {/* Progress bar showing all languages */}
      <div style={progressBarContainerStyle}>
        {topLanguages.map((lang, index) => {
          const segmentStyle: CSSProperties = {
            width: `${lang.percentage}%`,
            height: "100%",
            backgroundColor: languageColors[lang.language] || colors.language.default,
            // Add small gap between segments except for the first one
            marginLeft: index > 0 ? "1px" : "0",
          };
          return <div key={lang.language} style={segmentStyle} />;
        })}
      </div>

      {/* Grid of language items */}
      <div style={gridContainerStyle}>
        {topLanguages.map((lang) => (
          <div key={lang.language} style={languageListItemStyle}>
            <div
              style={colorDotStyle(10, languageColors[lang.language] || colors.language.default)}
            />
            <span style={languageNameStyle}>{lang.language}</span>
            <span style={percentageStyle}>{lang.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
