
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import Button from './Button';
import SimpleBottomSheet from './BottomSheet';
import { NewDictionaryEntry } from '../types/dictionary';

interface AddTermBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onAddTerm: (term: NewDictionaryEntry) => void;
  isAdmin: boolean;
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
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: 'Inter_400Regular',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  categoryTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  exampleContainer: {
    gap: 8,
  },
  exampleInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exampleInputField: {
    flex: 1,
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.backgroundAlt,
  },
  noAccessContainer: {
    alignItems: 'center',
    padding: 32,
  },
  noAccessText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
  },
});

const categories = [
  { key: 'gabay', label: 'Gabay' },
  { key: 'hees', label: 'Hees' },
  { key: 'literary_term', label: 'Erey Suugaaneed' },
  { key: 'noun', label: 'Magac' },
  { key: 'verb', label: 'Fal' },
  { key: 'adjective', label: 'Tilmaame' },
  { key: 'other', label: 'Kale' },
];

export default function AddTermBottomSheet({ isVisible, onClose, onAddTerm, isAdmin }: AddTermBottomSheetProps) {
  const [formData, setFormData] = useState<NewDictionaryEntry>({
    word: '',
    definition: '',
    literaryContext: '',
    examples: [''],
    synonyms: [''],
    category: 'literary_term',
    poetName: '',
    poemHistory: '',
    poemText: '',
  });

  const resetForm = () => {
    setFormData({
      word: '',
      definition: '',
      literaryContext: '',
      examples: [''],
      synonyms: [''],
      category: 'literary_term',
      poetName: '',
      poemHistory: '',
      poemText: '',
    });
  };

  const handleSubmit = () => {
    if (!formData.word.trim() || !formData.definition.trim()) {
      Alert.alert('Khalad', 'Fadlan buuxi ereyga iyo qeexitaanka');
      return;
    }

    const cleanedData: NewDictionaryEntry = {
      ...formData,
      examples: formData.examples?.filter(ex => ex.trim()) || [],
      synonyms: formData.synonyms?.filter(syn => syn.trim()) || [],
    };

    onAddTerm(cleanedData);
    resetForm();
    console.log('New term submitted:', cleanedData);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addExample = () => {
    setFormData({
      ...formData,
      examples: [...(formData.examples || []), '']
    });
  };

  const removeExample = (index: number) => {
    const newExamples = formData.examples?.filter((_, i) => i !== index) || [];
    setFormData({
      ...formData,
      examples: newExamples
    });
  };

  const updateExample = (index: number, value: string) => {
    const newExamples = [...(formData.examples || [])];
    newExamples[index] = value;
    setFormData({
      ...formData,
      examples: newExamples
    });
  };

  const addSynonym = () => {
    setFormData({
      ...formData,
      synonyms: [...(formData.synonyms || []), '']
    });
  };

  const removeSynonym = (index: number) => {
    const newSynonyms = formData.synonyms?.filter((_, i) => i !== index) || [];
    setFormData({
      ...formData,
      synonyms: newSynonyms
    });
  };

  const updateSynonym = (index: number, value: string) => {
    const newSynonyms = [...(formData.synonyms || [])];
    newSynonyms[index] = value;
    setFormData({
      ...formData,
      synonyms: newSynonyms
    });
  };

  if (!isAdmin) {
    return (
      <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Ku dar Erey</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.noAccessContainer}>
            <Icon name="lock-closed" size={48} color={colors.textSecondary} />
            <Text style={styles.noAccessText}>
              Kaliya admin-ada ayaa awood u leh inay ku daraan erayo cusub qaamuuska. 
              Haddii aad u baahan tahay inaad ku darto erey, fadlan la xiriir admin-ka.
            </Text>
          </View>
        </View>
      </SimpleBottomSheet>
    );
  }

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={handleClose}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Ku dar Erey Cusub</Text>
          <TouchableOpacity onPress={handleClose}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {/* Word */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ereyga *</Text>
            <TextInput
              style={styles.input}
              placeholder="Gali ereyga cusub"
              placeholderTextColor={colors.textSecondary}
              value={formData.word}
              onChangeText={(text) => setFormData({ ...formData, word: text })}
            />
          </View>

          {/* Definition */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Qeexitaanka *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Qeex ereyga"
              placeholderTextColor={colors.textSecondary}
              value={formData.definition}
              onChangeText={(text) => setFormData({ ...formData, definition: text })}
              multiline
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nooca</Text>
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.key}
                  style={[
                    styles.categoryButton,
                    formData.category === category.key && styles.categoryButtonActive
                  ]}
                  onPress={() => setFormData({ ...formData, category: category.key as any })}
                >
                  <Text style={[
                    styles.categoryText,
                    formData.category === category.key && styles.categoryTextActive
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Literary Context */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Macnaha Suugaaneed</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Sharax macnaha suugaaneed ee ereyga"
              placeholderTextColor={colors.textSecondary}
              value={formData.literaryContext}
              onChangeText={(text) => setFormData({ ...formData, literaryContext: text })}
              multiline
            />
          </View>

          {/* Poem-specific fields for gabay/hees categories */}
          {(formData.category === 'gabay' || formData.category === 'hees') && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Magaca Gabyaaga</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Gali magaca gabyaaga"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.poetName}
                  onChangeText={(text) => setFormData({ ...formData, poetName: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Taariikhda Gabayga</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Sharax taariikhda gabayga"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.poemHistory}
                  onChangeText={(text) => setFormData({ ...formData, poemHistory: text })}
                  multiline
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gabayga</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Qor gabayga ama qaybtii muhiimka ah"
                  placeholderTextColor={colors.textSecondary}
                  value={formData.poemText}
                  onChangeText={(text) => setFormData({ ...formData, poemText: text })}
                  multiline
                />
              </View>
            </>
          )}

          {/* Examples */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tusaalooyin</Text>
            <View style={styles.exampleContainer}>
              {formData.examples?.map((example, index) => (
                <View key={index} style={styles.exampleInput}>
                  <TextInput
                    style={[styles.input, styles.exampleInputField]}
                    placeholder={`Tusaale ${index + 1}`}
                    placeholderTextColor={colors.textSecondary}
                    value={example}
                    onChangeText={(text) => updateExample(index, text)}
                  />
                  {formData.examples && formData.examples.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeExample(index)}
                    >
                      <Icon name="remove" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity style={styles.addButton} onPress={addExample}>
                <Icon name="add" size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Synonyms */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Erayo la macno ah</Text>
            <View style={styles.exampleContainer}>
              {formData.synonyms?.map((synonym, index) => (
                <View key={index} style={styles.exampleInput}>
                  <TextInput
                    style={[styles.input, styles.exampleInputField]}
                    placeholder={`Erey la macno ah ${index + 1}`}
                    placeholderTextColor={colors.textSecondary}
                    value={synonym}
                    onChangeText={(text) => updateSynonym(index, text)}
                  />
                  {formData.synonyms && formData.synonyms.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeSynonym(index)}
                    >
                      <Icon name="remove" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity style={styles.addButton} onPress={addSynonym}>
                <Icon name="add" size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <Button
            text="Ku dar Qaamuuska"
            onPress={handleSubmit}
            style={{ marginTop: 8, marginBottom: 32 }}
          />
        </View>
      </ScrollView>
    </SimpleBottomSheet>
  );
}
