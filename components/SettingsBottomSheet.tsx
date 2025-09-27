
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Share, Platform } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import SimpleBottomSheet from './BottomSheet';
import Icon from './Icon';
import Button from './Button';

interface SettingsBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onExport: () => Promise<string>;
  onImport: (data: string) => Promise<boolean>;
  onClear: () => Promise<void>;
  entriesCount: number;
}

const SettingsBottomSheet: React.FC<SettingsBottomSheetProps> = ({
  isVisible,
  onClose,
  onExport,
  onImport,
  onClear,
  entriesCount,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const data = await onExport();
      
      if (Platform.OS === 'web') {
        // For web, create a download link
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qaamuuska-suugaanta.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        Alert.alert('Guul', 'Qaamuuska waa la soo saaray');
      } else {
        // For mobile, use Share API
        await Share.share({
          message: data,
          title: 'Qaamuuska Suugaanta Soomaaliyeed',
        });
      }
      
      console.log('Dictionary exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Khalad', 'Lama soo saari karin qaamuuska');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Xaqiiji',
      'Ma hubtaa inaad dooneyso inaad tirtirto dhammaan ereyada qaamuuska? Tallaabadan lama soo celin karo.',
      [
        {
          text: 'Ka noqo',
          style: 'cancel',
        },
        {
          text: 'Haa, tirtir',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsClearing(true);
              await onClear();
              Alert.alert('Guul', 'Qaamuuska waa la tirtirtay');
              onClose();
            } catch (error) {
              console.error('Clear error:', error);
              Alert.alert('Khalad', 'Lama tirtiri karin qaamuuska');
            } finally {
              setIsClearing(false);
            }
          },
        },
      ]
    );
  };

  const settingsOptions = [
    {
      icon: 'share-outline' as const,
      title: 'Soo saar Qaamuuska',
      description: 'Soo saar dhammaan ereyada qaamuuska',
      onPress: handleExport,
      loading: isExporting,
    },
    {
      icon: 'trash-outline' as const,
      title: 'Tirtir Qaamuuska',
      description: 'Tirtir dhammaan ereyada qaamuuska',
      onPress: handleClear,
      loading: isClearing,
      destructive: true,
    },
  ];

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Dejinta</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={[commonStyles.card, styles.statsCard]}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{entriesCount}</Text>
            <Text style={styles.statLabel}>Erayo</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {entriesCount > 0 ? Math.round(entriesCount / 7) : 0}
            </Text>
            <Text style={styles.statLabel}>Toddobaadyo</Text>
          </View>
        </View>

        {/* About */}
        <View style={[commonStyles.card, styles.aboutCard]}>
          <Text style={styles.aboutTitle}>Ku saabsan App-ka</Text>
          <Text style={styles.aboutText}>
            Qaamuuska Suugaanta Soomaaliyeed waa app gaar ah oo loogu talagalay 
            ardayda suugaanta Soomaaliyeed. Waxay ka caawisaa barashada ereyada 
            muhiimka ah ee suugaanta.
          </Text>
        </View>

        {/* Settings Options */}
        <View style={styles.optionsContainer}>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                option.destructive && styles.optionItemDestructive
              ]}
              onPress={option.onPress}
              disabled={option.loading}
            >
              <View style={styles.optionLeft}>
                <View style={[
                  styles.optionIcon,
                  option.destructive && styles.optionIconDestructive
                ]}>
                  <Icon 
                    name={option.icon} 
                    size={20} 
                    color={option.destructive ? colors.error : colors.text} 
                  />
                </View>
                <View style={styles.optionText}>
                  <Text style={[
                    styles.optionTitle,
                    option.destructive && styles.optionTitleDestructive
                  ]}>
                    {option.title}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>
              </View>
              {option.loading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>...</Text>
                </View>
              ) : (
                <Icon 
                  name="chevron-forward" 
                  size={20} 
                  color={colors.text} 
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
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
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.3,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: 'Inter_700Bold',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  aboutCard: {
    marginBottom: 24,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.3,
  },
  aboutText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 22,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.2,
  },
  optionsContainer: {
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionItemDestructive: {
    borderColor: colors.error + '30',
    backgroundColor: colors.error + '05',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '25',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionIconDestructive: {
    backgroundColor: colors.error + '15',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
    fontFamily: 'Inter_700Bold',
  },
  optionTitleDestructive: {
    color: colors.error,
  },
  optionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    fontFamily: 'Inter_600SemiBold',
  },
  loadingContainer: {
    width: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    fontFamily: 'Inter_600SemiBold',
  },
});

export default SettingsBottomSheet;
