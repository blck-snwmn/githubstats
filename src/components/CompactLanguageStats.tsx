import type { CSSProperties } from "hono/jsx";
import type { LanguageData } from "../types/language";
import { colors } from "../lib/colors";
import { fonts } from "../lib/fonts";
import { Card } from "./Card";
import { colorDotStyle, getLanguageColor } from "../lib/language-colors";

interface CompactLanguageStatsProps {
  languages: LanguageData[];
}

export const CompactLanguageStats = ({ languages }: CompactLanguageStatsProps) => {
  // Progress bar container
  const progressBarContainerStyle: CSSProperties = {
    backgroundColor: colors.background.secondary,
    width: "100%",
    height: "8px",
    borderRadius: "4px",
    display: "flex",
    marginBottom: "20px",
    overflow: "hidden",
  };

  // Grid container for language items
  const gridContainerStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  };

  // Individual language item
  const languageListItemStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "48%",
    padding: "4px",
  };

  const languageNameStyle: CSSProperties = {
    fontSize: fonts.size.small,
    fontWeight: fonts.weight.medium,
    flexGrow: 1,
  };

  const percentageStyle: CSSProperties = {
    color: colors.text.secondary,
    fontSize: fonts.size.small,
  };

  // Take only top 6 languages
  const topLanguages = languages.slice(0, 6);

  return (
    <Card title="Most Used Languages">
      {/* Progress bar showing all languages */}
      <div style={progressBarContainerStyle}>
        {topLanguages.map((lang, index) => {
          const segmentStyle: CSSProperties = {
            width: `${lang.percentage}%`,
            height: "100%",
            backgroundColor: getLanguageColor(lang.language),
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
            <div style={colorDotStyle(10, getLanguageColor(lang.language))} />
            <span style={languageNameStyle}>{lang.language}</span>
            <span style={percentageStyle}>{lang.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
