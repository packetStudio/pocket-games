import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line, Circle, G, Text as SvgText } from 'react-native-svg';
import { GameNode } from '../engine/graphData';

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
    const padding = 28;
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
        {/* 1. Track Lines / Paths */}
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
                stroke="#64B5F6"
                strokeWidth={7}
                strokeLinecap="round"
              />
            );
          });
        })}

        {/* 2. Nodes (Blue Transit Rings & Red Escape Target Rings) */}
        {nodes.map(node => {
          const { cx, cy } = getCoords(node.x, node.y);
          const isSelected =
            selectedPoliceIndex !== null && policePositions[selectedPoliceIndex] === node.id;

          return (
            <G key={`node-${node.id}`} onPress={() => onNodePress(node.id)}>
              {/* Escape Target Red Ring Indicator */}
              {node.isEscapeTarget && (
                <Circle
                  cx={cx}
                  cy={cy}
                  r={22}
                  stroke="#E53935"
                  strokeWidth={3.5}
                  fill="none"
                  strokeDasharray="4, 3"
                />
              )}

              {/* Base Node Outer Ring */}
              <Circle
                cx={cx}
                cy={cy}
                r={16}
                fill="#FFFFFF"
                stroke={isSelected ? '#FFD54F' : '#42A5F5'}
                strokeWidth={isSelected ? 4.5 : 3.5}
              />

              {/* Base Node Center Fill */}
              <Circle
                cx={cx}
                cy={cy}
                r={9}
                fill={isSelected ? '#FFCA28' : '#BBDEFB'}
              />
            </G>
          );
        })}

        {/* 3. Police Tokens */}
        {policePositions.map((nodeId, index) => {
          const node = nodes.find(n => n.id === nodeId);
          if (!node) return null;
          const { cx, cy } = getCoords(node.x, node.y);
          const isSelected = selectedPoliceIndex === index;

          return (
            <G key={`police-${index}`} onPress={() => onNodePress(nodeId)}>
              {/* Selection Halo */}
              {isSelected && (
                <Circle
                  cx={cx}
                  cy={cy}
                  r={25}
                  stroke="#FFD54F"
                  strokeWidth={4}
                  fill="none"
                />
              )}

              {/* Police Avatar Token */}
              <Circle
                cx={cx}
                cy={cy}
                r={18}
                fill="#1E88E5"
                stroke="#FFFFFF"
                strokeWidth={2.5}
              />
              <SvgText
                x={cx}
                y={cy + 5}
                fontSize="15"
                fontWeight="bold"
                fill="#FFFFFF"
                textAnchor="middle"
              >
                👮
              </SvgText>
            </G>
          );
        })}

        {/* 4. Buggu Token */}
        {(() => {
          const bugguNode = nodes.find(n => n.id === bugguPosition);
          if (!bugguNode) return null;
          const { cx, cy } = getCoords(bugguNode.x, bugguNode.y);

          return (
            <G key="buggu-token" onPress={() => onNodePress(bugguPosition)}>
              <Circle
                cx={cx}
                cy={cy}
                r={20}
                fill="#E53935"
                stroke="#FFFFFF"
                strokeWidth={2.5}
              />
              <SvgText
                x={cx}
                y={cy + 6}
                fontSize="16"
                fontWeight="bold"
                fill="#FFFFFF"
                textAnchor="middle"
              >
                🦹
              </SvgText>
            </G>
          );
        })()}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#717882',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});
