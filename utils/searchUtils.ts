
export const normalizeText = (text: string): string => {
  return text.toLowerCase().trim();
};

export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm.trim()) return text;
  
  const normalizedSearch = normalizeText(searchTerm);
  const normalizedText = normalizeText(text);
  
  const index = normalizedText.indexOf(normalizedSearch);
  if (index === -1) return text;
  
  const before = text.substring(0, index);
  const match = text.substring(index, index + searchTerm.length);
  const after = text.substring(index + searchTerm.length);
  
  return `${before}**${match}**${after}`;
};

export const getSearchSuggestions = (entries: any[], query: string, limit: number = 5): string[] => {
  if (!query.trim()) return [];
  
  const normalizedQuery = normalizeText(query);
  const suggestions = new Set<string>();
  
  entries.forEach(entry => {
    const words = [
      entry.word,
      ...(entry.synonyms || []),
      ...(entry.examples || []).join(' ').split(' ')
    ];
    
    words.forEach(word => {
      const normalizedWord = normalizeText(word);
      if (normalizedWord.includes(normalizedQuery) && normalizedWord !== normalizedQuery) {
        suggestions.add(word);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, limit);
};
