
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import Button from './Button';
import { NewUser, LoginCredentials } from '../types/user';
import { verificationService } from '../services/verificationService';

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
    backgroundColor: colors.skyBlue,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: 'Inter_400Regular',
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.skyBlue,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: colors.skyBlue,
    borderRadius: 12,
    padding: 16,
    paddingRight: 50,
    fontSize: 16,
    color: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: 'Inter_400Regular',
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  verificationContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  verificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  verificationText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
    fontFamily: 'Inter_400Regular',
  },
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  codeInput: {
    flex: 1,
    backgroundColor: colors.skyBlue,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    color: colors.background,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 2,
  },
  resendButton: {
    alignSelf: 'center',
    marginTop: 8,
  },
  resendButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: 'Inter_500Medium',
    textDecorationLine: 'underline',
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
});

export default function AuthScreen({ onLogin, onRegister }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [pendingUserData, setPendingUserData] = useState<NewUser | null>(null);
  
  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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

    // Check if email is verified (skip for admin accounts)
    if (loginData.username !== 'admin@admin.com' && loginData.username !== 'qoofaljabshe@gmail.com') {
      const isVerified = await verificationService.isEmailVerified(loginData.username);
      if (!isVerified) {
        Alert.alert(
          'Email ma xaqiijin',
          'Fadlan xaqiiji email-kaaga ka hor inta aadan gelin.',
          [
            { text: 'Dib u dir', onPress: () => sendVerificationForLogin() },
            { text: 'Dib u celi', style: 'cancel' }
          ]
        );
        return;
      }
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

  const sendVerificationForLogin = async () => {
    if (!loginData.username.trim()) {
      Alert.alert('Khalad', 'Fadlan gali email-kaaga');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verificationService.sendVerificationCode(loginData.username);
      if (result.success) {
        setVerificationEmail(loginData.username);
        setShowVerification(true);
        Alert.alert('Guul', result.message);
      } else {
        Alert.alert('Khalad', result.message);
      }
    } catch (error) {
      console.error('Error sending verification:', error);
      Alert.alert('Khalad', 'Khalad ayaa dhacay dirista lambarka xaqiijinta');
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      Alert.alert('Khalad', 'Fadlan gali email sax ah');
      return;
    }

    setIsLoading(true);
    try {
      // Send verification code
      const result = await verificationService.sendVerificationCode(registerData.email);
      if (result.success) {
        const { confirmPassword, ...userData } = registerData;
        setPendingUserData(userData);
        setVerificationEmail(registerData.email);
        setShowVerification(true);
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

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Khalad', 'Fadlan gali lambarka xaqiijinta');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verificationService.verifyCode(verificationEmail, verificationCode);
      if (result.success) {
        Alert.alert('Guul', result.message);
        
        // If this was for registration, complete the registration
        if (pendingUserData) {
          const registerResult = await onRegister(pendingUserData);
          if (registerResult.success) {
            Alert.alert('Guul', 'Diiwaangelinta waa guuleysatay! Hadda waad geli kartaa.');
            resetVerificationState();
            setIsLogin(true);
          } else {
            Alert.alert('Khalad', registerResult.message);
          }
        } else {
          // This was for login verification
          resetVerificationState();
        }
      } else {
        Alert.alert('Khalad', result.message);
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Khalad', 'Khalad ayaa dhacay xaqiijinta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const result = await verificationService.sendVerificationCode(verificationEmail);
      if (result.success) {
        Alert.alert('Guul', result.message);
        setVerificationCode('');
      } else {
        Alert.alert('Khalad', result.message);
      }
    } catch (error) {
      console.error('Resend error:', error);
      Alert.alert('Khalad', 'Khalad ayaa dhacay dib u dirista lambarka');
    } finally {
      setIsLoading(false);
    }
  };

  const resetVerificationState = () => {
    setShowVerification(false);
    setVerificationEmail('');
    setVerificationCode('');
    setPendingUserData(null);
  };

  const renderVerificationForm = () => (
    <View style={styles.verificationContainer}>
      <Text style={styles.verificationTitle}>Xaqiiji Email-kaaga</Text>
      <Text style={styles.verificationText}>
        Lambar xaqiijin ah ayaa loo diray {verificationEmail}. Fadlan gali lambarka hoose:
      </Text>
      
      <View style={styles.codeInputContainer}>
        <TextInput
          style={styles.codeInput}
          placeholder="000000"
          placeholderTextColor={colors.grey}
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="numeric"
          maxLength={6}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <Button
        text={isLoading ? "Xaqiijinaya..." : "Xaqiiji"}
        onPress={handleVerifyCode}
        disabled={isLoading}
        style={{ marginBottom: 12 }}
      />

      <TouchableOpacity 
        style={styles.resendButton} 
        onPress={handleResendCode}
        disabled={isLoading}
      >
        <Text style={styles.resendButtonText}>
          Dib u dir lambarka xaqiijinta
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.resendButton, { marginTop: 8 }]} 
        onPress={resetVerificationState}
      >
        <Text style={[styles.resendButtonText, { color: colors.textSecondary }]}>
          Dib u celi
        </Text>
      </TouchableOpacity>
    </View>
  );

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
          placeholderTextColor={colors.grey}
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
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.passwordInput,
              focusedInput === 'password' && styles.inputFocused
            ]}
            placeholder="Gali lambarka sirta ah"
            placeholderTextColor={colors.grey}
            value={loginData.password}
            onChangeText={(text) => setLoginData({ ...loginData, password: text })}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
            secureTextEntry={!showLoginPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowLoginPassword(!showLoginPassword)}
          >
            <Icon 
              name={showLoginPassword ? "eye-off" : "eye"} 
              size={20} 
              color={colors.background} 
            />
          </TouchableOpacity>
        </View>
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
          placeholderTextColor={colors.grey}
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
          placeholderTextColor={colors.grey}
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
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.passwordInput,
              focusedInput === 'reg_password' && styles.inputFocused
            ]}
            placeholder="Samee furaha sirta ah (ugu yaraan 6 xaraf)"
            placeholderTextColor={colors.grey}
            value={registerData.password}
            onChangeText={(text) => setRegisterData({ ...registerData, password: text })}
            onFocus={() => setFocusedInput('reg_password')}
            onBlur={() => setFocusedInput(null)}
            secureTextEntry={!showRegisterPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowRegisterPassword(!showRegisterPassword)}
          >
            <Icon 
              name={showRegisterPassword ? "eye-off" : "eye"} 
              size={20} 
              color={colors.background} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>xaqiiji lambarka sirta ah</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.passwordInput,
              focusedInput === 'confirm_password' && styles.inputFocused
            ]}
            placeholder="Ku celi lambarka sirta ah"
            placeholderTextColor={colors.grey}
            value={registerData.confirmPassword}
            onChangeText={(text) => setRegisterData({ ...registerData, confirmPassword: text })}
            onFocus={() => setFocusedInput('confirm_password')}
            onBlur={() => setFocusedInput(null)}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Icon 
              name={showConfirmPassword ? "eye-off" : "eye"} 
              size={20} 
              color={colors.background} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <Button
        text={isLoading ? "Diiwaangeli..." : "diiwaangeli"}
        onPress={handleRegister}
        disabled={isLoading}
        style={{ marginTop: 8 }}
      />
    </View>
  );

  if (showVerification) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.content} 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logo}>
              <Icon name="mail" size={40} color="white" />
            </View>
            <Text style={styles.title}>Xaqiijinta Email-ka</Text>
            <Text style={styles.subtitle}>
              Fadlan xaqiiji email-kaaga si aad u sii waddo
            </Text>
          </View>

          {renderVerificationForm()}
        </ScrollView>
      </SafeAreaView>
    );
  }

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
      </ScrollView>
    </SafeAreaView>
  );
}
