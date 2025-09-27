
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Button from './Button';
import SimpleBottomSheet from './BottomSheet';
import Icon from './Icon';

interface ContributionData {
  type: 'opinion' | 'word';
  title: string;
  content: string;
  categories: string[];
  contactInfo?: string;
}

interface ContributionBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (contribution: ContributionData) => void;
}

const AVAILABLE_CATEGORIES = [
  'Suugaan Guud',
  'Maahmaah',
  'Gabay',
  'Hees',
  'Sheeko',
  'Masrax',
  'Qoraal',
  'Taariikhda Suugaanta',
  'Erayo Cusub',
  'Macnayaal Cusub'
];

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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeOptionActive: {
    backgroundColor: colors.primary,
  },
  typeOptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_500Medium',
  },
  typeOptionTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: 'Inter_400Regular',
    marginBottom: 16,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  categoryChipTextSelected: {
    color: colors.text,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 16,
  },
  noteContainer: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  noteText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
});

export default function ContributionBottomSheet({ 
  isVisible, 
  onClose, 
  onSubmit 
}: ContributionBottomSheetProps) {
  const [contributionType, setContributionType] = useState<'opinion' | 'word'>('opinion');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setContributionType('opinion');
    setTitle('');
    setContent('');
    setSelectedCategories([]);
    setContactInfo('');
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Khalad', 'Fadlan gali cinwaanka');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Khalad', 'Fadlan gali nuxurka');
      return;
    }

    if (selectedCategories.length === 0) {
      Alert.alert('Khalad', 'Fadlan dooro ugu yaraan hal qaybood');
      return;
    }

    setIsSubmitting(true);
    try {
      const contributionData: ContributionData = {
        type: contributionType,
        title: title.trim(),
        content: content.trim(),
        categories: selectedCategories,
        contactInfo: contactInfo.trim() || undefined
      };

      onSubmit(contributionData);
      
      Alert.alert(
        'Guul', 
        'Wixii aad soo dirtay waa la helay. Waad ku mahadsan tahay wixii aad nagu caawisay!',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              onClose();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting contribution:', error);
      Alert.alert('Khalad', 'Khalad ayaa dhacay dirista wixii aad qortay');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={handleClose}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Wixii aad noo diri rabto</Text>
          <TouchableOpacity onPress={handleClose}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            <Text style={{ fontWeight: '600' }}>Ku soo dhawoow!</Text> Halkan waxaad noo diri kartaa fikradahaaga, 
            erayo cusub, ama wax kale oo ku saabsan qaamuuska suugaanta Soomaaliyeed. 
            Wixii aad soo dirtana waa la eegi doonaa oo haddii la aqbalo waa lagu dari doonaa qaamuuska.
          </Text>
        </View>

        {/* Type Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nooca wixii aad diri rabto</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeOption,
                contributionType === 'opinion' && styles.typeOptionActive
              ]}
              onPress={() => setContributionType('opinion')}
            >
              <Text style={[
                styles.typeOptionText,
                contributionType === 'opinion' && styles.typeOptionTextActive
              ]}>
                Ra&apos;yi ama Fikrad
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeOption,
                contributionType === 'word' && styles.typeOptionActive
              ]}
              onPress={() => setContributionType('word')}
            >
              <Text style={[
                styles.typeOptionText,
                contributionType === 'word' && styles.typeOptionTextActive
              ]}>
                Eray ama Macne Cusub
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {contributionType === 'opinion' ? 'Cinwaanka Ra&apos;yiga' : 'Magaca Ereyga'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={contributionType === 'opinion' ? 'Gali cinwaanka ra\'yigaaga' : 'Gali magaca ereyga cusub'}
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {contributionType === 'opinion' ? 'Nuxurka Ra&apos;yiga' : 'Macnaha Ereyga'}
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={
              contributionType === 'opinion' 
                ? 'Qor ra\'yigaaga ama fikradahaaga ku saabsan qaamuuska...' 
                : 'Qor macnaha ereyga cusub iyo tusaalooyin...'
            }
            placeholderTextColor={colors.textSecondary}
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={1000}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Qaybaha la xiriira ({selectedCategories.length} la doortay)</Text>
          <Text style={styles.description}>
            Dooro qaybaha qaamuuska ee wixii aad soo diri rabto la xiriira
          </Text>
          <View style={styles.categoriesContainer}>
            <View style={styles.categoriesGrid}>
              {AVAILABLE_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategories.includes(category) && styles.categoryChipSelected
                  ]}
                  onPress={() => handleCategoryToggle(category)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    selectedCategories.includes(category) && styles.categoryChipTextSelected
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Contact Info (Optional) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Macluumaadka Xiriirka (Ikhtiyaari)</Text>
          <Text style={styles.description}>
            Haddii aad rabto in lagu xiriiro, fadlan gali email-kaaga ama lambarka telefoonka
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email ama telefoon (ikhtiyaari)"
            placeholderTextColor={colors.textSecondary}
            value={contactInfo}
            onChangeText={setContactInfo}
            maxLength={100}
          />
        </View>

        {/* Submit Button */}
        <Button
          text={isSubmitting ? "Diraya..." : "Dir"}
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={styles.submitButton}
        />
      </ScrollView>
    </SimpleBottomSheet>
  );
}
