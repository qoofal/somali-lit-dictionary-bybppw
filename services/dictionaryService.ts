
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DictionaryEntry } from '../types/dictionary';

const STORAGE_KEY = 'somali_dictionary_entries';

export const dictionaryService = {
  async saveEntries(entries: DictionaryEntry[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(entries);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      console.log('Dictionary entries saved successfully:', entries.length, 'entries');
    } catch (error) {
      console.error('Error saving dictionary entries:', error);
      throw error;
    }
  },

  async loadEntries(): Promise<DictionaryEntry[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        const entries = JSON.parse(jsonValue);
        // Convert date strings back to Date objects
        const processedEntries = entries.map((entry: any) => ({
          ...entry,
          dateAdded: new Date(entry.dateAdded)
        }));
        console.log('Dictionary entries loaded successfully:', processedEntries.length, 'entries');
        return processedEntries;
      }
      console.log('No dictionary entries found in storage');
      return [];
    } catch (error) {
      console.error('Error loading dictionary entries:', error);
      return [];
    }
  },

  async deleteEntry(entryId: string): Promise<boolean> {
    try {
      const entries = await this.loadEntries();
      const filteredEntries = entries.filter(entry => entry.id !== entryId);
      await this.saveEntries(filteredEntries);
      console.log('Dictionary entry deleted:', entryId);
      return true;
    } catch (error) {
      console.error('Error deleting dictionary entry:', error);
      return false;
    }
  },

  async updateEntry(entryId: string, updatedEntry: Partial<DictionaryEntry>): Promise<boolean> {
    try {
      const entries = await this.loadEntries();
      const updatedEntries = entries.map(entry => 
        entry.id === entryId ? { ...entry, ...updatedEntry } : entry
      );
      await this.saveEntries(updatedEntries);
      console.log('Dictionary entry updated:', entryId);
      return true;
    } catch (error) {
      console.error('Error updating dictionary entry:', error);
      return false;
    }
  },

  async clearEntries(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('Dictionary entries cleared successfully');
    } catch (error) {
      console.error('Error clearing dictionary entries:', error);
      throw error;
    }
  },

  async exportEntries(): Promise<string> {
    try {
      const entries = await this.loadEntries();
      const exportData = JSON.stringify(entries, null, 2);
      console.log('Dictionary entries exported successfully');
      return exportData;
    } catch (error) {
      console.error('Error exporting dictionary entries:', error);
      return '[]';
    }
  },

  async importEntries(jsonData: string): Promise<boolean> {
    try {
      const entries = JSON.parse(jsonData);
      if (Array.isArray(entries)) {
        // Validate entries structure
        const validEntries = entries.filter(entry => 
          entry && 
          typeof entry.id === 'string' && 
          typeof entry.word === 'string' && 
          typeof entry.definition === 'string'
        );
        
        if (validEntries.length > 0) {
          await this.saveEntries(validEntries);
          console.log('Dictionary entries imported successfully:', validEntries.length, 'entries');
          return true;
        } else {
          console.error('No valid entries found in import data');
          return false;
        }
      } else {
        console.error('Import data is not an array');
        return false;
      }
    } catch (error) {
      console.error('Error importing dictionary entries:', error);
      return false;
    }
  }
};
