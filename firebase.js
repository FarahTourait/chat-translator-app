import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  initializeAuth, 
  getReactNativePersistence,
  signInWithEmailAndPassword
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { signOut } from 'firebase/auth'; // ADD this import
// DEBUG CONFIG - VERIFY THESE VALUES MATCH FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyCiEsmCOkE9EfIxlHK7xbPBv1Oot-VnxUE",
  authDomain: "chat-translator-app-a9371.firebaseapp.com", // Must EXACTLY match authorized domains
  projectId: "chat-translator-app-a9371",
  storageBucket: "chat-translator-app-a9371.appspot.com",
  messagingSenderId: "300335391189",
  appId: "1:300335391189:android:0ec9ca382cfed203619d5c"
};

// SINGLETON INITIALIZATION
let app;
if (getApps().length > 0) {
  app = getApp();
  console.warn("Existing Firebase app detected:", app.name);
} else {
  app = initializeApp(firebaseConfig);
  console.log("New Firebase app initialized:", app.name);
}

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

// DEBUG FUNCTION
export const testAuth = async (email = "test@example.com", password = "test123") => {
  try {
    console.log("Attempting auth with domain:", firebaseConfig.authDomain);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Auth success!", userCredential.user.uid);
    return true;
  } catch (error) {
    console.error(
      "Auth failed:\n",
      `CODE: ${error.code}\n`,
      `MESSAGE: ${error.message}\n`,
      `CONFIG: ${JSON.stringify(firebaseConfig, null, 2)}`
    );
    return false;
  }
};

export { auth, db };