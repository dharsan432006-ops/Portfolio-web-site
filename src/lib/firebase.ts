import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { 
  getFirestore, doc, getDoc, setDoc, collection, 
  getDocs, query, orderBy, deleteDoc, onSnapshot 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Connection Test as per instructions
import { getDocFromServer } from 'firebase/firestore';
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("✅ Firestore Connection Established");
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn("⚠️ Firestore is offline. This may be expected during initial load in some environments.");
    }
  }
}
testConnection();

// Error Handling Helper
export const handleFirestoreError = (error: any, operationType: string, path: string | null = null) => {
  const user = auth.currentUser;
  const errorInfo = {
    error: error.message || 'Unknown error',
    operationType,
    path,
    authInfo: {
      userId: user?.uid || 'anonymous',
      email: user?.email || 'N/A',
      emailVerified: user?.emailVerified || false,
      isAnonymous: user?.isAnonymous ?? true,
      providerInfo: user?.providerData.map(p => ({
        providerId: p.providerId,
        displayName: p.displayName || '',
        email: p.email || ''
      })) || []
    }
  };
  throw new Error(JSON.stringify(errorInfo));
};

// Storage Service
export const uploadImage = async (file: File, folder: string = 'projects') => {
  try {
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const storageRef = ref(storage, `${folder}/${filename}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Storage Error:", error);
    throw error;
  }
};

// Auth Service
export const login = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

// Profile Service
export const subscribeToProfile = (callback: (data: any) => void) => {
  const docRef = doc(db, 'config', 'profile');
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  }, (error) => {
    console.error("Profile Subscription Error:", error);
  });
};

export const getProfile = async () => {
  try {
    const docRef = doc(db, 'config', 'profile');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    handleFirestoreError(error, 'get', 'config/profile');
  }
};

export const updateProfile = async (data: any) => {
  try {
    const docRef = doc(db, 'config', 'profile');
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, 'update', 'config/profile');
  }
};

// Projects Service
export const subscribeToProjects = (callback: (data: any[]) => void) => {
  const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(projs);
  }, (error) => {
    console.error("Projects Subscription Error:", error);
  });
};

export const getProjects = async () => {
  try {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, 'list', 'projects');
  }
};

export const updateProject = async (projectId: string, data: any) => {
  try {
    const docRef = doc(db, 'projects', projectId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, 'update', `projects/${projectId}`);
  }
};

export const createProject = async (data: any) => {
  try {
    const docRef = doc(db, 'projects', data.id);
    await setDoc(docRef, data);
  } catch (error) {
    handleFirestoreError(error, 'create', `projects/${data.id}`);
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    const docRef = doc(db, 'projects', projectId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, 'delete', `projects/${projectId}`);
  }
};
