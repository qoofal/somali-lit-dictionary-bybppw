
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, NewUser, LoginCredentials } from '../types/user';

const USERS_STORAGE_KEY = 'somali_dictionary_users';
const CURRENT_USER_KEY = 'somali_dictionary_current_user';

// Default admin user
const DEFAULT_ADMIN: User = {
  id: 'admin_001',
  username: 'admin',
  email: 'admin@admin.com',
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
        // Create default admin user
        const adminWithPassword = {
          ...DEFAULT_ADMIN,
          password: hashPassword('admin123') // Default admin password
        };
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([adminWithPassword]));
        console.log('Default admin user created with email: admin@admin.com, password: admin123');
      }
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
