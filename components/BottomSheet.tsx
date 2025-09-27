
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
} from 'react-native';
import { colors } from '../styles/commonStyles';

interface SimpleBottomSheetProps {
  children?: React.ReactNode;
  isVisible?: boolean;
  onClose?: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SNAP_POINTS = [0, SCREEN_HEIGHT * 0.6, SCREEN_HEIGHT * 0.9];

export default function SimpleBottomSheet({ 
  children, 
  isVisible = false, 
  onClose 
}: SimpleBottomSheetProps) {
  const [visible, setVisible] = useState(isVisible);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      setVisible(true);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: SNAP_POINTS[1],
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
      });
    }
  }, [isVisible, translateY, backdropOpacity]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        const newY = SNAP_POINTS[1] + gestureState.dy;
        if (newY >= SNAP_POINTS[1]) {
          translateY.setValue(newY);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentY = SNAP_POINTS[1] + gestureState.dy;
        const velocityY = gestureState.vy;
        
        if (velocityY > 0.5 || currentY > SCREEN_HEIGHT * 0.75) {
          // Close the bottom sheet
          onClose?.();
        } else {
          // Snap back to position
          Animated.spring(translateY, {
            toValue: SNAP_POINTS[1],
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  const handleBackdropPress = () => {
    onClose?.();
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View 
            style={[
              styles.backdrop,
              { opacity: backdropOpacity }
            ]} 
          />
        </TouchableWithoutFeedback>
        
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />
          <View style={styles.content}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  bottomSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: SCREEN_HEIGHT * 0.6,
    maxHeight: SCREEN_HEIGHT * 0.9,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.textSecondary,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
