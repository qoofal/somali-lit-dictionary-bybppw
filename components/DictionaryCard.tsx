
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { DictionaryEntry } from '../types/dictionary';
import Icon from './Icon';

interface DictionaryCardProps {
  entry: DictionaryEntry;
}

const DictionaryCard: React.FC<DictionaryCardProps> = ({ entry }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'literary_term':
        return colors.primary;
      case 'noun':
        return colors.secondary;
      case 'verb':
        return colors.success;
      case 'adjective':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case 'literary_term':
        return 'Eray Suugaan';
      case 'noun':
        return 'Magac';
      case 'verb':
        return 'Fal';
      case 'adjective':
        return 'Tilmaan';
      case 'adverb':
        return 'Xaalad';
      default:
        return 'Kale';
    }
  };

  return (
    <TouchableOpacity
      style={[commonStyles.card, styles.card]}
      onPress={() => setIsExpanded(!isExpanded)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.wordContainer}>
          <Text style={styles.word}>{entry.word}</Text>
          {entry.category && (
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(entry.category) }]}>
              <Text style={styles.categoryText}>{getCategoryLabel(entry.category)}</Text>
            </View>
          )}
        </View>
        <Icon 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={colors.textSecondary} 
        />
      </View>

      {/* Definition */}
      <Text style={styles.definition} numberOfLines={isExpanded ? undefined : 2}>
        {entry.definition}
      </Text>

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Literary Context */}
          {entry.literaryContext && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Macnaha Suugaanta:</Text>
              <Text style={styles.sectionText}>{entry.literaryContext}</Text>
            </View>
          )}

          {/* Examples */}
          {entry.examples && entry.examples.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tusaalooyin:</Text>
              {entry.examples.map((example, index) => (
                <Text key={index} style={styles.exampleText}>• {example}</Text>
              ))}
            </View>
          )}

          {/* Synonyms */}
          {entry.synonyms && entry.synonyms.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Erayo la macno ah:</Text>
              <View style={styles.synonymsContainer}>
                {entry.synonyms.map((synonym, index) => (
                  <View key={index} style={styles.synonymBadge}>
                    <Text style={styles.synonymText}>{synonym}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Date Added */}
          <View style={styles.footer}>
            <Text style={styles.dateText}>
              La daray: {entry.dateAdded.toLocaleDateString('so-SO')}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  wordContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  word: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 2,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
  },
  definition: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  expandedContent: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  exampleText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  synonymsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  synonymBadge: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  synonymText: {
    fontSize: 14,
    color: colors.text,
  },
  footer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
  },
});

export default DictionaryCard;
