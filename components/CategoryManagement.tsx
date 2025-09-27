
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, TextInput } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import Button from './Button';
import SimpleBottomSheet from './BottomSheet';
import { DictionaryEntry } from '../types/dictionary';

interface CategoryManagementProps {
  isVisible: boolean;
  onClose: () => void;
  entries: DictionaryEntry[];
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  categoryCard: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
  categoryCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  categoryColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  addCategoryContainer: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  input: {
    backgroundColor: colors.skyBlue,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: 'Inter_400Regular',
    marginBottom: 12,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  colorPicker: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: colors.text,
  },
  statsContainer: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  editContainer: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  editButton: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: colors.textSecondary,
  },
});

const CATEGORY_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

const CATEGORY_LABELS = {
  noun: 'Magac',
  verb: 'Fal',
  adjective: 'Tilmaame',
  adverb: 'Xaalad',
  phrase: 'Weedh',
  idiom: 'Hal-ku-dheg',
  proverb: 'Maahmaah',
  technical: 'Farsamo',
  literary: 'Suugaan',
  historical: 'Taariikh'
};

export default function CategoryManagement({ isVisible, onClose, entries }: CategoryManagementProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLORS[0]);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryColor, setEditCategoryColor] = useState(CATEGORY_COLORS[0]);

  // Get category statistics
  const categoryStats = entries.reduce((acc, entry) => {
    const category = entry.category || 'uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Khalad', 'Fadlan gali magaca qaybta');
      return;
    }

    // In a real app, you would save this to your backend or local storage
    Alert.alert('Guul', `Qaybta "${newCategoryName}" waa la daray`);
    setNewCategoryName('');
    setSelectedColor(CATEGORY_COLORS[0]);
    console.log('New category added:', { name: newCategoryName, color: selectedColor });
  };

  const handleEditCategory = (categoryName: string) => {
    console.log('Starting to edit category:', categoryName);
    setEditingCategory(categoryName);
    setEditCategoryName(CATEGORY_LABELS[categoryName as keyof typeof CATEGORY_LABELS] || categoryName);
    setEditCategoryColor(getCategoryColor(categoryName));
  };

  const handleSaveEdit = () => {
    if (!editCategoryName.trim()) {
      Alert.alert('Khalad', 'Fadlan gali magaca qaybta');
      return;
    }

    // In a real app, you would update the category in your backend or local storage
    Alert.alert('Guul', `Qaybta "${editingCategory}" waa la beddelay`);
    console.log('Category edited:', { 
      oldName: editingCategory, 
      newName: editCategoryName, 
      newColor: editCategoryColor 
    });
    
    // Reset editing state
    setEditingCategory(null);
    setEditCategoryName('');
    setEditCategoryColor(CATEGORY_COLORS[0]);
  };

  const handleCancelEdit = () => {
    console.log('Cancelled editing category:', editingCategory);
    setEditingCategory(null);
    setEditCategoryName('');
    setEditCategoryColor(CATEGORY_COLORS[0]);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      noun: '#FF6B6B',
      verb: '#4ECDC4',
      adjective: '#45B7D1',
      adverb: '#96CEB4',
      phrase: '#FFEAA7',
      idiom: '#DDA0DD',
      proverb: '#98D8C8',
      technical: '#F7DC6F',
      literary: '#BB8FCE',
      historical: '#85C1E9'
    };
    return colors[category as keyof typeof colors] || '#95A5A6';
  };

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Maaraynta Qaybaha</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tirakoobka Qaybaha</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              Waxaa jira {Object.keys(categoryStats).length} qaybood oo kala duwan
            </Text>
          </View>
        </View>

        {/* Add New Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ku dar Qaybta Cusub</Text>
          <View style={styles.addCategoryContainer}>
            <TextInput
              style={[
                styles.input,
                focusedInput === 'category' && styles.inputFocused
              ]}
              placeholder="Magaca qaybta cusub"
              placeholderTextColor={colors.grey}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              onFocus={() => setFocusedInput('category')}
              onBlur={() => setFocusedInput(null)}
            />
            
            <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>
              Dooro midab:
            </Text>
            <View style={styles.colorPicker}>
              {CATEGORY_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorOptionSelected
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
            
            <Button
              text="Ku dar Qaybta"
              onPress={handleAddCategory}
              disabled={!newCategoryName.trim()}
            />
          </View>
        </View>

        {/* Existing Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Qaybaha Jira ({Object.keys(categoryStats).length})</Text>
          {Object.entries(categoryStats).map(([category, count]) => (
            <View key={category}>
              <View style={styles.categoryCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View 
                    style={[
                      styles.categoryColor, 
                      { backgroundColor: getCategoryColor(category) }
                    ]} 
                  />
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>
                      {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category}
                    </Text>
                    <Text style={styles.categoryCount}>
                      {count} eray
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleEditCategory(category)}
                  style={{ padding: 8 }}
                >
                  <Icon name="create-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Edit Form */}
              {editingCategory === category && (
                <View style={styles.editContainer}>
                  <Text style={[commonStyles.text, { marginBottom: 12, fontWeight: '600' }]}>
                    Wax ka beddel qaybta:
                  </Text>
                  
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === `edit-${category}` && styles.inputFocused
                    ]}
                    placeholder="Magaca qaybta"
                    placeholderTextColor={colors.grey}
                    value={editCategoryName}
                    onChangeText={setEditCategoryName}
                    onFocus={() => setFocusedInput(`edit-${category}`)}
                    onBlur={() => setFocusedInput(null)}
                  />
                  
                  <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>
                    Dooro midab cusub:
                  </Text>
                  <View style={styles.colorPicker}>
                    {CATEGORY_COLORS.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorOption,
                          { backgroundColor: color },
                          editCategoryColor === color && styles.colorOptionSelected
                        ]}
                        onPress={() => setEditCategoryColor(color)}
                      />
                    ))}
                  </View>
                  
                  <View style={styles.editActions}>
                    <Button
                      text="Kaydi"
                      onPress={handleSaveEdit}
                      disabled={!editCategoryName.trim()}
                      style={styles.editButton}
                    />
                    <Button
                      text="Ka noqo"
                      onPress={handleCancelEdit}
                      style={[styles.editButton, styles.cancelButton]}
                    />
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Category Management Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tilmaamo</Text>
          <View style={[styles.addCategoryContainer, { backgroundColor: colors.background }]}>
            <Text style={[commonStyles.textSecondary, { lineHeight: 20 }]}>
              • Qaybaha waxay kaa caawinayaan inaad si fudud u raadiso ereyada{'\n'}
              • Midab kasta wuxuu matalaayaa qaybta gaar ah{'\n'}
              • Isticmaalayaasha waxay u isticmaali karaan qaybaha si ay u kala soocaan ereyada{'\n'}
              • Kaliya admin-ada ayaa awood u leh inuu ku daro ama wax ka beddelo qaybaha{'\n'}
              • Riix badhanka "Edit" si aad u beddesho magaca iyo midabka qaybta
            </Text>
          </View>
        </View>
      </ScrollView>
    </SimpleBottomSheet>
  );
}
