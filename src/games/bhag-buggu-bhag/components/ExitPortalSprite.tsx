import React from 'react';
import { G, Circle, Path } from 'react-native-svg';

interface PortalProps {
  cx: number;
  cy: number;
  radius?: number;
}

export const ExitPortalSprite: React.FC<PortalProps> = ({
  cx,
  cy,
  radius = 24,
}) => {
  return (
    <G>
      {/* Outer Escape Target Hazard Ring */}
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke="#E63946"
        strokeWidth="3"
        strokeDasharray="5, 3"
        fill="#E63946"
        fillOpacity="0.12"
      />
      {/* Inner Escape Arrow / Escape Marker */}
      <Path
        d={`M ${cx} ${cy - radius + 7} L ${cx - 5} ${cy - radius + 13} L ${cx - 2} ${cy - radius + 13} L ${cx - 2} ${cy - radius + 18} L ${cx + 2} ${cy - radius + 18} L ${cx + 2} ${cy - radius + 13} L ${cx + 5} ${cy - radius + 13} Z`}
        fill="#E63946"
      />
    </G>
  );
};
