
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import Button from './Button';
import SimpleBottomSheet from './BottomSheet';
import ContributionsManagement from './ContributionsManagement';
import { User } from '../types/user';
import { authService } from '../services/authService';
import { contributionService } from '../services/contributionService';

interface AdminPanelProps {
  isVisible: boolean;
  onClose: () => void;
  currentUser: User;
  onDeleteEntry?: (entryId: string) => void;
  entriesCount: number;
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    minWidth: '22%',
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: 'Inter_700Bold',
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  userCard: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  userRole: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  warningCard: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  warningText: {
    color: '#92400E',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
});

export default function AdminPanel({ isVisible, onClose, currentUser, entriesCount }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isContributionsVisible, setIsContributionsVisible] = useState(false);
  const [contributionsStats, setContributionsStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    if (isVisible) {
      loadUsers();
      loadContributionsStats();
    }
  }, [isVisible]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const allUsers = await authService.getAllUsers();
      setUsers(allUsers);
      console.log('Loaded users for admin panel:', allUsers.length);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadContributionsStats = async () => {
    try {
      const stats = await contributionService.getContributionsStats();
      setContributionsStats(stats);
      console.log('Loaded contributions stats:', stats);
    } catch (error) {
      console.error('Error loading contributions stats:', error);
    }
  };

  const handlePromoteUser = async (userId: string, username: string) => {
    Alert.alert(
      'Xaqiiji',
      `Ma hubtaa inaad rabto in aad admin ka dhigto ${username}?`,
      [
        { text: 'Maya', style: 'cancel' },
        {
          text: 'Haa',
          onPress: async () => {
            const success = await authService.promoteToAdmin(userId);
            if (success) {
              Alert.alert('Guul', `${username} wuxuu noqday admin`);
              loadUsers(); // Refresh the users list
            } else {
              Alert.alert('Khalad', 'Khalad ayaa dhacay');
            }
          }
        }
      ]
    );
  };

  const adminUsers = users.filter(u => u.role === 'admin');
  const regularUsers = users.filter(u => u.role === 'user');

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Maamulka Admin</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tirakoobka Guud</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{entriesCount}</Text>
              <Text style={styles.statLabel}>Erayo</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{users.length}</Text>
              <Text style={styles.statLabel}>Isticmaalayaal</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{adminUsers.length}</Text>
              <Text style={styles.statLabel}>Admin-no</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: colors.warning }]}>{contributionsStats.pending}</Text>
              <Text style={styles.statLabel}>Sugaya</Text>
            </View>
          </View>
        </View>

        {/* Contributions Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wixii la soo diray</Text>
          <TouchableOpacity
            style={[styles.userCard, { backgroundColor: contributionsStats.pending > 0 ? '#FEF3C7' : colors.backgroundAlt }]}
            onPress={() => setIsContributionsVisible(true)}
          >
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Maamul wixii la soo diray</Text>
              <Text style={styles.userEmail}>
                {contributionsStats.total} wadarta, {contributionsStats.pending} sugaya
              </Text>
              {contributionsStats.pending > 0 && (
                <Text style={[styles.userRole, { color: colors.warning }]}>
                  {contributionsStats.pending} SUGAYA EEGISTA
                </Text>
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {contributionsStats.pending > 0 && (
                <View style={{
                  backgroundColor: colors.warning,
                  borderRadius: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}>
                  <Text style={{ color: colors.text, fontSize: 12, fontWeight: '600' }}>
                    {contributionsStats.pending}
                  </Text>
                </View>
              )}
              <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Admin Users */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin-ada ({adminUsers.length})</Text>
          {adminUsers.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.username}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userRole}>ADMIN</Text>
              </View>
              <Icon name="shield-checkmark" size={24} color={colors.primary} />
            </View>
          ))}
        </View>

        {/* Regular Users */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Isticmaalayaasha Caadiga ah ({regularUsers.length})</Text>
          {regularUsers.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.username}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userRole}>USER</Text>
              </View>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handlePromoteUser(user.id, user.username)}
              >
                <Text style={styles.actionButtonText}>Ka dhig Admin</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Warning */}
        <View style={styles.warningCard}>
          <Text style={styles.warningText}>
            <Text style={{ fontWeight: '600' }}>Digniin:</Text> Admin-ada kaliya ayaa awood u leh inay ku daraan, wax ka beddelaan, ama tirtiraan ereyada qaamuuska. Isticmaalayaasha caadiga ah waxay kaliya arki karaan qaamuuska.
          </Text>
        </View>
      </ScrollView>

      {/* Contributions Management Modal */}
      <ContributionsManagement
        isVisible={isContributionsVisible}
        onClose={() => {
          setIsContributionsVisible(false);
          loadContributionsStats(); // Refresh stats when closing
        }}
      />
    </SimpleBottomSheet>
  );
}
