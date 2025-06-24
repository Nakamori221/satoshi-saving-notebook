/**
 * Firestore database operations for Satoshi Saving Notebook
 */

import { 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  collection, 
  query, 
  orderBy, 
  limit, 
  where,
  getDocs,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  UserProfile, 
  UserGoal, 
  ReminderSettings, 
  LineToken, 
  BtcPriceCache, 
  ProgressEntry, 
  FeedbackExit 
} from '@/types';

/**
 * User Profile Operations
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, 'users', uid, 'profile', 'data');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function saveUserProfile(uid: string, profile: Partial<UserProfile>): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid, 'profile', 'data');
    await setDoc(docRef, {
      ...profile,
      updatedAt: serverTimestamp(),
      createdAt: profile.createdAt || serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
}

/**
 * User Goal Operations
 */
export async function getUserGoal(uid: string): Promise<UserGoal | null> {
  try {
    const docRef = doc(db, 'users', uid, 'goal', 'data');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        deadline: data.deadline?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserGoal;
    }
    return null;
  } catch (error) {
    console.error('Error getting user goal:', error);
    return null;
  }
}

export async function saveUserGoal(uid: string, goal: Partial<UserGoal>): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid, 'goal', 'data');
    await setDoc(docRef, {
      ...goal,
      deadline: goal.deadline ? Timestamp.fromDate(goal.deadline) : null,
      updatedAt: serverTimestamp(),
      createdAt: goal.createdAt || serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user goal:', error);
    throw error;
  }
}

/**
 * Progress Entry Operations
 */
export async function addProgressEntry(uid: string, entry: Omit<ProgressEntry, 'createdAt'>): Promise<string> {
  try {
    const collectionRef = collection(db, 'progress', uid, 'entries');
    const docRef = await addDoc(collectionRef, {
      ...entry,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding progress entry:', error);
    throw error;
  }
}

export async function getRecentProgressEntries(uid: string, limitCount: number = 10): Promise<ProgressEntry[]> {
  try {
    const collectionRef = collection(db, 'progress', uid, 'entries');
    const q = query(collectionRef, orderBy('createdAt', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as ProgressEntry[];
  } catch (error) {
    console.error('Error getting progress entries:', error);
    return [];
  }
}

export async function getProgressEntriesByMonth(uid: string, year: number, month: number): Promise<ProgressEntry[]> {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const collectionRef = collection(db, 'progress', uid, 'entries');
    const q = query(
      collectionRef, 
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      where('createdAt', '<=', Timestamp.fromDate(endDate)),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as ProgressEntry[];
  } catch (error) {
    console.error('Error getting monthly progress entries:', error);
    return [];
  }
}

/**
 * BTC Price Cache Operations
 */
export async function cacheBtcPrice(uid: string, price: number): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid, 'cache', 'btcPrice');
    await setDoc(docRef, {
      dateISO: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      priceJpy: price,
      cachedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error caching BTC price:', error);
  }
}

export async function getCachedBtcPrice(uid: string): Promise<BtcPriceCache | null> {
  try {
    const docRef = doc(db, 'users', uid, 'cache', 'btcPrice');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        cachedAt: data.cachedAt?.toDate() || new Date(),
      } as BtcPriceCache;
    }
    return null;
  } catch (error) {
    console.error('Error getting cached BTC price:', error);
    return null;
  }
}

/**
 * Reminder Settings Operations
 */
export async function getReminderSettings(uid: string): Promise<ReminderSettings | null> {
  try {
    const docRef = doc(db, 'users', uid, 'reminderSettings', 'data');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as ReminderSettings;
    }
    return null;
  } catch (error) {
    console.error('Error getting reminder settings:', error);
    return null;
  }
}

export async function saveReminderSettings(uid: string, settings: Partial<ReminderSettings>): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid, 'reminderSettings', 'data');
    await setDoc(docRef, {
      ...settings,
      updatedAt: serverTimestamp(),
      createdAt: settings.createdAt || serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error saving reminder settings:', error);
    throw error;
  }
}

/**
 * LINE Token Operations
 */
export async function saveLineToken(uid: string, token: string, expiresAt: Date): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid, 'lineToken', 'data');
    await setDoc(docRef, {
      token,
      expiresAt: Timestamp.fromDate(expiresAt),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving LINE token:', error);
    throw error;
  }
}

export async function getLineToken(uid: string): Promise<LineToken | null> {
  try {
    const docRef = doc(db, 'users', uid, 'lineToken', 'data');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        expiresAt: data.expiresAt?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as LineToken;
    }
    return null;
  } catch (error) {
    console.error('Error getting LINE token:', error);
    return null;
  }
}

/**
 * Utility Functions
 */
export async function calculateCurrentBtc(uid: string): Promise<number> {
  try {
    const goal = await getUserGoal(uid);
    const entries = await getRecentProgressEntries(uid, 1000); // Get all entries
    
    const startBtc = goal?.startBtc || 0;
    const totalDeposits = entries.reduce((sum, entry) => sum + entry.depositJpy, 0);
    
    // Calculate average price from entries
    const totalBtcPurchased = entries.reduce((sum, entry) => {
      return sum + (entry.depositJpy / entry.btcPrice);
    }, 0);
    
    return startBtc + totalBtcPurchased;
  } catch (error) {
    console.error('Error calculating current BTC:', error);
    return 0;
  }
}

/**
 * Initialize default user data
 */
export async function initializeUserData(uid: string, email: string): Promise<void> {
  try {
    // Check if profile already exists
    const existingProfile = await getUserProfile(uid);
    if (existingProfile) return;
    
    // Create default profile
    await saveUserProfile(uid, {
      displayName: email.split('@')[0],
      fontScale: 1,
      currency: 'JPY',
      salaryDay: 25,
    });
    
    // Create default goal
    const fiveYearsFromNow = new Date();
    fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);
    
    await saveUserGoal(uid, {
      targetBtc: 0.1,
      deadline: fiveYearsFromNow,
      startBtc: 0,
    });
    
    // Create default reminder settings
    await saveReminderSettings(uid, {
      baseDates: [1, 25],
      delayAlert: true,
      delayThreshold: 50,
    });
    
    console.log('✅ User data initialized for:', email);
  } catch (error) {
    console.error('Error initializing user data:', error);
    throw error;
  }
}