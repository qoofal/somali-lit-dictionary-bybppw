
import AsyncStorage from '@react-native-async-storage/async-storage';

const VERIFICATION_CODES_KEY = 'somali_dictionary_verification_codes';
const VERIFIED_EMAILS_KEY = 'somali_dictionary_verified_emails';

interface VerificationCode {
  email: string;
  code: string;
  expiresAt: Date;
  attempts: number;
}

// Generate a 6-digit verification code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Simulate sending email (in production, use a real email service)
const simulateEmailSend = (email: string, code: string): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log(`📧 Verification email sent to ${email} with code: ${code}`);
    // Simulate network delay
    setTimeout(() => resolve(true), 1000);
  });
};

export const verificationService = {
  async sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      
      // Store verification code
      const verificationCodes = await this.loadVerificationCodes();
      const existingCodeIndex = verificationCodes.findIndex(vc => vc.email === email);
      
      const newVerificationCode: VerificationCode = {
        email,
        code,
        expiresAt,
        attempts: 0
      };

      if (existingCodeIndex >= 0) {
        verificationCodes[existingCodeIndex] = newVerificationCode;
      } else {
        verificationCodes.push(newVerificationCode);
      }

      await AsyncStorage.setItem(VERIFICATION_CODES_KEY, JSON.stringify(verificationCodes));

      // Simulate sending email
      const emailSent = await simulateEmailSend(email, code);
      
      if (emailSent) {
        return { 
          success: true, 
          message: `Lambarka xaqiijinta ayaa loo diray ${email}. Fadlan eeg email-kaaga.` 
        };
      } else {
        return { 
          success: false, 
          message: 'Khalad ayaa dhacay dirista email-ka xaqiijinta' 
        };
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      return { 
        success: false, 
        message: 'Khalad ayaa dhacay dirista lambarka xaqiijinta' 
      };
    }
  },

  async verifyCode(email: string, inputCode: string): Promise<{ success: boolean; message: string }> {
    try {
      const verificationCodes = await this.loadVerificationCodes();
      const verificationCodeIndex = verificationCodes.findIndex(vc => vc.email === email);
      
      if (verificationCodeIndex === -1) {
        return { 
          success: false, 
          message: 'Lambar xaqiijin lama helin. Fadlan dib u codso.' 
        };
      }

      const verificationCode = verificationCodes[verificationCodeIndex];
      
      // Check if code has expired
      if (new Date() > new Date(verificationCode.expiresAt)) {
        // Remove expired code
        verificationCodes.splice(verificationCodeIndex, 1);
        await AsyncStorage.setItem(VERIFICATION_CODES_KEY, JSON.stringify(verificationCodes));
        return { 
          success: false, 
          message: 'Lambarka xaqiijinta wuu dhacay. Fadlan mid cusub codso.' 
        };
      }

      // Check attempts limit
      if (verificationCode.attempts >= 3) {
        return { 
          success: false, 
          message: 'Tijaabooyin badan ayaad samaysay. Fadlan mid cusub codso.' 
        };
      }

      // Verify code
      if (verificationCode.code === inputCode) {
        // Mark email as verified
        await this.markEmailAsVerified(email);
        
        // Remove verification code
        verificationCodes.splice(verificationCodeIndex, 1);
        await AsyncStorage.setItem(VERIFICATION_CODES_KEY, JSON.stringify(verificationCodes));
        
        return { 
          success: true, 
          message: 'Email-ka si guul leh ayaa loo xaqiijiyay!' 
        };
      } else {
        // Increment attempts
        verificationCode.attempts += 1;
        verificationCodes[verificationCodeIndex] = verificationCode;
        await AsyncStorage.setItem(VERIFICATION_CODES_KEY, JSON.stringify(verificationCodes));
        
        const remainingAttempts = 3 - verificationCode.attempts;
        return { 
          success: false, 
          message: `Lambarka xaqiijinta waa khalad. ${remainingAttempts} jeer ayaad ku hadhay.` 
        };
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      return { 
        success: false, 
        message: 'Khalad ayaa dhacay xaqiijinta lambarka' 
      };
    }
  },

  async isEmailVerified(email: string): Promise<boolean> {
    try {
      const verifiedEmails = await this.loadVerifiedEmails();
      return verifiedEmails.includes(email);
    } catch (error) {
      console.error('Error checking email verification:', error);
      return false;
    }
  },

  async markEmailAsVerified(email: string): Promise<void> {
    try {
      const verifiedEmails = await this.loadVerifiedEmails();
      if (!verifiedEmails.includes(email)) {
        verifiedEmails.push(email);
        await AsyncStorage.setItem(VERIFIED_EMAILS_KEY, JSON.stringify(verifiedEmails));
      }
    } catch (error) {
      console.error('Error marking email as verified:', error);
    }
  },

  async loadVerificationCodes(): Promise<VerificationCode[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(VERIFICATION_CODES_KEY);
      if (jsonValue != null) {
        const codes = JSON.parse(jsonValue);
        return codes.map((code: any) => ({
          ...code,
          expiresAt: new Date(code.expiresAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading verification codes:', error);
      return [];
    }
  },

  async loadVerifiedEmails(): Promise<string[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(VERIFIED_EMAILS_KEY);
      if (jsonValue != null) {
        return JSON.parse(jsonValue);
      }
      return [];
    } catch (error) {
      console.error('Error loading verified emails:', error);
      return [];
    }
  },

  async cleanupExpiredCodes(): Promise<void> {
    try {
      const verificationCodes = await this.loadVerificationCodes();
      const now = new Date();
      const validCodes = verificationCodes.filter(vc => new Date(vc.expiresAt) > now);
      await AsyncStorage.setItem(VERIFICATION_CODES_KEY, JSON.stringify(validCodes));
    } catch (error) {
      console.error('Error cleaning up expired codes:', error);
    }
  }
};
