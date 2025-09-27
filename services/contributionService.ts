
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Contribution {
  id: string;
  type: 'opinion' | 'word';
  title: string;
  content: string;
  categories: string[];
  contactInfo?: string;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy?: string;
}

const CONTRIBUTIONS_STORAGE_KEY = 'somali_dictionary_contributions';

export const contributionService = {
  async saveContribution(contribution: Omit<Contribution, 'id' | 'submittedAt' | 'status'>): Promise<{ success: boolean; message: string }> {
    try {
      const contributions = await this.loadContributions();
      
      const newContribution: Contribution = {
        ...contribution,
        id: Date.now().toString(),
        submittedAt: new Date(),
        status: 'pending'
      };

      contributions.push(newContribution);
      await AsyncStorage.setItem(CONTRIBUTIONS_STORAGE_KEY, JSON.stringify(contributions));

      console.log('New contribution saved:', newContribution.title);
      return { success: true, message: 'Wixii aad soo dirtay waa la kaydiyay' };
    } catch (error) {
      console.error('Error saving contribution:', error);
      return { success: false, message: 'Khalad ayaa dhacay kaydinta' };
    }
  },

  async loadContributions(): Promise<Contribution[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(CONTRIBUTIONS_STORAGE_KEY);
      if (jsonValue != null) {
        const contributions = JSON.parse(jsonValue);
        return contributions.map((c: any) => ({
          ...c,
          submittedAt: new Date(c.submittedAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading contributions:', error);
      return [];
    }
  },

  async getContributionsByStatus(status: Contribution['status']): Promise<Contribution[]> {
    try {
      const contributions = await this.loadContributions();
      return contributions.filter(c => c.status === status);
    } catch (error) {
      console.error('Error filtering contributions:', error);
      return [];
    }
  },

  async updateContributionStatus(contributionId: string, status: Contribution['status']): Promise<boolean> {
    try {
      const contributions = await this.loadContributions();
      const updatedContributions = contributions.map(c => 
        c.id === contributionId ? { ...c, status } : c
      );
      
      await AsyncStorage.setItem(CONTRIBUTIONS_STORAGE_KEY, JSON.stringify(updatedContributions));
      console.log('Contribution status updated:', contributionId, status);
      return true;
    } catch (error) {
      console.error('Error updating contribution status:', error);
      return false;
    }
  },

  async deleteContribution(contributionId: string): Promise<boolean> {
    try {
      const contributions = await this.loadContributions();
      const filteredContributions = contributions.filter(c => c.id !== contributionId);
      
      await AsyncStorage.setItem(CONTRIBUTIONS_STORAGE_KEY, JSON.stringify(filteredContributions));
      console.log('Contribution deleted:', contributionId);
      return true;
    } catch (error) {
      console.error('Error deleting contribution:', error);
      return false;
    }
  },

  async getContributionsStats(): Promise<{ total: number; pending: number; approved: number; rejected: number }> {
    try {
      const contributions = await this.loadContributions();
      return {
        total: contributions.length,
        pending: contributions.filter(c => c.status === 'pending').length,
        approved: contributions.filter(c => c.status === 'approved').length,
        rejected: contributions.filter(c => c.status === 'rejected').length
      };
    } catch (error) {
      console.error('Error getting contributions stats:', error);
      return { total: 0, pending: 0, approved: 0, rejected: 0 };
    }
  }
};
