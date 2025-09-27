
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Share, Platform } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import Button from './Button';
import SimpleBottomSheet from './BottomSheet';

interface SettingsBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onExport: () => Promise<string>;
  onImport: (data: string) => Promise<boolean>;
  onClear: () => Promise<void>;
  onLogout?: () => void;
  entriesCount: number;
  currentUser?: { username: string; role: string } | null;
  isAdmin?: boolean;
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
  userInfo: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
  userRole: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  settingArrow: {
    marginLeft: 12,
  },
  dangerItem: {
    backgroundColor: '#FEE2E2',
  },
  dangerTitle: {
    color: '#DC2626',
  },
  logoutItem: {
    backgroundColor: '#FEF3C7',
  },
  logoutTitle: {
    color: '#92400E',
  },
  adminItem: {
    backgroundColor: '#EBF8FF',
  },
  adminTitle: {
    color: '#2563EB',
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
});

export default function SettingsBottomSheet({ 
  isVisible, 
  onClose, 
  onExport, 
  onImport, 
  onClear, 
  onLogout,
  entriesCount,
  currentUser,
  isAdmin = false
}: SettingsBottomSheetProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await onExport();
      
      if (Platform.OS === 'web') {
        // For web, create a download link
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qaamuus-backup.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        Alert.alert('Guul', 'Qaamuuska waa la soo dejiyay');
      } else {
        // For mobile, use Share API
        await Share.share({
          message: data,
          title: 'Qaamuuska Backup',
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Khalad', 'Khalad ayaa dhacay soo dejinta');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Xaqiiji',
      'Ma hubtaa inaad rabto inaad tirtirto dhammaan ereyada qaamuuska? Tallaabadan lama celin karo.',
      [
        { text: 'Maya', style: 'cancel' },
        {
          text: 'Haa, Tirtir',
          style: 'destructive',
          onPress: async () => {
            await onClear();
            Alert.alert('Guul', 'Qaamuuska waa la nadiifiyay');
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Xaqiiji',
      'Ma hubtaa inaad rabto inaad ka baxdo?',
      [
        { text: 'Maya', style: 'cancel' },
        {
          text: 'Haa, Ka bax',
          onPress: () => {
            onLogout?.();
            onClose();
          }
        }
      ]
    );
  };

  const handleAppSettings = () => {
    Alert.alert(
      'Dejinta App-ka',
      'Halkan waxaad ka beddeli kartaa dejinta guud ee app-ka',
      [
        { text: 'OK' }
      ]
    );
  };

  const handleThemeSettings = () => {
    Alert.alert(
      'Dejinta Theme-ka',
      'Waxaa dhawaan iman doona theme-yo kala duwan',
      [
        { text: 'OK' }
      ]
    );
  };

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Dejinta</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        {currentUser && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Macluumaadka Isticmaalaha</Text>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{currentUser.username}</Text>
              <Text style={styles.userRole}>
                {currentUser.role === 'admin' ? 'Admin' : 'Isticmaale'}
              </Text>
            </View>
          </View>
        )}

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tirakoobka</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              Qaamuusku wuxuu ka kooban yahay {entriesCount} eray
            </Text>
          </View>
        </View>

        {/* Admin Settings */}
        {isAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dejinta Admin</Text>
            
            <TouchableOpacity style={[styles.settingItem, styles.adminItem]} onPress={handleAppSettings}>
              <View style={styles.settingIcon}>
                <Icon name="settings" size={24} color="#2563EB" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, styles.adminTitle]}>
                  Dejinta App-ka
                </Text>
                <Text style={styles.settingDescription}>
                  Beddel dejinta guud ee app-ka
                </Text>
              </View>
              <View style={styles.settingArrow}>
                <Icon name="chevron-forward" size={20} color="#2563EB" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, styles.adminItem]} onPress={handleThemeSettings}>
              <View style={styles.settingIcon}>
                <Icon name="color-palette" size={24} color="#2563EB" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, styles.adminTitle]}>
                  Dejinta Theme-ka
                </Text>
                <Text style={styles.settingDescription}>
                  Dooro theme-ka app-ka
                </Text>
              </View>
              <View style={styles.settingArrow}>
                <Icon name="chevron-forward" size={20} color="#2563EB" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maaraynta Xogta</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleExport}>
            <View style={styles.settingIcon}>
              <Icon name="download" size={24} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                {isExporting ? 'Soo dejinta...' : 'Soo deji Qaamuuska'}
              </Text>
              <Text style={styles.settingDescription}>
                Samee backup qaamuuska si aad u kaydiso
              </Text>
            </View>
            <View style={styles.settingArrow}>
              <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {isAdmin && (
            <TouchableOpacity 
              style={[styles.settingItem, styles.dangerItem]} 
              onPress={handleClear}
            >
              <View style={styles.settingIcon}>
                <Icon name="trash" size={24} color="#DC2626" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, styles.dangerTitle]}>
                  Nadiifi Qaamuuska
                </Text>
                <Text style={styles.settingDescription}>
                  Tirtir dhammaan ereyada qaamuuska
                </Text>
              </View>
              <View style={styles.settingArrow}>
                <Icon name="chevron-forward" size={20} color="#DC2626" />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Account */}
        {onLogout && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Akoonka</Text>
            
            <TouchableOpacity 
              style={[styles.settingItem, styles.logoutItem]} 
              onPress={handleLogout}
            >
              <View style={styles.settingIcon}>
                <Icon name="log-out" size={24} color="#92400E" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, styles.logoutTitle]}>
                  Ka bax
                </Text>
                <Text style={styles.settingDescription}>
                  Ka bax akoonkaaga
                </Text>
              </View>
              <View style={styles.settingArrow}>
                <Icon name="chevron-forward" size={20} color="#92400E" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SimpleBottomSheet>
  );
}
