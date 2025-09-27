
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../styles/commonStyles';
import { DictionaryEntry } from '../types/dictionary';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  entries: DictionaryEntry[];
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategorySelect,
  entries,
}) => {
  const categories = [
    { value: null, label: 'Dhammaan', count: entries.length },
    { value: 'gabay', label: 'Gabay', count: 0 },
    { value: 'hees', label: 'Hees', count: 0 },
    { value: 'literary_term', label: 'Erayo Suugaan', count: 0 },
    { value: 'noun', label: 'Magacyo', count: 0 },
    { value: 'verb', label: 'Fallo', count: 0 },
    { value: 'adjective', label: 'Tilmaamo', count: 0 },
    { value: 'other', label: 'Kale', count: 0 },
  ];

  // Count entries by category
  const categoryCounts = entries.reduce((acc, entry) => {
    const category = entry.category || 'other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Update counts
  categories.forEach(cat => {
    if (cat.value) {
      cat.count = categoryCounts[cat.value] || 0;
    }
  });

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.value || 'all'}
            style={[
              styles.categoryItem,
              selectedCategory === category.value && styles.categoryItemActive
            ]}
            onPress={() => onCategorySelect(category.value)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category.value && styles.categoryTextActive
            ]}>
              {category.label}
            </Text>
            {category.count > 0 && (
              <View style={[
                styles.countBadge,
                selectedCategory === category.value && styles.countBadgeActive
              ]}>
                <Text style={[
                  styles.countText,
                  selectedCategory === category.value && styles.countTextActive
                ]}>
                  {category.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollView: {
    flexDirection: 'row',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.text,
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: colors.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
    minWidth: 20,
    alignItems: 'center',
  },
  countBadgeActive: {
    backgroundColor: colors.text + '30',
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  countTextActive: {
    color: colors.text,
  },
});

export default CategoryFilter;
