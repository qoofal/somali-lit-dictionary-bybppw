
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import Button from './Button';
import { NewUser, LoginCredentials } from '../types/user';

interface AuthScreenProps {
  onLogin: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string }>;
  onRegister: (userData: NewUser) => Promise<{ success: boolean; message: string }>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
  input: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: 'Inter_400Regular',
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  toggleText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  toggleButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },
  adminNote: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  adminNoteText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
});

export default function AuthScreen({ onLogin, onRegister }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  // Login form state - simplified to only email and password
  const [loginData, setLoginData] = useState<LoginCredentials>({
    username: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState<NewUser & { confirmPassword: string }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async () => {
    if (!loginData.username.trim() || !loginData.password.trim()) {
      Alert.alert('Khalad', 'Fadlan buuxi dhammaan goobaha');
      return;
    }

    setIsLoading(true);
    try {
      const result = await onLogin(loginData);
      if (!result.success) {
        Alert.alert('Khalad', result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Khalad', 'Khalad ayaa dhacay galitaanka');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerData.username.trim() || !registerData.email.trim() || !registerData.password.trim() || !registerData.confirmPassword.trim()) {
      Alert.alert('Khalad', 'Fadlan buuxi dhammaan goobaha');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      Alert.alert('Khalad', 'Lambarka sirta ah iyo xaqiijinta ma isku mid aha');
      return;
    }

    if (registerData.password.length < 6) {
      Alert.alert('Khalad', 'Furaha sirta ah waa inuu ka kooban yahay ugu yaraan 6 xaraf');
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = registerData;
      const result = await onRegister(userData);
      if (result.success) {
        Alert.alert('Guul', result.message);
      } else {
        Alert.alert('Khalad', result.message);
      }
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Khalad', 'Khalad ayaa dhacay diiwaangelinta');
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoginForm = () => (
    <View style={styles.form}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>email</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'email' && styles.inputFocused
          ]}
          placeholder="Gali email-kaaga"
          placeholderTextColor={colors.textSecondary}
          value={loginData.username}
          onChangeText={(text) => setLoginData({ ...loginData, username: text })}
          onFocus={() => setFocusedInput('email')}
          onBlur={() => setFocusedInput(null)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>lambarka sirta ah</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'password' && styles.inputFocused
          ]}
          placeholder="Gali lambarka sirta ah"
          placeholderTextColor={colors.textSecondary}
          value={loginData.password}
          onChangeText={(text) => setLoginData({ ...loginData, password: text })}
          onFocus={() => setFocusedInput('password')}
          onBlur={() => setFocusedInput(null)}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <Button
        text={isLoading ? "Galo..." : "Gal"}
        onPress={handleLogin}
        disabled={isLoading}
        style={{ marginTop: 8 }}
      />
    </View>
  );

  const renderRegisterForm = () => (
    <View style={styles.form}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>magaca oo saddexan</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'reg_username' && styles.inputFocused
          ]}
          placeholder="Dooro magac isticmaalaha"
          placeholderTextColor={colors.textSecondary}
          value={registerData.username}
          onChangeText={(text) => setRegisterData({ ...registerData, username: text })}
          onFocus={() => setFocusedInput('reg_username')}
          onBlur={() => setFocusedInput(null)}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>email</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'email' && styles.inputFocused
          ]}
          placeholder="Gali email-kaaga"
          placeholderTextColor={colors.textSecondary}
          value={registerData.email}
          onChangeText={(text) => setRegisterData({ ...registerData, email: text })}
          onFocus={() => setFocusedInput('email')}
          onBlur={() => setFocusedInput(null)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>lambarka sirta ah</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'reg_password' && styles.inputFocused
          ]}
          placeholder="Samee furaha sirta ah (ugu yaraan 6 xaraf)"
          placeholderTextColor={colors.textSecondary}
          value={registerData.password}
          onChangeText={(text) => setRegisterData({ ...registerData, password: text })}
          onFocus={() => setFocusedInput('reg_password')}
          onBlur={() => setFocusedInput(null)}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>xaqiiji lambarka sirta ah</Text>
        <TextInput
          style={[
            styles.input,
            focusedInput === 'confirm_password' && styles.inputFocused
          ]}
          placeholder="Ku celi lambarka sirta ah"
          placeholderTextColor={colors.textSecondary}
          value={registerData.confirmPassword}
          onChangeText={(text) => setRegisterData({ ...registerData, confirmPassword: text })}
          onFocus={() => setFocusedInput('confirm_password')}
          onBlur={() => setFocusedInput(null)}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <Button
        text={isLoading ? "Diiwaangeli..." : "diiwaangeli"}
        onPress={handleRegister}
        disabled={isLoading}
        style={{ marginTop: 8 }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Icon name="book" size={40} color="white" />
          </View>
          <Text style={styles.title}>Qaamuuska Suugaanta</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Gali akoonkaaga si aad u hesho qaamuuska' : 'is diiwaan gali'}
          </Text>
        </View>

        {isLogin ? renderLoginForm() : renderRegisterForm()}

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>
            {isLogin ? 'Akoon ma lihid?' : 'Akoon ma leedahay?'}
          </Text>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.toggleButton}>
              {isLogin ? 'is diiwaan gali' : 'Gal'}
            </Text>
          </TouchableOpacity>
        </View>

        {isLogin && (
          <View style={styles.adminNote}>
            <Text style={styles.adminNoteText}>
              <Text style={{ fontWeight: '600' }}>Xusuusin:</Text> Admin-ka default-ka ah:{'\n'}
              Email: admin@admin.com{'\n'}
              Lambarka sirta ah: admin123
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
