/**
 * Goldifi Divider Component
 */

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export interface DividerProps {
  style?: ViewStyle;
  vertical?: boolean;
}

export const Divider: React.FC<DividerProps> = ({ style, vertical = false }) => {
  return (
    <View
      style={[
        vertical ? styles.vertical : styles.horizontal,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
    width: '100%',
  },
  vertical: {
    width: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.sm,
    height: '100%',
  },
});
