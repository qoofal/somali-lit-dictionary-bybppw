
export interface DictionaryEntry {
  id: string;
  word: string;
  definition: string;
  literaryContext?: string;
  examples?: string[];
  synonyms?: string[];
  category?: 'gabay' | 'hees' | 'noun' | 'verb' | 'adjective' | 'adverb' | 'literary_term' | 'other';
  // New fields for poem sub-categories
  poetName?: string;           // magaca gabyaaga
  poemHistory?: string;        // taariikhda gabayga
  poemText?: string;          // gabayga
  dateAdded: Date;
  addedBy?: string;
}

export interface NewDictionaryEntry {
  word: string;
  definition: string;
  literaryContext?: string;
  examples?: string[];
  synonyms?: string[];
  category?: 'gabay' | 'hees' | 'noun' | 'verb' | 'adjective' | 'adverb' | 'literary_term' | 'other';
  // New fields for poem sub-categories
  poetName?: string;           // magaca gabyaaga
  poemHistory?: string;        // taariikhda gabayga
  poemText?: string;          // gabayga
}
