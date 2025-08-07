interface ProgressBarProps {
  percentage: number | number[];
  color: string | string[];
  height?: number;
  borderRadius?: number;
  multiSegment?: boolean;
  segmentGap?: number;
}

export function ProgressBar({
  percentage,
  color,
  height = 6,
  borderRadius = 3,
  multiSegment = false,
  segmentGap = 2,
}: ProgressBarProps) {
  const percentages = Array.isArray(percentage) ? percentage : [percentage];
  const colors = Array.isArray(color) ? color : [color];

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: `${height}px`,
        backgroundColor: "#30363d",
        borderRadius: `${borderRadius}px`,
        overflow: "hidden",
      }}
    >
      {multiSegment ? (
        percentages.map((pct, index) => (
          <div
            key={`segment-${pct}-${colors[index] || colors[0]}`}
            style={{
              width: `${pct}%`,
              height: `${height}px`,
              backgroundColor: colors[index] || colors[0],
              marginLeft: index > 0 ? `${segmentGap}px` : "0",
            }}
          />
        ))
      ) : (
        <div
          style={{
            width: `${percentages[0]}%`,
            height: `${height}px`,
            backgroundColor: colors[0],
            borderRadius: `${borderRadius}px`,
          }}
        />
      )}
    </div>
  );
}
