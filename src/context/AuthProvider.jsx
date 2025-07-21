import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

const provider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [lodaing, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const socialLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };
  const signOutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateProfileUser = (profileInfo) => {
    return updateProfile(auth.currentUser, profileInfo);
  };

  const resetPass=(email)=>{
    return sendPasswordResetEmail(auth,email)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const userInfo = {
    user,
    signIn,
    createUser,
    updateProfileUser,
    socialLogin,
    signOutUser,
    lodaing,
    resetPass
  };
  return <AuthContext value={userInfo}>{children}</AuthContext>;
};

export default AuthProvider;
