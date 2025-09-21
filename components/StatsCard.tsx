
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { DictionaryEntry } from '../types/dictionary';
import Icon from './Icon';

interface StatsCardProps {
  entries: DictionaryEntry[];
}

const StatsCard: React.FC<StatsCardProps> = ({ entries }) => {
  const totalEntries = entries.length;
  const categoryCounts = entries.reduce((acc, entry) => {
    const category = entry.category || 'other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentEntries = entries.filter(entry => {
    const daysDiff = (Date.now() - entry.dateAdded.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  }).length;

  const stats = [
    {
      icon: 'library-outline' as const,
      label: 'Wadarta Ereyada',
      value: totalEntries.toString(),
      color: colors.primary,
    },
    {
      icon: 'bookmark-outline' as const,
      label: 'Erayo Suugaan',
      value: (categoryCounts.literary_term || 0).toString(),
      color: colors.secondary,
    },
    {
      icon: 'time-outline' as const,
      label: 'Toddobaadkan',
      value: recentEntries.toString(),
      color: colors.success,
    },
    {
      icon: 'trending-up-outline' as const,
      label: 'Celceliska',
      value: totalEntries > 0 ? Math.round(totalEntries / 30).toString() : '0',
      color: colors.warning,
    },
  ];

  return (
    <View style={[commonStyles.card, styles.container]}>
      <Text style={styles.title}>Tirakoobka Qaamuuska</Text>
      
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={[styles.iconContainer, { backgroundColor: stat.color + '15' }]}>
              <Icon name={stat.icon} size={20} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default StatsCard;
