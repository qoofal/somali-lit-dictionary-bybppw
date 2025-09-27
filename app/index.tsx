
import React, { useState } from 'react';
import { Text, View, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import DictionaryCard from '../components/DictionaryCard';
import AddTermBottomSheet from '../components/AddTermBottomSheet';
import SettingsBottomSheet from '../components/SettingsBottomSheet';
import LoadingScreen from '../components/LoadingScreen';
import StatsCard from '../components/StatsCard';
import SearchSuggestions from '../components/SearchSuggestions';
import WelcomeCard from '../components/WelcomeCard';
import CategoryFilter from '../components/CategoryFilter';
import { DictionaryEntry } from '../types/dictionary';
import { useDictionary } from '../hooks/useDictionary';
import { getSearchSuggestions } from '../utils/searchUtils';

export default function MainScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddTermVisible, setIsAddTermVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'add'>('home');
  
  const { 
    entries, 
    isLoading, 
    addEntry, 
    searchEntries, 
    getEntriesByCategory,
    clearAllEntries,
    exportDictionary,
    importDictionary 
  } = useDictionary();
  
  // Apply search and category filters
  let filteredEntries = searchQuery.length > 0 
    ? searchEntries(searchQuery)
    : entries.slice(0, 10); // Show first 10 entries on home

  // Apply category filter if selected
  if (selectedCategory && activeTab === 'search') {
    const categoryEntries = getEntriesByCategory(selectedCategory as DictionaryEntry['category']);
    filteredEntries = searchQuery.length > 0 
      ? categoryEntries.filter(entry => 
          entry.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.definition.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : categoryEntries;
  }

  const featuredEntries = entries.slice(0, 3); // Featured terms for home screen
  const searchSuggestions = searchQuery.length > 0 && searchQuery.length < 3 
    ? getSearchSuggestions(entries, searchQuery, 5)
    : [];

  const renderHomeContent = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 20 }}>
        <Text style={commonStyles.title}>Qaamuuska Suugaanta Soomaaliyeed</Text>
        <Text style={commonStyles.subtitleSecondary}>
          qaamuuska erey-bixin suugaaneedka afka Soomaaliga
        </Text>

        {/* Search Bar */}
        <View style={commonStyles.searchContainer}>
          <Icon name="search" size={20} color={colors.text} />
          <TextInput
            style={commonStyles.searchInput}
            placeholder="Raadi eray..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setActiveTab('search')}
          />
        </View>

        {/* Welcome Card */}
        {showWelcome && (
          <WelcomeCard onDismiss={() => setShowWelcome(false)} />
        )}

        {/* Stats Card */}
        <StatsCard entries={entries} />

        {/* Featured Terms */}
        <View style={{ marginBottom: 24 }}>
          <Text style={commonStyles.subtitle}>Erayo Muhiim ah</Text>
          {featuredEntries.map((entry) => (
            <DictionaryCard key={entry.id} entry={entry} />
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderSearchContent = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 20 }}>
        <Text style={commonStyles.subtitle}>Raadinta Ereyada</Text>
        
        {/* Search Bar */}
        <View style={commonStyles.searchContainer}>
          <Icon name="search" size={20} color={colors.text} />
          <TextInput
            style={commonStyles.searchInput}
            placeholder="Gali ereyga aad raadineyso..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>

        {/* Search Suggestions */}
        <SearchSuggestions
          suggestions={searchSuggestions}
          onSuggestionPress={setSearchQuery}
          visible={searchQuery.length > 0 && searchQuery.length < 3}
        />

        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          entries={entries}
        />

        {/* Search Results */}
        {searchQuery.length > 0 && (
          <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
            {filteredEntries.length} natiiijo ah "{searchQuery}"
          </Text>
        )}

        {filteredEntries.map((entry) => (
          <DictionaryCard key={entry.id} entry={entry} />
        ))}

        {searchQuery.length > 0 && filteredEntries.length === 0 && (
          <View style={[commonStyles.card, { alignItems: 'center', padding: 32 }]}>
            <Icon name="search" size={48} color={colors.text} />
            <Text style={[commonStyles.text, { textAlign: 'center', marginTop: 16 }]}>
              Lama helin eray la mid ah "{searchQuery}"
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
              Isku day erayo kale ama ku dar erey cusub
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderAddContent = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 20 }}>
        <Text style={commonStyles.subtitle}>Ku dar Erey Cusub</Text>
        
        <TouchableOpacity
          style={[commonStyles.card, { 
            alignItems: 'center', 
            padding: 32,
            borderStyle: 'dashed',
            borderColor: colors.primary,
            backgroundColor: colors.backgroundAlt
          }]}
          onPress={() => setIsAddTermVisible(true)}
        >
          <Icon name="add-circle" size={48} color={colors.text} />
          <Text style={[commonStyles.text, { 
            textAlign: 'center', 
            marginTop: 16,
            color: colors.primary,
            fontWeight: '600'
          }]}>
            Ku dar Erey Cusub
          </Text>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
            Gacan ku haye horumarinta qaamuuska
          </Text>
        </TouchableOpacity>

        {/* Recent Additions */}
        <View style={{ marginTop: 24 }}>
          <Text style={commonStyles.subtitle}>Erayo Dhawaan la daray</Text>
          {entries.slice(-5).reverse().map((entry) => (
            <DictionaryCard key={entry.id} entry={entry} />
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'search':
        return renderSearchContent();
      case 'add':
        return renderAddContent();
      default:
        return renderHomeContent();
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={commonStyles.headerContainer}>
        <Text style={commonStyles.headerTitle}>
          {activeTab === 'home' && 'Qaamuuska'}
          {activeTab === 'search' && 'Raadinta'}
          {activeTab === 'add' && 'Ku dar'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {activeTab === 'search' && searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setIsSettingsVisible(true)}>
            <Icon name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={commonStyles.content}>
        {renderContent()}
      </View>

      {/* Bottom Navigation */}
      <View style={commonStyles.bottomTabContainer}>
        <TouchableOpacity
          style={commonStyles.tabItem}
          onPress={() => {
            setActiveTab('home');
            setSearchQuery('');
          }}
        >
          <Icon 
            name="home" 
            size={24} 
            color={activeTab === 'home' ? colors.primary : colors.text} 
          />
          <Text style={activeTab === 'home' ? commonStyles.tabTextActive : commonStyles.tabText}>
            Guriga
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={commonStyles.tabItem}
          onPress={() => setActiveTab('search')}
        >
          <Icon 
            name="search" 
            size={24} 
            color={activeTab === 'search' ? colors.primary : colors.text} 
          />
          <Text style={activeTab === 'search' ? commonStyles.tabTextActive : commonStyles.tabText}>
            Raadi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={commonStyles.tabItem}
          onPress={() => setActiveTab('add')}
        >
          <Icon 
            name="add-circle" 
            size={24} 
            color={activeTab === 'add' ? colors.primary : colors.text} 
          />
          <Text style={activeTab === 'add' ? commonStyles.tabTextActive : commonStyles.tabText}>
            Ku dar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Term Bottom Sheet */}
      <AddTermBottomSheet
        isVisible={isAddTermVisible}
        onClose={() => setIsAddTermVisible(false)}
        onAddTerm={(term) => {
          addEntry(term);
          setIsAddTermVisible(false);
          console.log('New term added:', term);
        }}
      />

      {/* Settings Bottom Sheet */}
      <SettingsBottomSheet
        isVisible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
        onExport={exportDictionary}
        onImport={importDictionary}
        onClear={clearAllEntries}
        entriesCount={entries.length}
      />
    </SafeAreaView>
  );
}
