
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DictionaryEntry } from '../types/dictionary';

const STORAGE_KEY = 'somali_dictionary_entries';

export const dictionaryService = {
  async saveEntries(entries: DictionaryEntry[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(entries);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      console.log('Dictionary entries saved successfully');
    } catch (error) {
      console.error('Error saving dictionary entries:', error);
    }
  },

  async loadEntries(): Promise<DictionaryEntry[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        const entries = JSON.parse(jsonValue);
        // Convert date strings back to Date objects
        return entries.map((entry: any) => ({
          ...entry,
          dateAdded: new Date(entry.dateAdded)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading dictionary entries:', error);
      return [];
    }
  },

  async clearEntries(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('Dictionary entries cleared successfully');
    } catch (error) {
      console.error('Error clearing dictionary entries:', error);
    }
  },

  async exportEntries(): Promise<string> {
    try {
      const entries = await this.loadEntries();
      return JSON.stringify(entries, null, 2);
    } catch (error) {
      console.error('Error exporting dictionary entries:', error);
      return '[]';
    }
  },

  async importEntries(jsonData: string): Promise<boolean> {
    try {
      const entries = JSON.parse(jsonData);
      if (Array.isArray(entries)) {
        await this.saveEntries(entries);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing dictionary entries:', error);
      return false;
    }
  }
};
