
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
          <Icon name="hand-right-outline" size={24} color={colors.text} />
        </View>
        <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
          <Icon name="close" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.title}>Soo dhawoow!</Text>
      <Text style={styles.description}>
        Ku soo dhowoow Qaamuuska suugaanta Soomaaliyeed, halkaan waxaad ka heleysaa erey bixinta dhammaan suugaanta Afka Soomaaliga
      </Text>
      
      <View style={styles.features}>
        <View style={styles.feature}>
          <Icon name="search-outline" size={16} color={colors.text} />
          <Text style={styles.featureText}>Raadi erayo</Text>
        </View>
        <View style={styles.feature}>
          <Icon name="add-circle-outline" size={16} color={colors.text} />
          <Text style={styles.featureText}>Ku dar erayo cusub</Text>
        </View>
        <View style={styles.feature}>
          <Icon name="bookmark-outline" size={16} color={colors.text} />
          <Text style={styles.featureText}>Kaydi erayo muhiim ah</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary + '50',
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
    backgroundColor: colors.primary + '25',
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
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.2,
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
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
});

export default WelcomeCard;
