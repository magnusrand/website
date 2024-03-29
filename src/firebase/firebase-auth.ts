/* eslint-disable no-console */
import { useEffect, useState } from 'react'

import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from 'firebase/auth'

import type { User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import { auth, db, provider } from './firebase-init'

export const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential?.accessToken
            // The signed-in user info.
            const user = result.user
            // ...
            console.log('Succ:', credential, token, user)
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code
            const errorMessage = error.message
            // The email of the user's account used.
            const email = error.customData.email
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error)
            // ...
            console.log('Fail:', credential, errorCode, errorMessage, email)
        })
}

export const logOut = () => signOut(auth)

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState<User | null>()

    useEffect(
        () => onAuthStateChanged(auth, (user) => setCurrentUser(user)),
        [],
    )

    return currentUser
}

export const isAdmin = async (userUID: string | undefined) => {
    if (userUID === undefined) return false

    const docRef = doc(db, 'admins', userUID)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        return true
    }
    return false
}
