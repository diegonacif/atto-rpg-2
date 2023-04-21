import { createContext, useEffect, useState, ReactNode } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, getAuth } from 'firebase/auth'
import { auth } from '../services/firebase-config';
import { collection, getDocs, setDoc, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useSessionStorage } from 'usehooks-ts'
// import { UserDataContext } from "./UserDataProvider";

interface AuthContextProps {
  handleGoogleSignIn: () => void;
  handleGoogleSignOut: () => void;
  isSignedIn: boolean;
  isLoading: boolean;
  signed: boolean;
}

const provider = new GoogleAuthProvider();

export const AuthGoogleContext = createContext<AuthContextProps>({
  handleGoogleSignIn: () => {},
  handleGoogleSignOut: () => {},
  isSignedIn: false,
  isLoading: false,
  signed: false,
});

export const AuthGoogleProvider = ({ children }: { children: ReactNode }) => {
  const [userCredential , setUserCredential] = useState();
  const [user, setUser] = useState({});
  const [users, setUsers] = useState({});
  const [userId, setUserId] = useState("");
  const [userPhotoUrl, setUserPhotoUrl] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // const usersCollectionRef = collection(db, "users");
  
  const [userState, loading, error] = useAuthState(auth);

  onAuthStateChanged(auth, (currentUser) => {
    if (loading) {
      // console.log("loading user state")
      setIsLoading(true);
    } else {
      setUser(() => currentUser);
      setIsSignedIn(!!currentUser);
      // setUserId(userState?.uid);
      setIsLoading(false);
    }
  })
  
  async function handleGoogleSignIn() {
    await signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      console.log(credential)
      const user = result.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
  }

  function handleGoogleSignOut() {
    sessionStorage.clear();
    signOut(auth).then(() => console.log("sign out sucessfully"));
  }

  // Current user Photo URL
  // useEffect(() => {
  //   setUserPhotoUrl(user?.photoURL);
  // }, [user])

  return (
    <AuthGoogleContext.Provider value={{ 
      handleGoogleSignIn, 
      handleGoogleSignOut,
      isLoading,
      isSignedIn,
      signed: !!user, 
    }}>
      {children}
    </AuthGoogleContext.Provider>
  )
}