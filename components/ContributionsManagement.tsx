
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Button from './Button';
import SimpleBottomSheet from './BottomSheet';
import Icon from './Icon';
import { contributionService, Contribution } from '../services/contributionService';

interface ContributionsManagementProps {
  isVisible: boolean;
  onClose: () => void;
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
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
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  filterOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterOptionActive: {
    backgroundColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter_500Medium',
  },
  filterOptionTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  contributionCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  pendingCard: {
    borderLeftColor: colors.warning,
  },
  approvedCard: {
    borderLeftColor: colors.success,
  },
  rejectedCard: {
    borderLeftColor: colors.error,
  },
  contributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  contributionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
    marginRight: 8,
  },
  contributionType: {
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontFamily: 'Inter_500Medium',
  },
  contributionContent: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  contributionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contributionDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  contributionCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  categoryTag: {
    fontSize: 10,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'Inter_400Regular',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: colors.success,
  },
  rejectButton: {
    backgroundColor: colors.error,
  },
  deleteButton: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'Inter_400Regular',
  },
});

type FilterType = 'all' | 'pending' | 'approved' | 'rejected';

export default function ContributionsManagement({ 
  isVisible, 
  onClose 
}: ContributionsManagementProps) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [filteredContributions, setFilteredContributions] = useState<Contribution[]>([]);
  const [filter, setFilter] = useState<FilterType>('pending');
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      loadContributions();
    }
  }, [isVisible]);

  useEffect(() => {
    filterContributions();
  }, [contributions, filter]);

  const loadContributions = async () => {
    setIsLoading(true);
    try {
      const [allContributions, contributionStats] = await Promise.all([
        contributionService.loadContributions(),
        contributionService.getContributionsStats()
      ]);
      
      setContributions(allContributions);
      setStats(contributionStats);
    } catch (error) {
      console.error('Error loading contributions:', error);
      Alert.alert('Khalad', 'Khalad ayaa dhacay soo dejinta wixii la soo diray');
    } finally {
      setIsLoading(false);
    }
  };

  const filterContributions = () => {
    if (filter === 'all') {
      setFilteredContributions(contributions);
    } else {
      setFilteredContributions(contributions.filter(c => c.status === filter));
    }
  };

  const handleApprove = async (contributionId: string) => {
    Alert.alert(
      'Xaqiiji',
      'Ma hubtaa inaad rabto inaad aqbasho wixii la soo diray?',
      [
        { text: 'Maya', style: 'cancel' },
        {
          text: 'Haa, Aqbal',
          onPress: async () => {
            const success = await contributionService.updateContributionStatus(contributionId, 'approved');
            if (success) {
              await loadContributions();
              Alert.alert('Guul', 'Wixii la soo diray waa la aqbalay');
            } else {
              Alert.alert('Khalad', 'Khalad ayaa dhacay');
            }
          }
        }
      ]
    );
  };

  const handleReject = async (contributionId: string) => {
    Alert.alert(
      'Xaqiiji',
      'Ma hubtaa inaad rabto inaad diido wixii la soo diray?',
      [
        { text: 'Maya', style: 'cancel' },
        {
          text: 'Haa, Diid',
          style: 'destructive',
          onPress: async () => {
            const success = await contributionService.updateContributionStatus(contributionId, 'rejected');
            if (success) {
              await loadContributions();
              Alert.alert('Guul', 'Wixii la soo diray waa la diiday');
            } else {
              Alert.alert('Khalad', 'Khalad ayaa dhacay');
            }
          }
        }
      ]
    );
  };

  const handleDelete = async (contributionId: string) => {
    Alert.alert(
      'Xaqiiji',
      'Ma hubtaa inaad rabto inaad tirtirto wixii la soo diray? Tallaabadan lama celin karo.',
      [
        { text: 'Maya', style: 'cancel' },
        {
          text: 'Haa, Tirtir',
          style: 'destructive',
          onPress: async () => {
            const success = await contributionService.deleteContribution(contributionId);
            if (success) {
              await loadContributions();
              Alert.alert('Guul', 'Wixii la soo diray waa la tirtiray');
            } else {
              Alert.alert('Khalad', 'Khalad ayaa dhacay');
            }
          }
        }
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('so-SO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Contribution['status']) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'approved': return colors.success;
      case 'rejected': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const renderContribution = (contribution: Contribution) => (
    <View 
      key={contribution.id} 
      style={[
        styles.contributionCard,
        contribution.status === 'pending' && styles.pendingCard,
        contribution.status === 'approved' && styles.approvedCard,
        contribution.status === 'rejected' && styles.rejectedCard,
      ]}
    >
      <View style={styles.contributionHeader}>
        <Text style={styles.contributionTitle}>{contribution.title}</Text>
        <Text style={styles.contributionType}>
          {contribution.type === 'opinion' ? 'Ra\'yi' : 'Eray'}
        </Text>
      </View>

      <Text style={styles.contributionContent} numberOfLines={3}>
        {contribution.content}
      </Text>

      <View style={styles.contributionCategories}>
        {contribution.categories.map((category, index) => (
          <Text key={index} style={styles.categoryTag}>
            {category}
          </Text>
        ))}
      </View>

      <View style={styles.contributionMeta}>
        <Text style={styles.contributionDate}>
          {formatDate(contribution.submittedAt)}
        </Text>
        <Text style={[styles.contributionDate, { color: getStatusColor(contribution.status) }]}>
          {contribution.status === 'pending' && 'Sugaya'}
          {contribution.status === 'approved' && 'La aqbalay'}
          {contribution.status === 'rejected' && 'La diiday'}
        </Text>
      </View>

      {contribution.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleApprove(contribution.id)}
          >
            <Text style={styles.actionButtonText}>Aqbal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleReject(contribution.id)}
          >
            <Text style={styles.actionButtonText}>Diid</Text>
          </TouchableOpacity>
        </View>
      )}

      {contribution.status !== 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(contribution.id)}
          >
            <Text style={[styles.actionButtonText, { color: colors.error }]}>Tirtir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SimpleBottomSheet isVisible={isVisible} onClose={onClose}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Wixii la soo diray</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Wadarta</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.warning }]}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Sugaya</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.success }]}>{stats.approved}</Text>
            <Text style={styles.statLabel}>La aqbalay</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.error }]}>{stats.rejected}</Text>
            <Text style={styles.statLabel}>La diiday</Text>
          </View>
        </View>

        {/* Filter */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterOption, filter === 'pending' && styles.filterOptionActive]}
            onPress={() => setFilter('pending')}
          >
            <Text style={[
              styles.filterOptionText,
              filter === 'pending' && styles.filterOptionTextActive
            ]}>
              Sugaya
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterOption, filter === 'approved' && styles.filterOptionActive]}
            onPress={() => setFilter('approved')}
          >
            <Text style={[
              styles.filterOptionText,
              filter === 'approved' && styles.filterOptionTextActive
            ]}>
              La aqbalay
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterOption, filter === 'rejected' && styles.filterOptionActive]}
            onPress={() => setFilter('rejected')}
          >
            <Text style={[
              styles.filterOptionText,
              filter === 'rejected' && styles.filterOptionTextActive
            ]}>
              La diiday
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterOption, filter === 'all' && styles.filterOptionActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[
              styles.filterOptionText,
              filter === 'all' && styles.filterOptionTextActive
            ]}>
              Dhammaantood
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contributions List */}
        {isLoading ? (
          <View style={styles.emptyState}>
            <Icon name="hourglass" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>Soo dejinaya...</Text>
          </View>
        ) : filteredContributions.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="document-text" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>
              {filter === 'pending' && 'Ma jiraan wax sugaya'}
              {filter === 'approved' && 'Ma jiraan wax la aqbalay'}
              {filter === 'rejected' && 'Ma jiraan wax la diiday'}
              {filter === 'all' && 'Wali wax lama soo dirin'}
            </Text>
          </View>
        ) : (
          filteredContributions.map(renderContribution)
        )}
      </ScrollView>
    </SimpleBottomSheet>
  );
}
