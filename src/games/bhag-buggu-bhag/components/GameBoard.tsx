import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Circle, G } from 'react-native-svg';
import { GameNode } from '../engine/graphData';
import { BugguSprite } from './BugguSprite';
import { PoliceSprite } from './PoliceSprite';
import { ExitPortalSprite } from './ExitPortalSprite';

interface GameBoardProps {
  nodes: GameNode[];
  policePositions: number[];
  bugguPosition: number;
  selectedPoliceIndex: number | null;
  onNodePress: (nodeId: number) => void;
  boardSize?: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  nodes,
  policePositions,
  bugguPosition,
  selectedPoliceIndex,
  onNodePress,
  boardSize = Math.min(Dimensions.get('window').width - 32, 420),
}) => {
  // Convert 0-100 percentage coordinates to absolute board pixels
  const getCoords = (percentageX: number, percentageY: number) => {
    const padding = 32;
    const usableWidth = boardSize - padding * 2;
    return {
      cx: padding + (percentageX / 100) * usableWidth,
      cy: padding + (percentageY / 100) * usableWidth,
    };
  };

  // Render edges without duplicates
  const drawnEdges = new Set<string>();

  return (
    <View style={[styles.container, { width: boardSize, height: boardSize }]}>
      <Svg width={boardSize} height={boardSize}>
        {/* 1. Track Lines / Pathways */}
        {nodes.map(node => {
          const from = getCoords(node.x, node.y);
          return node.neighbors.map(neighborId => {
            const edgeKey = [Math.min(node.id, neighborId), Math.max(node.id, neighborId)].join('-');
            if (drawnEdges.has(edgeKey)) return null;
            drawnEdges.add(edgeKey);

            const neighborNode = nodes.find(n => n.id === neighborId);
            if (!neighborNode) return null;
            const to = getCoords(neighborNode.x, neighborNode.y);

            return (
              <Line
                key={edgeKey}
                x1={from.cx}
                y1={from.cy}
                x2={to.cx}
                y2={to.cy}
                stroke="#4A5568"
                strokeWidth={7}
                strokeLinecap="round"
              />
            );
          });
        })}

        {/* 2. Nodes & Escape Portals */}
        {nodes.map(node => {
          const { cx, cy } = getCoords(node.x, node.y);
          const isSelected =
            selectedPoliceIndex !== null && policePositions[selectedPoliceIndex] === node.id;

          return (
            <G key={`node-${node.id}`} onPress={() => onNodePress(node.id)}>
              {/* Highlight escape target with animated portal sprite */}
              {node.isEscapeTarget && (
                <ExitPortalSprite cx={cx} cy={cy} radius={24} />
              )}

              {/* Base Node Outer Ring */}
              <Circle
                cx={cx}
                cy={cy}
                r={16}
                fill="#EDF2F7"
                stroke={isSelected ? '#E9C46A' : '#718096'}
                strokeWidth={isSelected ? 4 : 3}
              />

              {/* Base Node Center Fill */}
              <Circle
                cx={cx}
                cy={cy}
                r={8}
                fill={isSelected ? '#F4A261' : '#CBD5E0'}
              />
            </G>
          );
        })}

        {/* 3. Police Officers (Sprites) */}
        {policePositions.map((nodeId, index) => {
          const node = nodes.find(n => n.id === nodeId);
          if (!node) return null;
          const { cx, cy } = getCoords(node.x, node.y);
          const isSelected = selectedPoliceIndex === index;

          return (
            <G key={`police-${index}`} onPress={() => onNodePress(nodeId)}>
              <PoliceSprite x={cx} y={cy} size={48} isSelected={isSelected} />
            </G>
          );
        })}

        {/* 4. Buggu (Sprite) */}
        {(() => {
          const bugguNode = nodes.find(n => n.id === bugguPosition);
          if (!bugguNode) return null;
          const { cx, cy } = getCoords(bugguNode.x, bugguNode.y);

          return (
            <G key="buggu-token" onPress={() => onNodePress(bugguPosition)}>
              <BugguSprite x={cx} y={cy} size={46} />
            </G>
          );
        })()}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2D3748',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
