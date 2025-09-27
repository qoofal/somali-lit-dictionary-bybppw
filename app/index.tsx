
import React, { useState } from 'react';
import { Text, View, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground, Alert } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import DictionaryCard from '../components/DictionaryCard';
import AddTermBottomSheet from '../components/AddTermBottomSheet';
import SettingsBottomSheet from '../components/SettingsBottomSheet';
import AdminPanel from '../components/AdminPanel';
import LoadingScreen from '../components/LoadingScreen';
import StatsCard from '../components/StatsCard';
import SearchSuggestions from '../components/SearchSuggestions';
import WelcomeCard from '../components/WelcomeCard';
import CategoryFilter from '../components/CategoryFilter';
import AuthScreen from '../components/AuthScreen';
import CategoryManagement from '../components/CategoryManagement';
import ContributionBottomSheet from '../components/ContributionBottomSheet';
import { DictionaryEntry } from '../types/dictionary';
import { useDictionary } from '../hooks/useDictionary';
import { useAuth } from '../hooks/useAuth';
import { getSearchSuggestions } from '../utils/searchUtils';

export default function MainScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddTermVisible, setIsAddTermVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isAdminPanelVisible, setIsAdminPanelVisible] = useState(false);
  const [isCategoryManagementVisible, setIsCategoryManagementVisible] = useState(false);
  const [isContributionVisible, setIsContributionVisible] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'contribute'>('home');
  
  const { 
    entries, 
    isLoading: isDictionaryLoading, 
    addEntry, 
    deleteEntry,
    searchEntries, 
    getEntriesByCategory,
    clearAllEntries,
    exportDictionary,
    importDictionary 
  } = useDictionary();

  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
    login,
    register,
    logout,
    isAdmin
  } = useAuth();
  
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

  const handleDeleteEntry = async (entryId: string) => {
    console.log('Attempting to delete entry:', entryId);
    const success = await deleteEntry(entryId);
    if (success) {
      console.log('Entry deleted successfully');
    } else {
      console.error('Failed to delete entry');
    }
  };

  const renderHomeContent = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 20 }}>
        <Text style={commonStyles.title}>Qaamuuska Suugaanta Soomaaliyeed</Text>
        <Text style={commonStyles.subtitleSecondary}>
          qaamuuska erey-bixin suugaaneedka afka Soomaaliga
        </Text>

        {/* User Welcome */}
        {user && (
          <View style={[commonStyles.card, { marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <View>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                Ku soo dhowoow, {user.username}!
              </Text>
              <Text style={commonStyles.textSecondary}>
                {isAdmin() ? 'Admin' : 'Isticmaale'}
              </Text>
            </View>
            <TouchableOpacity onPress={logout}>
              <Icon name="log-out" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Search Bar */}
        <View style={commonStyles.searchContainer}>
          <Icon name="search" size={20} color={colors.background} />
          <TextInput
            style={commonStyles.searchInput}
            placeholder="Raadi eray..."
            placeholderTextColor={colors.grey}
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
            <DictionaryCard 
              key={entry.id} 
              entry={entry} 
              isAdmin={isAdmin()}
              onDelete={handleDeleteEntry}
            />
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
          <Icon name="search" size={20} color={colors.background} />
          <TextInput
            style={commonStyles.searchInput}
            placeholder="Gali ereyga aad raadineyso..."
            placeholderTextColor={colors.grey}
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
          <DictionaryCard 
            key={entry.id} 
            entry={entry} 
            isAdmin={isAdmin()}
            onDelete={handleDeleteEntry}
          />
        ))}

        {searchQuery.length > 0 && filteredEntries.length === 0 && (
          <View style={[commonStyles.card, { alignItems: 'center', padding: 32 }]}>
            <Icon name="search" size={48} color={colors.text} />
            <Text style={[commonStyles.text, { textAlign: 'center', marginTop: 16 }]}>
              Lama helin eray la mid ah "{searchQuery}"
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
              Isku day erayo kale ama soo gudbi talooyin cusub
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderContributeContent = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 20 }}>
        <Text style={commonStyles.subtitle}>
          {isAdmin() ? 'Ku dar Erey Cusub' : 'Soo gudbi Talooyin'}
        </Text>
        
        {isAdmin() ? (
          // Admin can add terms directly
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
            <Icon name="add-circle" size={48} color={colors.primary} />
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
        ) : (
          // Regular users can only contribute suggestions
          <TouchableOpacity
            style={[commonStyles.card, { 
              alignItems: 'center', 
              padding: 32,
              borderStyle: 'dashed',
              borderColor: colors.primary,
              backgroundColor: colors.backgroundAlt
            }]}
            onPress={() => setIsContributionVisible(true)}
          >
            <Icon name="bulb" size={48} color={colors.primary} />
            <Text style={[commonStyles.text, { 
              textAlign: 'center', 
              marginTop: 16,
              color: colors.primary,
              fontWeight: '600'
            }]}>
              Soo gudbi Talo
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
              Soo gudbi erayo cusub ama ra&apos;yi ku saabsan qaamuuska
            </Text>
          </TouchableOpacity>
        )}

        {/* Information Card for Regular Users */}
        {!isAdmin() && (
          <View style={[commonStyles.card, { marginTop: 16, backgroundColor: '#FEF3C7' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Icon name="information-circle" size={20} color="#92400E" />
              <Text style={[commonStyles.text, { marginLeft: 8, fontWeight: '600', color: '#92400E' }]}>
                Macluumaad
              </Text>
            </View>
            <Text style={[commonStyles.textSecondary, { color: '#92400E' }]}>
              Kaliya admin-ada ayaa si toos ah u dari kara erayo cusub. Isticmaalayaasha caadiga ah waxay soo gudbi karaan talooyin oo admin-ku uu eegi doono.
            </Text>
          </View>
        )}

        {/* Recent Additions */}
        <View style={{ marginTop: 24 }}>
          <Text style={commonStyles.subtitle}>Erayo Dhawaan la daray</Text>
          {entries.slice(-5).reverse().map((entry) => (
            <DictionaryCard 
              key={entry.id} 
              entry={entry} 
              isAdmin={isAdmin()}
              onDelete={handleDeleteEntry}
            />
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
      case 'contribute':
        return renderContributeContent();
      default:
        return renderHomeContent();
    }
  };

  // Show loading screen while auth is initializing
  if (isAuthLoading || isDictionaryLoading) {
    return <LoadingScreen message="Diyaarinta qaamuuska..." />;
  }

  // Show auth screen if user is not authenticated
  if (!isAuthenticated) {
    return (
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop' }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <AuthScreen onLogin={login} onRegister={register} />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop' }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={commonStyles.container}>
        {/* Header */}
        <View style={commonStyles.headerContainer}>
          <Text style={commonStyles.headerTitle}>
            {activeTab === 'home' && 'Qaamuuska'}
            {activeTab === 'search' && 'Raadinta'}
            {activeTab === 'contribute' && (isAdmin() ? 'Ku dar' : 'Soo gudbi')}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {activeTab === 'search' && searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            )}
            {isAdmin() && (
              <>
                <TouchableOpacity onPress={() => setIsCategoryManagementVisible(true)}>
                  <Icon name="list" size={24} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsAdminPanelVisible(true)}>
                  <Icon name="shield-checkmark" size={24} color={colors.primary} />
                </TouchableOpacity>
              </>
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
              Ardaaga
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
            onPress={() => setActiveTab('contribute')}
          >
            <Icon 
              name={isAdmin() ? "add-circle" : "bulb"} 
              size={24} 
              color={activeTab === 'contribute' ? colors.primary : colors.text} 
            />
            <Text style={activeTab === 'contribute' ? commonStyles.tabTextActive : commonStyles.tabText}>
              {isAdmin() ? 'Ku dar' : 'Soo gudbi'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add Term Bottom Sheet - Only for Admins */}
        {isAdmin() && (
          <AddTermBottomSheet
            isVisible={isAddTermVisible}
            onClose={() => setIsAddTermVisible(false)}
            onAddTerm={(term) => {
              addEntry(term, user?.username || 'Unknown');
              setIsAddTermVisible(false);
              console.log('New term added:', term);
            }}
            isAdmin={isAdmin()}
          />
        )}

        {/* Contribution Bottom Sheet - For Regular Users */}
        {!isAdmin() && (
          <ContributionBottomSheet
            isVisible={isContributionVisible}
            onClose={() => setIsContributionVisible(false)}
            onSubmit={async (contribution) => {
              console.log('New contribution submitted:', contribution);
              const { contributionService } = await import('../services/contributionService');
              const result = await contributionService.saveContribution({
                ...contribution,
                submittedBy: user?.username
              });
              
              if (result.success) {
                Alert.alert('Guul', result.message);
              } else {
                Alert.alert('Khalad', result.message);
              }
              
              setIsContributionVisible(false);
            }}
          />
        )}

        {/* Settings Bottom Sheet */}
        <SettingsBottomSheet
          isVisible={isSettingsVisible}
          onClose={() => setIsSettingsVisible(false)}
          onExport={exportDictionary}
          onImport={importDictionary}
          onClear={clearAllEntries}
          onLogout={logout}
          entriesCount={entries.length}
          currentUser={user ? { username: user.username, role: user.role } : null}
          isAdmin={isAdmin()}
        />

        {/* Category Management Bottom Sheet - Admin Only */}
        {isAdmin() && (
          <CategoryManagement
            isVisible={isCategoryManagementVisible}
            onClose={() => setIsCategoryManagementVisible(false)}
            entries={entries}
          />
        )}

        {/* Admin Panel - Admin Only */}
        {isAdmin() && (
          <AdminPanel
            isVisible={isAdminPanelVisible}
            onClose={() => setIsAdminPanelVisible(false)}
            currentUser={user!}
            entriesCount={entries.length}
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}
