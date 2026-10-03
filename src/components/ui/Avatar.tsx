/**
 * Goldifi Avatar Component
 */

import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radius } from '../../theme/radius';

export interface AvatarProps {
  name: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 44,
  backgroundColor = colors.surfaceSecondary,
  textColor = colors.text,
  style,
}) => {
  const getInitials = (n: string): string => {
    if (!n) return 'G';
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const fontSize = Math.round(size * 0.4);

  return (
    <View
      style={[
        styles.avatarContainer,
        {
          width: size,
          height: size,
          borderRadius: radius.avatar,
          backgroundColor,
        },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={`Avatar of ${name}`}
    >
      <Text style={[styles.initials, { fontSize, color: textColor }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  initials: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
