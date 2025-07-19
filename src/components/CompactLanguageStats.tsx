import type { CSSProperties } from "hono/jsx";

interface LanguageData {
  language: string;
  bytes: number;
  percentage: number;
}

interface CompactLanguageStatsProps {
  username: string;
  languages: LanguageData[];
}

// Language colors based on GitHub's language colors
const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Swift: "#FA7343",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  React: "#61dafb",
  Svelte: "#ff3e00",
  Dockerfile: "#2496ED",
  Makefile: "#427819",
  Vim: "#019733",
};

export const CompactLanguageStats = ({ languages }: CompactLanguageStatsProps) => {
  const containerStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    backgroundColor: "#0d1117",
    color: "#c9d1d9",
  };

  const titleStyle: CSSProperties = {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "16px",
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
    gap: "6px",
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
