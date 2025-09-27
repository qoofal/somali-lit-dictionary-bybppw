
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { NewDictionaryEntry } from '../types/dictionary';
import Icon from './Icon';
import Button from './Button';
import SimpleBottomSheet from './BottomSheet';

interface AddTermBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onAddTerm: (term: NewDictionaryEntry) => void;
  isAdmin: boolean;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'Inter_600SemiBold',
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
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundAlt,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  categoryTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  listContainer: {
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.skyBlue,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listItemInput: {
    flex: 1,
    fontSize: 14,
    color: colors.background,
    fontFamily: 'Inter_400Regular',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    fontFamily: 'Inter_400Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  adminWarning: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  adminWarningText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});

const categories = [
  { key: 'gabay', label: 'Gabay' },
  { key: 'hees', label: 'Hees' },
  { key: 'literary_term', label: 'Erey Suugaan' },
  { key: 'noun', label: 'Magac' },
  { key: 'verb', label: 'Fal' },
  { key: 'adjective', label: 'Tilmaame' },
  { key: 'other', label: 'Kale' },
];

export default function AddTermBottomSheet({ 
  isVisible, 
  onClose, 
  onAddTerm, 
  isAdmin 
}: AddTermBottomSheetProps) {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [literaryContext, setLiteraryContext] = useState('');
  const [category, setCategory] = useState<NewDictionaryEntry['category']>('literary_term');
  const [examples, setExamples] = useState<string[]>(['']);
  const [synonyms, setSynonyms] = useState<string[]>(['']);
  const [poetName, setPoetName] = useState('');
  const [poemHistory, setPoemHistory] = useState('');
  const [poemText, setPoemText] = useState('');

  const resetForm = () => {
    setWord('');
    setDefinition('');
    setLiteraryContext('');
    setCategory('literary_term');
    setExamples(['']);
    setSynonyms(['']);
    setPoetName('');
    setPoemHistory('');
    setPoemText('');
  };

  const handleSubmit = () => {
    if (!word.trim() || !definition.trim()) {
      Alert.alert('Khalad', 'Fadlan buuxi ereyga iyo macnaheeda');
      return;
    }

    const newEntry: NewDictionaryEntry = {
      word: word.trim(),
      definition: definition.trim(),
      literaryContext: literaryContext.trim() || undefined,
      category,
      examples: examples.filter(ex => ex.trim()).length > 0 
        ? examples.filter(ex => ex.trim()) 
        : undefined,
      synonyms: synonyms.filter(syn => syn.trim()).length > 0 
        ? synonyms.filter(syn => syn.trim()) 
        : undefined,
      poetName: poetName.trim() || undefined,
      poemHistory: poemHistory.trim() || undefined,
      poemText: poemText.trim() || undefined,
    };

    onAddTerm(newEntry);
    resetForm();
    console.log('New term submitted:', newEntry.word);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addExample = () => {
    setExamples([...examples, '']);
  };

  const removeExample = (index: number) => {
    if (examples.length > 1) {
      setExamples(examples.filter((_, i) => i !== index));
    }
  };

  const updateExample = (index: number, value: string) => {
    const newExamples = [...examples];
    newExamples[index] = value;
    setExamples(newExamples);
  };

  const addSynonym = () => {
    setSynonyms([...synonyms, '']);
  };

  const removeSynonym = (index: number) => {
    if (synonyms.length > 1) {
      setSynonyms(synonyms.filter((_, i) => i !== index));
    }
  };

  const updateSynonym = (index: number, value: string) => {
    const newSynonyms = [...synonyms];
    newSynonyms[index] = value;
    setSynonyms(newSynonyms);
  };

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={handleClose}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Ku dar Erey Cusub</Text>

        {!isAdmin && (
          <View style={styles.adminWarning}>
            <Icon name="information-circle" size={24} color={colors.textSecondary} />
            <Text style={styles.adminWarningText}>
              Kaliya admin-ada ayaa ku dari kara erayo cusub. La xiriir admin-ka si aad u hesho fasax.
            </Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ereyga *</Text>
          <TextInput
            style={styles.input}
            value={word}
            onChangeText={setWord}
            placeholder="Gali ereyga cusub"
            placeholderTextColor={colors.grey}
            editable={isAdmin}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Macnaha *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={definition}
            onChangeText={setDefinition}
            placeholder="Sharax macnaha ereyga"
            placeholderTextColor={colors.grey}
            multiline
            editable={isAdmin}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Macluumaad Suugaan</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={literaryContext}
            onChangeText={setLiteraryContext}
            placeholder="Sharax sida ereyga loo isticmaalo suugaanta"
            placeholderTextColor={colors.grey}
            multiline
            editable={isAdmin}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nooca</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryButton,
                  category === cat.key && styles.categoryButtonActive,
                ]}
                onPress={() => isAdmin && setCategory(cat.key as any)}
                disabled={!isAdmin}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat.key && styles.categoryTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {(category === 'gabay' || category === 'hees') && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Magaca Gabyaaga</Text>
              <TextInput
                style={styles.input}
                value={poetName}
                onChangeText={setPoetName}
                placeholder="Gali magaca gabyaaga"
                placeholderTextColor={colors.grey}
                editable={isAdmin}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Taariikhda Gabayga</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={poemHistory}
                onChangeText={setPoemHistory}
                placeholder="Sharax taariikhda gabayga"
                placeholderTextColor={colors.grey}
                multiline
                editable={isAdmin}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gabayga</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={poemText}
                onChangeText={setPoemText}
                placeholder="Qor gabayga ama qayb ka mid ah"
                placeholderTextColor={colors.grey}
                multiline
                editable={isAdmin}
              />
            </View>
          </>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tusaalayaal</Text>
          <View style={styles.listContainer}>
            {examples.map((example, index) => (
              <View key={index} style={styles.listItem}>
                <TextInput
                  style={styles.listItemInput}
                  value={example}
                  onChangeText={(value) => updateExample(index, value)}
                  placeholder={`Tusaale ${index + 1}`}
                  placeholderTextColor={colors.grey}
                  editable={isAdmin}
                />
                {examples.length > 1 && isAdmin && (
                  <TouchableOpacity onPress={() => removeExample(index)}>
                    <Icon name="close-circle" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {isAdmin && (
              <TouchableOpacity style={styles.addButton} onPress={addExample}>
                <Icon name="add" size={16} color={colors.textSecondary} />
                <Text style={styles.addButtonText}>Ku dar tusaale</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Erayo la mid ah</Text>
          <View style={styles.listContainer}>
            {synonyms.map((synonym, index) => (
              <View key={index} style={styles.listItem}>
                <TextInput
                  style={styles.listItemInput}
                  value={synonym}
                  onChangeText={(value) => updateSynonym(index, value)}
                  placeholder={`Erey la mid ah ${index + 1}`}
                  placeholderTextColor={colors.grey}
                  editable={isAdmin}
                />
                {synonyms.length > 1 && isAdmin && (
                  <TouchableOpacity onPress={() => removeSynonym(index)}>
                    <Icon name="close-circle" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {isAdmin && (
              <TouchableOpacity style={styles.addButton} onPress={addSynonym}>
                <Icon name="add" size={16} color={colors.textSecondary} />
                <Text style={styles.addButtonText}>Ku dar erey la mid ah</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            text="Jooji"
            onPress={handleClose}
            style={{ flex: 1, backgroundColor: colors.backgroundAlt }}
            textStyle={{ color: colors.textSecondary }}
          />
          <Button
            text="Ku dar"
            onPress={handleSubmit}
            style={{ flex: 1 }}
            disabled={!isAdmin || !word.trim() || !definition.trim()}
          />
        </View>
      </ScrollView>
    </SimpleBottomSheet>
  );
}
