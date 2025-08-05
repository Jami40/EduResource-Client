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
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const provider = new GoogleAuthProvider();

  // Fetch and set user role by email
  const fetchAndSetUserRole = async (email) => {
    try {
      const res = await fetch(`http://localhost:3000/users/${email}`);
      if (res.ok) {
        const userData = await res.json();
        setUserRole(userData.role);
        return userData.role;
      }
    } catch (err) {
      setUserRole(null);
    }
    return null;
  };

  const createUser = (email, password) => {
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password)
  }

  // Save user to server
  const saveUserToServer = async (userData) => {
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      
      if (result.message === 'User already exists') {
        throw new Error('User already exists');
      }
      
      return result;
    } catch (error) {
      console.error('Error saving user to server:', error);
      throw error;
    }
  };

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

      // Save user details to your server
      const userData = {
        uid: result.user.uid,
        email: email,
        displayName: displayName,
        role: role,
        photoURL: finalPhotoURL,
        createdAt: new Date().toISOString()
      };

      await saveUserToServer(userData);
      await fetchAndSetUserRole(email);
      // Don't set loading to false here - let the onAuthStateChanged handle it
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
      
      // Check if user exists in server, if not save them
      try {
        const userData = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          role: 'student', // Default role for Google sign-in
          photoURL: result.user.photoURL,
          createdAt: new Date().toISOString()
        };

        await saveUserToServer(userData);
      } catch (serverError) {
        // If user already exists, that's fine - just continue
        if (serverError.message !== 'User already exists') {
          console.error('Error saving Google user to server:', serverError);
        }
      }
      await fetchAndSetUserRole(result.user.email);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  // Update login to fetch and set user role
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await fetchAndSetUserRole(email);
    return result;
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
    setUserRole(null);
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser);
      if (currentUser?.email) {
        await fetchAndSetUserRole(currentUser.email);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
    }
  }, []);

  const AuthInfo = {
    user,
    userRole,
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