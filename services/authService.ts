
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, NewUser, LoginCredentials } from '../types/user';
import { verificationService } from './verificationService';

const USERS_STORAGE_KEY = 'somali_dictionary_users';
const CURRENT_USER_KEY = 'somali_dictionary_current_user';

// Default admin users
const DEFAULT_ADMIN: User = {
  id: 'admin_001',
  username: 'admin',
  email: 'admin@admin.com',
  role: 'admin',
  dateCreated: new Date('2024-01-01'),
  lastLogin: new Date()
};

const NEW_ADMIN: User = {
  id: 'admin_002',
  username: 'qoofal_admin',
  email: 'qoofaljabshe@gmail.com',
  role: 'admin',
  dateCreated: new Date('2024-01-01'),
  lastLogin: new Date()
};

// Simple password hashing (in production, use proper hashing)
const hashPassword = (password: string): string => {
  // This is a simple hash for demo purposes - use proper hashing in production
  return btoa(password + 'somali_dictionary_salt');
};

const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};

export const authService = {
  async initializeAuth(): Promise<void> {
    try {
      const users = await this.loadUsers();
      if (users.length === 0) {
        // Create default admin users
        const adminWithPassword = {
          ...DEFAULT_ADMIN,
          password: hashPassword('admin123') // Default admin password
        };

        const newAdminWithPassword = {
          ...NEW_ADMIN,
          password: hashPassword('Qoofal123') // New admin password
        };
        
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([adminWithPassword, newAdminWithPassword]));
        
        // Mark admin emails as verified by default
        await verificationService.markEmailAsVerified(DEFAULT_ADMIN.email);
        await verificationService.markEmailAsVerified(NEW_ADMIN.email);
        
        console.log('Default admin users created:');
        console.log('1. Email: admin@admin.com, Password: admin123');
        console.log('2. Email: qoofaljabshe@gmail.com, Password: Qoofal123');
      } else {
        // Check if new admin exists, if not add it
        const existingNewAdmin = users.find(u => u.email === NEW_ADMIN.email);
        if (!existingNewAdmin) {
          const newAdminWithPassword = {
            ...NEW_ADMIN,
            password: hashPassword('Qoofal123')
          };
          users.push(newAdminWithPassword);
          await this.saveUsers(users);
          await verificationService.markEmailAsVerified(NEW_ADMIN.email);
          console.log('New admin account added: qoofaljabshe@gmail.com');
        }
      }
      
      // Clean up expired verification codes on startup
      await verificationService.cleanupExpiredCodes();
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  },

  async loadUsers(): Promise<any[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (jsonValue != null) {
        return JSON.parse(jsonValue);
      }
      return [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  },

  async saveUsers(users: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  },

  async register(userData: NewUser): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const users = await this.loadUsers();
      
      // Check if username already exists
      const existingUser = users.find(u => u.username === userData.username || u.email === userData.email);
      if (existingUser) {
        return { success: false, message: 'Magaca isticmaalaha ama email-ka ayaa horay loo isticmaalay' };
      }

      // Check if email is verified (this should be called after verification)
      const isEmailVerified = await verificationService.isEmailVerified(userData.email);
      if (!isEmailVerified) {
        return { success: false, message: 'Email-ka waa in la xaqiijiyaa ka hor inta aan diiwaangelinta la dhammaysan' };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        role: 'user', // New users are regular users by default
        dateCreated: new Date(),
      };

      const userWithPassword = {
        ...newUser,
        password: hashPassword(userData.password)
      };

      users.push(userWithPassword);
      await this.saveUsers(users);

      console.log('New user registered:', newUser.username);
      return { success: true, message: 'Diiwaangelinta waa guuleysatay', user: newUser };
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, message: 'Khalad ayaa dhacay diiwaangelinta' };
    }
  },

  async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const users = await this.loadUsers();
      // Support both email and username login
      const userWithPassword = users.find(u => 
        u.username === credentials.username || u.email === credentials.username
      );

      if (!userWithPassword) {
        return { success: false, message: 'Email-ka ama lambarka sirta ah waa khalad' };
      }

      if (!verifyPassword(credentials.password, userWithPassword.password)) {
        return { success: false, message: 'Email-ka ama lambarka sirta ah waa khalad' };
      }

      // Update last login
      const user: User = {
        id: userWithPassword.id,
        username: userWithPassword.username,
        email: userWithPassword.email,
        role: userWithPassword.role,
        dateCreated: new Date(userWithPassword.dateCreated),
        lastLogin: new Date()
      };

      // Update user in storage
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, lastLogin: user.lastLogin } : u
      );
      await this.saveUsers(updatedUsers);

      // Save current user
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

      console.log('User logged in:', user.username);
      return { success: true, message: 'Galitaanka waa guuleysatay', user };
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, message: 'Khalad ayaa dhacay galitaanka' };
    }
  },

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      console.log('User logged out');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (jsonValue != null) {
        const user = JSON.parse(jsonValue);
        return {
          ...user,
          dateCreated: new Date(user.dateCreated),
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async isUserAdmin(user: User | null): Promise<boolean> {
    return user?.role === 'admin';
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.loadUsers();
      return users.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        dateCreated: new Date(u.dateCreated),
        lastLogin: u.lastLogin ? new Date(u.lastLogin) : undefined
      }));
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  },

  async promoteToAdmin(userId: string): Promise<boolean> {
    try {
      const users = await this.loadUsers();
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, role: 'admin' } : u
      );
      await this.saveUsers(updatedUsers);
      console.log('User promoted to admin:', userId);
      return true;
    } catch (error) {
      console.error('Error promoting user to admin:', error);
      return false;
    }
  }
};
