
import { useState, useEffect } from 'react';
import { DictionaryEntry, NewDictionaryEntry } from '../types/dictionary';
import { dictionaryService } from '../services/dictionaryService';

// Sample initial data for the Somali literature dictionary
const initialEntries: DictionaryEntry[] = [
  {
    id: '1',
    word: 'Gabay',
    definition: 'Waa nooc ka mid ah suugaanta Soomaaliyeed oo ah maansada ugu weyn ee dhaqanka Soomaaliyeed.',
    literaryContext: 'Gabaygu waa mid ka mid ah noocyada suugaanta ee ugu muhiimsan dhaqanka Soomaaliyeed.',
    examples: ['Gabayga Sayid Maxamed Cabdulle Xasan', 'Gabayada Ismaaciil Mire'],
    synonyms: ['Maanso', 'Hees dheer'],
    category: 'gabay',
    poetName: 'Sayid Maxamed Cabdulle Xasan',
    poemHistory: 'Gabaygan wuxuu ku saabsan yahay dagaalkii Dervishka',
    poemText: 'Tii hore way iga tagtay...',
    dateAdded: new Date('2024-01-01'),
    addedBy: 'System'
  },
  {
    id: '2',
    word: 'Hees',
    definition: 'Waa suugaan lagu qoro oo lagu luuqeeyo, badanaa waxay la socotaa muusig.',
    literaryContext: 'Heesaha waxay door muhiim ah ka ciyaaraan dhaqanka iyo suugaanta Soomaaliyeed.',
    examples: ['Heesaha Magool', 'Heesaha Khadra Daahir'],
    synonyms: ['Luuq', 'Gabay gaaban'],
    category: 'hees',
    poetName: 'Magool',
    poemHistory: 'Heesan waxay ku saabsan tahay jacaylka',
    poemText: 'Jacayl baan qabaa...',
    dateAdded: new Date('2024-01-02'),
    addedBy: 'System'
  },
  {
    id: '3',
    word: 'Sheeko',
    definition: 'Waa wariye ama qiso la sheego, badanaa waxay ka kooban tahay dhacdooyin khayaali ah ama dhab ah.',
    literaryContext: 'Sheekoyinku waxay muhiim u yihiin dhaqalka suugaanta Soomaaliyeed.',
    examples: ['Sheekada Igaal Shidaad', 'Sheekada Wiil Waal'],
    synonyms: ['Qiso', 'Wariye'],
    category: 'literary_term',
    dateAdded: new Date('2024-01-03'),
    addedBy: 'System'
  },
  {
    id: '4',
    word: 'Maahmaah',
    definition: 'Waa odhaah gaaban oo xigmad leh, badanaa waxay ka tarjumaysaa waayo-aragnimo dhaqameed.',
    literaryContext: 'Maahmaahyadu waxay ka mid yihiin hantida suugaanta Soomaaliyeed.',
    examples: ['Nin walba wuxuu ku nool yahay wixii uu yaqaan', 'Wax walba waqtigiisii baa leh'],
    synonyms: ['Odhaah', 'Xigmad'],
    category: 'literary_term',
    dateAdded: new Date('2024-01-04'),
    addedBy: 'System'
  },
  {
    id: '5',
    word: 'Suugaan',
    definition: 'Waa farshaxanka qoraalka iyo hadalka ee loo isticmaalo in lagu muujiyo dareenka, fikradaha, iyo waayo-aragnimada.',
    literaryContext: 'Suugaantu waa saldhigga dhaqanka Soomaaliyeed.',
    examples: ['Suugaanta Soomaaliyeed', 'Suugaanta casriga ah'],
    synonyms: ['Farshaxan', 'Qoraal farshaxan'],
    category: 'literary_term',
    dateAdded: new Date('2024-01-05'),
    addedBy: 'System'
  },
  {
    id: '6',
    word: 'Buraanbur',
    definition: 'Waa nooc ka mid ah suugaanta Soomaaliyeed oo ay badanaa tiraan haweenka, waxayna ku saabsan tahay dhacdooyin bulsheed.',
    literaryContext: 'Buraanburku waa mid ka mid ah noocyada suugaanta ee gaar u ah haweenka Soomaaliyeed.',
    examples: ['Buraanbur Barni', 'Buraanbur Hibo'],
    synonyms: ['Hees haween', 'Maanso haween'],
    category: 'hees',
    poetName: 'Barni',
    poemHistory: 'Buraanburkan wuxuu ku saabsan yahay guusha dagaal',
    poemText: 'Raggii geesiga ahaa...',
    dateAdded: new Date('2024-01-06'),
    addedBy: 'System'
  },
  {
    id: '7',
    word: 'Geeraar',
    definition: 'Waa nooc ka mid ah suugaanta Soomaaliyeed oo loo isticmaalo dagaalka iyo dhiirrigelinta.',
    literaryContext: 'Geeraarka waxaa loo isticmaali jiray xilliyadii dagaalka si loo dhiirrigaliyo ciidamada.',
    examples: ['Geeraar Sayid', 'Geeraar Dervish'],
    synonyms: ['Hees dagaal', 'Dhiirrigelin'],
    category: 'gabay',
    poetName: 'Sayid Maxamed Cabdulle Xasan',
    poemHistory: 'Geeraarkan wuxuu ku saabsan yahay dagaalkii xoreynta',
    poemText: 'Geesi baan ahay...',
    dateAdded: new Date('2024-01-07'),
    addedBy: 'System'
  },
  {
    id: '8',
    word: 'Jiifto',
    definition: 'Waa nooc ka mid ah suugaanta Soomaaliyeed oo gaaban, badanaa waxay ka hadlaysaa jacayl ama murugto.',
    literaryContext: 'Jiiftadu waa mid ka mid ah noocyada suugaanta ee gaagaaban.',
    examples: ['Jiifto jacayl', 'Jiifto calool xanuun'],
    synonyms: ['Hees gaaban', 'Luuq gaaban'],
    category: 'hees',
    poetName: 'Khadra Daahir',
    poemHistory: 'Jiiftadan waxay ku saabsan tahay jacaylka lumay',
    poemText: 'Jacaylkii baan waayay...',
    dateAdded: new Date('2024-01-08'),
    addedBy: 'System'
  }
];

