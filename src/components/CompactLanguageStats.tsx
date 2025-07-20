import type { CSSProperties } from "hono/jsx";
import { languageColors } from "../lib/language-colors";

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
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "8px 16px 12px",
    backgroundColor: "#0d1117",
    color: "#c9d1d9",
  };

  const titleStyle: CSSProperties = {
    fontSize: "16px",
    fontWeight: "600",
    margin: 0,
    marginBottom: "8px",
    color: "#58a6ff",
  };

  // Progress bar container
  const progressBarContainerStyle: CSSProperties = {
    width: "100%",
    height: "8px",
    backgroundColor: "#161b22",
    borderRadius: "4px",
    overflow: "hidden",
    display: "flex",
    marginBottom: "20px",
  };

  // Grid container for language items
  const gridContainerStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  };

  // Individual language item
  const languageItemStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "48%",
    padding: "4px",
  };

  const colorDotStyle = (color: string): CSSProperties => ({
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: color,
    flexShrink: 0,
  });

  const languageNameStyle: CSSProperties = {
    fontSize: "12px",
    fontWeight: "500",
    flexGrow: 1,
  };

  const percentageStyle: CSSProperties = {
    fontSize: "12px",
    color: "#8b949e",
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
            backgroundColor: languageColors[lang.language] || "#586069",
            // Add small gap between segments except for the first one
            marginLeft: index > 0 ? "1px" : "0",
          };
          return <div key={lang.language} style={segmentStyle} />;
        })}
      </div>

      {/* Grid of language items */}
      <div style={gridContainerStyle}>
        {topLanguages.map((lang) => (
          <div key={lang.language} style={languageItemStyle}>
            <div style={colorDotStyle(languageColors[lang.language] || "#586069")} />
            <span style={languageNameStyle}>{lang.language}</span>
            <span style={percentageStyle}>{lang.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
