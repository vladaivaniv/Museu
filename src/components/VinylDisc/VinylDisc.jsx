import { memo, useId } from 'react';
import './VinylDisc.css';

const SELECTOR_GROOVES = [50, 64, 78, 92];
const DETAIL_GROOVES = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95];

function VinylDisc({ visuals, variant = 'selector', photo }) {
  const id = useId();
  const isDetail = variant === 'detail';
  const grooves = isDetail ? DETAIL_GROOVES : SELECTOR_GROOVES;
  const labelRadius = isDetail ? visuals.label.detailRadius : visuals.label.radius;
  const spindleRadius = isDetail ? 4 : 3.5;
  const spindleFill = isDetail ? visuals.spindle.detailFill : visuals.spindle.fill;
  const textLines = isDetail ? visuals.detailText : visuals.selectorText;
  const clipId = `photo-clip-${id}`;

  return (
    <svg className="vinyl-svg" viewBox="0 0 200 200">
      {photo && (
        <defs>
          <clipPath id={clipId}>
            <circle cx="100" cy="100" r={labelRadius} />
          </clipPath>
        </defs>
      )}
      <circle cx="100" cy="100" r="100" fill={visuals.discFill} />
      {grooves.map((r, i) => {
        if (isDetail) {
          const isOdd = i % 2 === 1;
          return (
            <circle
              key={r}
              cx="100" cy="100" r={r}
              fill="none"
              stroke={isOdd ? visuals.detailGrooveAlt : visuals.grooveStroke}
              strokeWidth={isOdd ? 0.5 : 0.7}
            />
          );
        }
        return (
          <circle
            key={r}
            cx="100" cy="100" r={r}
            fill="none"
            stroke={visuals.grooveStroke}
            strokeWidth={0.7}
          />
        );
      })}
      <ellipse
        cx="80" cy="65"
        rx={visuals.shine.rx} ry={visuals.shine.ry}
        fill={visuals.shine.fill}
        transform="rotate(-35 100 100)"
      />
      {photo ? (
        <image
          href={photo}
          x={100 - labelRadius}
          y={100 - labelRadius}
          width={labelRadius * 2}
          height={labelRadius * 2}
          clipPath={`url(#${clipId})`}
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <>
          <circle cx="100" cy="100" r={labelRadius} fill={visuals.label.fill} />
          {textLines.map((line, i) => (
            <text
              key={i}
              x="100" y={line.y}
              textAnchor="middle"
              fontSize={line.fontSize}
              fontFamily="sans-serif"
              fontWeight={line.bold ? 700 : 400}
              fill={line.fill}
            >
              {line.text}
            </text>
          ))}
        </>
      )}
      <circle cx="100" cy="100" r={spindleRadius} fill={spindleFill} />
    </svg>
  );
}

export default memo(VinylDisc);
