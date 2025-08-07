import type { CSSProperties } from "hono/jsx";
import type { LanguageData } from "../../../types/language";
import { colors } from "../../../shared/lib/colors";
import { fonts } from "../../../shared/lib/fonts";
import { Card } from "../../../shared/components/Card/Card";
import { colorDotStyle, getLanguageColor } from "../../../shared/lib/language-colors";
import { ProgressBar } from "../../../shared/components/ProgressBar/ProgressBar";

interface CompactLanguageStatsProps {
  languages: LanguageData[];
}

export const CompactLanguageStats = ({ languages }: CompactLanguageStatsProps) => {
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
  const percentages = topLanguages.map((lang) => lang.percentage);
  const languageColors = topLanguages.map((lang) => getLanguageColor(lang.language));

  return (
    <Card title="Most Used Languages">
      <ProgressBar
        percentage={percentages}
        color={languageColors}
        height={8}
        borderRadius={4}
        multiSegment={true}
        segmentGap={1}
      />

      <div style={{ ...gridContainerStyle, marginTop: "20px" }}>
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
