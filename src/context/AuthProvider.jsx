import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase.config';

const provider = new GoogleAuthProvider();
const AuthProvider = ({children}) => {
    const [user,setUser]=useState();
    const [lodaing,setLoading]=useState(true)

    const createUser =(email,password)=>{
        setLoading(true)
        return createUserWithEmailAndPassword(email,password)
    }
    const signIn =(email,password)=>{
        setLoading(true)
        return signInWithEmailAndPassword(auth,email,password)
    }

    const socialLogin =()=>{
        setLoading(true)
       return signInWithPopup(auth, provider)
    }
    const signOutUser =()=>{
        setLoading(true)
        return signOut(auth)
    }

    const updatedProfile =()=>{
        setLoading(true)
       return updateProfile(auth.currentUser)
    }

    useEffect(()=>{
        const unsubscribe =onAuthStateChanged(auth,currentUser=>{
            setUser(currentUser)
            setLoading(false)
        })
        return ()=>{
            unsubscribe()
        }
    },[])

    const userInfo={
        user,
        signIn,
        createUser,
        updatedProfile,
        socialLogin,
        signOutUser,
        lodaing
    }
    return <AuthContext value={userInfo}>
        {children}
    </AuthContext>;
};

export default AuthProvider;