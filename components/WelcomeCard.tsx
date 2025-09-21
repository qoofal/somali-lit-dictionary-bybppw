
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface WelcomeCardProps {
  onDismiss: () => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View style={[commonStyles.card, styles.container]}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="hand-right-outline" size={24} color={colors.primary} />
        </View>
        <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
          <Icon name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.title}>Soo dhawoow!</Text>
      <Text style={styles.description}>
        Waxaad ku soo dhaweysantahay Qaamuuska Suugaanta Soomaaliyeed. 
        Halkan waxaad ka heli kartaa erayo muhiim ah oo ku saabsan suugaanta Soomaaliyeed.
      </Text>
      
      <View style={styles.features}>
        <View style={styles.feature}>
          <Icon name="search-outline" size={16} color={colors.primary} />
          <Text style={styles.featureText}>Raadi erayo</Text>
        </View>
        <View style={styles.feature}>
          <Icon name="add-circle-outline" size={16} color={colors.primary} />
          <Text style={styles.featureText}>Ku dar erayo cusub</Text>
        </View>
        <View style={styles.feature}>
          <Icon name="bookmark-outline" size={16} color={colors.primary} />
          <Text style={styles.featureText}>Kaydi erayo muhiim ah</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: colors.primary + '08',
    borderColor: colors.primary + '30',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  features: {
    gap: 8,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
});

export default WelcomeCard;