export const useDictionary = () => {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load entries from storage on mount
  useEffect(() => {
    const loadStoredEntries = async () => {
      try {
        console.log('Loading dictionary entries...');
        const storedEntries = await dictionaryService.loadEntries();
        if (storedEntries.length > 0) {
          console.log('Loaded', storedEntries.length, 'entries from storage');
          setEntries(storedEntries);
        } else {
          console.log('No stored entries found, using initial entries');
          // If no stored entries, save initial entries
          await dictionaryService.saveEntries(initialEntries);
          setEntries(initialEntries);
        }
      } catch (error) {
        console.error('Error loading dictionary entries:', error);
        // Fallback to initial entries if loading fails
        setEntries(initialEntries);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredEntries();
  }, []);

  // Save entries whenever they change (but not during initial load)
  useEffect(() => {
    if (!isLoading && entries.length > 0) {
      console.log('Saving', entries.length, 'entries to storage');
      dictionaryService.saveEntries(entries).catch(error => {
        console.error('Error saving entries:', error);
      });
    }
  }, [entries, isLoading]);

  const addEntry = (newEntry: NewDictionaryEntry, addedBy: string = 'User') => {
    const entry: DictionaryEntry = {
      ...newEntry,
      id: Date.now().toString(),
      dateAdded: new Date(),
      addedBy
    };
    
    setEntries(prevEntries => [entry, ...prevEntries]);
    console.log('Added new dictionary entry:', entry.word);
  };

  const deleteEntry = async (entryId: string): Promise<boolean> => {
    try {
      console.log('Deleting entry:', entryId);
      const success = await dictionaryService.deleteEntry(entryId);
      if (success) {
        setEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
        console.log('Entry deleted successfully');
        return true;
      }
      console.error('Failed to delete entry from storage');
      return false;
    } catch (error) {
      console.error('Error deleting entry:', error);
      return false;
    }
  };

  const searchEntries = (query: string): DictionaryEntry[] => {
    if (!query.trim()) return entries;
    
    const lowercaseQuery = query.toLowerCase();
    return entries.filter(entry => 
      entry.word.toLowerCase().includes(lowercaseQuery) ||
      entry.definition.toLowerCase().includes(lowercaseQuery) ||
      entry.literaryContext?.toLowerCase().includes(lowercaseQuery) ||
      entry.poetName?.toLowerCase().includes(lowercaseQuery) ||
      entry.poemHistory?.toLowerCase().includes(lowercaseQuery) ||
      entry.examples?.some(example => example.toLowerCase().includes(lowercaseQuery)) ||
      entry.synonyms?.some(synonym => synonym.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getEntriesByCategory = (category: DictionaryEntry['category']): DictionaryEntry[] => {
    return entries.filter(entry => entry.category === category);
  };

  const getRandomEntries = (count: number): DictionaryEntry[] => {
    const shuffled = [...entries].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const clearAllEntries = async () => {
    try {
      console.log('Clearing all entries and resetting to initial data');
      await dictionaryService.clearEntries();
      setEntries(initialEntries);
      await dictionaryService.saveEntries(initialEntries);
      console.log('Dictionary reset to initial entries');
    } catch (error) {
      console.error('Error clearing dictionary:', error);
    }
  };

  const exportDictionary = async (): Promise<string> => {
    try {
      console.log('Exporting dictionary');
      return await dictionaryService.exportEntries();
    } catch (error) {
      console.error('Error exporting dictionary:', error);
      return JSON.stringify(entries, null, 2);
    }
  };

  const importDictionary = async (jsonData: string): Promise<boolean> => {
    try {
      console.log('Importing dictionary');
      const success = await dictionaryService.importEntries(jsonData);
      if (success) {
        const importedEntries = await dictionaryService.loadEntries();
        setEntries(importedEntries);
        console.log('Dictionary imported successfully');
      }
      return success;
    } catch (error) {
      console.error('Error importing dictionary:', error);
      return false;
    }
  };

  return {
    entries,
    isLoading,
    addEntry,
    deleteEntry,
    searchEntries,
    getEntriesByCategory,
    getRandomEntries,
    clearAllEntries,
    exportDictionary,
    importDictionary
  };
};
