import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, orderBy, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);
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
      isAnonymous: user?.isAnonymous || true,
      providerInfo: user?.providerData.map(p => ({
        providerId: p.providerId,
        displayName: p.displayName || '',
        email: p.email || ''
      })) || []
    }
  };
  throw new Error(JSON.stringify(errorInfo));
};

// Auth Service
export const login = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

// Profile Service
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
