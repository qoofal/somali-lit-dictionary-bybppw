
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import { DictionaryEntry } from '../types/dictionary';

interface DictionaryCardProps {
  entry: DictionaryEntry;
  isAdmin?: boolean;
  onDelete?: (entryId: string) => void;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  word: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_700Bold',
    flex: 1,
  },
  adminActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  definition: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 12,
    fontFamily: 'Inter_400Regular',
  },
  context: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 12,
    fontFamily: 'Inter_400Regular',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 6,
    fontFamily: 'Inter_600SemiBold',
  },
  exampleText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    fontFamily: 'Inter_400Regular',
  },
  synonymsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  synonymTag: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  synonymText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  expandButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 4,
    fontFamily: 'Inter_500Medium',
  },
});

export default function DictionaryCard({ entry, isAdmin = false, onDelete }: DictionaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      'Xaqiiji Tirtirka',
      `Ma hubtaa inaad rabto inaad tirtirto "${entry.word}"?`,
      [
        { text: 'Maya', style: 'cancel' },
        {
          text: 'Haa, Tirtir',
          style: 'destructive',
          onPress: () => onDelete?.(entry.id)
        }
      ]
    );
  };

  const getCategoryColor = () => {
    switch (entry.category) {
      case 'gabay': return '#3B82F6';
      case 'hees': return '#10B981';
      case 'literary_term': return '#8B5CF6';
      case 'noun': return '#F59E0B';
      case 'verb': return '#EF4444';
      case 'adjective': return '#06B6D4';
      default: return colors.textSecondary;
    }
  };

  const getCategoryLabel = () => {
    switch (entry.category) {
      case 'gabay': return 'Gabay';
      case 'hees': return 'Hees';
      case 'literary_term': return 'Erey Suugaaneed';
      case 'noun': return 'Magac';
      case 'verb': return 'Fal';
      case 'adjective': return 'Tilmaame';
      default: return 'Kale';
    }
  };

  const shouldShowExpandButton = () => {
    return (entry.examples && entry.examples.length > 0) || 
           (entry.synonyms && entry.synonyms.length > 0) ||
           entry.literaryContext ||
           entry.poetName ||
           entry.poemHistory ||
           entry.poemText;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.word}>{entry.word}</Text>
        {isAdmin && (
          <View style={styles.adminActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Icon name="trash" size={16} color="#DC2626" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.definition}>{entry.definition}</Text>

      {isExpanded && (
        <>
          {entry.literaryContext && (
            <Text style={styles.context}>{entry.literaryContext}</Text>
          )}

          {entry.poetName && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Magaca Gabyaaga:</Text>
              <Text style={styles.exampleText}>{entry.poetName}</Text>
            </View>
          )}

          {entry.poemHistory && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Taariikhda Gabayga:</Text>
              <Text style={styles.exampleText}>{entry.poemHistory}</Text>
            </View>
          )}

          {entry.poemText && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gabayga:</Text>
              <Text style={styles.exampleText}>{entry.poemText}</Text>
            </View>
          )}

          {entry.examples && entry.examples.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tusaalooyin:</Text>
              {entry.examples.map((example, index) => (
                <Text key={index} style={styles.exampleText}>• {example}</Text>
              ))}
            </View>
          )}

          {entry.synonyms && entry.synonyms.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Erayo la macno ah:</Text>
              <View style={styles.synonymsContainer}>
                {entry.synonyms.map((synonym, index) => (
                  <View key={index} style={styles.synonymTag}>
                    <Text style={styles.synonymText}>{synonym}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </>
      )}

      {shouldShowExpandButton() && (
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Icon 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={16} 
            color={colors.primary} 
          />
          <Text style={styles.expandButtonText}>
            {isExpanded ? 'Qari' : 'Muuji dheeraad ah'}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <View style={styles.categoryContainer}>
          <View 
            style={[
              styles.synonymTag, 
              { backgroundColor: getCategoryColor() + '20' }
            ]}
          >
            <Text style={[styles.synonymText, { color: getCategoryColor() }]}>
              {getCategoryLabel()}
            </Text>
          </View>
        </View>
        <Text style={styles.dateText}>
          {entry.dateAdded.toLocaleDateString('so-SO')}
        </Text>
      </View>
    </View>
  );
}
