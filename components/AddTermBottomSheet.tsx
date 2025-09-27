
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { NewDictionaryEntry } from '../types/dictionary';
import SimpleBottomSheet from './BottomSheet';
import Icon from './Icon';
import Button from './Button';

interface AddTermBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onAddTerm: (term: NewDictionaryEntry) => void;
}

const AddTermBottomSheet: React.FC<AddTermBottomSheetProps> = ({
  isVisible,
  onClose,
  onAddTerm,
}) => {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [literaryContext, setLiteraryContext] = useState('');
  const [examples, setExamples] = useState('');
  const [synonyms, setSynonyms] = useState('');
  const [category, setCategory] = useState<NewDictionaryEntry['category']>('gabay');
  
  // New poem fields
  const [poetName, setPoetName] = useState('');
  const [poemHistory, setPoemHistory] = useState('');
  const [poemText, setPoemText] = useState('');

  const categories = [
    { value: 'gabay', label: 'Gabay' },
    { value: 'hees', label: 'Hees' },
    { value: 'literary_term', label: 'Eray Suugaan' },
    { value: 'noun', label: 'Magac' },
    { value: 'verb', label: 'Fal' },
    { value: 'adjective', label: 'Tilmaan' },
    { value: 'adverb', label: 'Xaalad' },
    { value: 'other', label: 'Kale' },
  ] as const;

  const resetForm = () => {
    setWord('');
    setDefinition('');
    setLiteraryContext('');
    setExamples('');
    setSynonyms('');
    setCategory('gabay');
    setPoetName('');
    setPoemHistory('');
    setPoemText('');
  };

  const handleSubmit = () => {
    if (!word.trim() || !definition.trim()) {
      Alert.alert('Khalad', 'Fadlan gali ereyga iyo macnaheeda');
      return;
    }

    const newTerm: NewDictionaryEntry = {
      word: word.trim(),
      definition: definition.trim(),
      literaryContext: literaryContext.trim() || undefined,
      examples: examples.trim() ? examples.split('\n').map(ex => ex.trim()).filter(ex => ex) : undefined,
      synonyms: synonyms.trim() ? synonyms.split(',').map(syn => syn.trim()).filter(syn => syn) : undefined,
      category,
      poetName: poetName.trim() || undefined,
      poemHistory: poemHistory.trim() || undefined,
      poemText: poemText.trim() || undefined,
    };

    onAddTerm(newTerm);
    resetForm();
    console.log('Submitting new term:', newTerm);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isPoemCategory = category === 'gabay' || category === 'hees';

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={handleClose}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Ku dar Erey Cusub</Text>
          <TouchableOpacity onPress={handleClose}>
            <Icon name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Word Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ereyga *</Text>
          <TextInput
            style={styles.input}
            placeholder="Gali ereyga cusub..."
            placeholderTextColor={colors.textSecondary}
            value={word}
            onChangeText={setWord}
            autoCapitalize="words"
          />
        </View>

        {/* Definition Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Macnaha *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Gali macnaha ereyga..."
            placeholderTextColor={colors.textSecondary}
            value={definition}
            onChangeText={setDefinition}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Category Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nooca Ereyga</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.categoryButton,
                  category === cat.value && styles.categoryButtonActive
                ]}
                onPress={() => setCategory(cat.value)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  category === cat.value && styles.categoryButtonTextActive
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Poem Sub-categories (only show for gabay and hees) */}
        {isPoemCategory && (
          <View style={styles.poemSection}>
            <Text style={styles.sectionTitle}>Faahfaahin Gabayga</Text>
            
            {/* Poet's Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Magaca Gabyaaga</Text>
              <TextInput
                style={styles.input}
                placeholder="Gali magaca gabyaaga..."
                placeholderTextColor={colors.textSecondary}
                value={poetName}
                onChangeText={setPoetName}
                autoCapitalize="words"
              />
            </View>

            {/* Poem History */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Taariikhda Gabayga</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Sharax taariikhda iyo aasaaska gabaygan..."
                placeholderTextColor={colors.textSecondary}
                value={poemHistory}
                onChangeText={setPoemHistory}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Poem Text */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gabayga</Text>
              <TextInput
                style={[styles.input, styles.textArea, styles.poemTextInput]}
                placeholder="Qor gabayga ama qayb ka mid ah..."
                placeholderTextColor={colors.textSecondary}
                value={poemText}
                onChangeText={setPoemText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>
        )}

        {/* Literary Context Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Macnaha Suugaanta</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Sharax sida ereygan loo isticmaalo suugaanta..."
            placeholderTextColor={colors.textSecondary}
            value={literaryContext}
            onChangeText={setLiteraryContext}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Examples Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tusaalooyin</Text>
          <Text style={styles.helperText}>Qor tusaale kasta xariiq cusub</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tusaale 1&#10;Tusaale 2&#10;Tusaale 3"
            placeholderTextColor={colors.textSecondary}
            value={examples}
            onChangeText={setExamples}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Synonyms Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Erayo la macno ah</Text>
          <Text style={styles.helperText}>Kala qaybi ereyada comma (,)</Text>
          <TextInput
            style={styles.input}
            placeholder="erey1, erey2, erey3"
            placeholderTextColor={colors.textSecondary}
            value={synonyms}
            onChangeText={setSynonyms}
          />
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button
            text="Ku dar Ereyga"
            onPress={handleSubmit}
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            textStyle={{ color: colors.text, fontWeight: '700' }}
          />
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SimpleBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    backgroundColor: colors.backgroundAlt,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  poemTextInput: {
    minHeight: 150,
    fontStyle: 'italic',
  },
  poemSection: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundAlt,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  categoryButtonTextActive: {
    color: colors.text,
    fontWeight: '700',
  },
  buttonContainer: {
    marginTop: 24,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
  },
});

export default AddTermBottomSheet;
