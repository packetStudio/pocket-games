import React from 'react';
import { G, Circle, Rect, Path, Ellipse } from 'react-native-svg';

interface SpriteProps {
  x: number;
  y: number;
  size?: number;
}

export const BugguSprite: React.FC<SpriteProps> = ({ x, y, size = 44 }) => {
  const scale = size / 50;

  return (
    <G transform={`translate(${x - size / 2}, ${y - size / 2}) scale(${scale})`}>
      {/* Drop Shadow */}
      <Ellipse cx="25" cy="46" rx="14" ry="4" fill="rgba(0, 0, 0, 0.25)" />

      {/* Money Sack behind shoulder */}
      <G>
        <Path
          d="M 33 26 C 42 24, 46 34, 42 42 C 38 46, 30 45, 28 41 Z"
          fill="#D4A373"
          stroke="#8C5832"
          strokeWidth="1.5"
        />
        {/* Sack Tie */}
        <Circle cx="34" cy="26" r="2.5" fill="#E63946" />
        {/* Rupee / Dollar symbol hint on sack */}
        <Path
          d="M 35 32 L 39 32 M 35 35 L 38 35 M 35 32 L 35 40"
          stroke="#6B3E1F"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </G>

      {/* Body / Striped Burglar Sweater */}
      <G>
        <Rect x="15" y="28" width="20" height="16" rx="5" fill="#2B2D42" />
        {/* White Horizontal Stripes */}
        <Rect x="15" y="32" width="20" height="2.5" fill="#EDF2F4" />
        <Rect x="15" y="37" width="20" height="2.5" fill="#EDF2F4" />
      </G>

      {/* Head */}
      <Circle cx="25" cy="20" r="11" fill="#F8C8A0" />

      {/* Thief Beanie / Cap */}
      <Path
        d="M 14 19 C 14 10, 36 10, 36 19 C 36 21, 14 21, 14 19 Z"
        fill="#1D3557"
      />
      {/* Beanie fold rim */}
      <Rect x="13.5" y="17" width="23" height="4" rx="2" fill="#457B9D" />

      {/* Eye Mask */}
      <Path
        d="M 16 20 C 18 17, 32 17, 34 20 C 32 23, 18 23, 16 20 Z"
        fill="#111111"
      />

      {/* Eyes through mask holes */}
      <Ellipse cx="21" cy="20" rx="2" ry="2.2" fill="#FFFFFF" />
      <Circle cx="22" cy="20" r="1.1" fill="#000000" />

      <Ellipse cx="29" cy="20" rx="2" ry="2.2" fill="#FFFFFF" />
      <Circle cx="30" cy="20" r="1.1" fill="#000000" />

      {/* Sly Smirk */}
      <Path
        d="M 23 26 Q 26 29 29 26"
        stroke="#4A2810"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </G>
  );
};
