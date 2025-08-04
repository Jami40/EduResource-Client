import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const provider = new GoogleAuthProvider();

  const createUser = (email, password) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const signup = async (email, password, displayName, role, photoURL = null) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Use provided photoURL or generate default avatar
      const finalPhotoURL = photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;
      
      await updateProfile(result.user, { 
        displayName,
        photoURL: finalPhotoURL
      });
      
      // The user state will be automatically updated by the onAuthStateChanged listener
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      // The user state will be automatically updated by the onAuthStateChanged listener
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const manageProfile = (name, image) => {
    setLoading(false)
    return updateProfile(auth.currentUser, {
      displayName: name, 
      photoURL: image
    })
  }

  const signOutUser = () => {
    setLoading(true)
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => {
      unsubscribe();
    }
  }, [])

  const AuthInfo = {
    user,
    loading,  
    createUser,
    signup,
    googleSignIn,
    manageProfile,
    login,
    signOutUser
  };

  return (
    <AuthContext.Provider value={AuthInfo}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 