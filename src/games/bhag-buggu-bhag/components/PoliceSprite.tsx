import React from 'react';
import { G, Circle, Rect, Path, Ellipse, Polygon } from 'react-native-svg';

interface SpriteProps {
  x: number;
  y: number;
  size?: number;
  isSelected?: boolean;
}

export const PoliceSprite: React.FC<SpriteProps> = ({
  x,
  y,
  size = 46,
  isSelected = false,
}) => {
  const scale = size / 50;

  return (
    <G transform={`translate(${x - size / 2}, ${y - size / 2}) scale(${scale})`}>
      {/* Selection Glow / Pulse Ring */}
      {isSelected && (
        <Circle
          cx="25"
          cy="25"
          r="24"
          fill="none"
          stroke="#FFD166"
          strokeWidth="3.5"
          strokeDasharray="4, 3"
        />
      )}

      {/* Drop Shadow */}
      <Ellipse cx="25" cy="46" rx="14" ry="4" fill="rgba(0, 0, 0, 0.25)" />

      {/* Uniform Torso / Shoulders */}
      <Rect x="13" y="27" width="24" height="17" rx="5" fill="#1D3557" />
      
      {/* Light Blue Shirt V-neck insert */}
      <Polygon points="21,27 29,27 25,33" fill="#A8DADC" />
      {/* Black Tie */}
      <Polygon points="24,31 26,31 27,38 25,41 23,38" fill="#111111" />

      {/* Gold Shoulder Epaulets */}
      <Rect x="12" y="28" width="4" height="2" rx="0.5" fill="#E9C46A" />
      <Rect x="34" y="28" width="4" height="2" rx="0.5" fill="#E9C46A" />

      {/* Head */}
      <Circle cx="25" cy="20" r="10.5" fill="#F8C8A0" />

      {/* Determined Eyes */}
      <Circle cx="21" cy="20" r="1.3" fill="#1A1A1A" />
      <Circle cx="29" cy="20" r="1.3" fill="#1A1A1A" />
      {/* Serious / Stern Brow */}
      <Path d="M 19 17 L 23 18.5" stroke="#4A2810" strokeWidth="1.2" strokeLinecap="round" />
      <Path d="M 31 17 L 27 18.5" stroke="#4A2810" strokeWidth="1.2" strokeLinecap="round" />

      {/* Police Cap Visor / Brim */}
      <Path
        d="M 12 16 Q 25 18 38 16 C 36 13 14 13 12 16 Z"
        fill="#111111"
      />

      {/* Police Peaked Cap Crown */}
      <Path
        d="M 13 15 C 13 7, 37 7, 37 15 Z"
        fill="#1D3557"
      />

      {/* Cap Gold Band */}
      <Path
        d="M 14 15 Q 25 17 36 15"
        stroke="#E9C46A"
        strokeWidth="2"
        fill="none"
      />

      {/* Gold Police Badge on Cap */}
      <Polygon
        points="25,9 26.5,12 29.5,12.5 27,14.5 28,17.5 25,16 22,17.5 23,14.5 20.5,12.5 23.5,12"
        fill="#FFD166"
      />
    </G>
  );
};
