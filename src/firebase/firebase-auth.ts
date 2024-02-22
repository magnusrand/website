/* eslint-disable no-console */
import { useEffect, useState } from 'react'

import {
    GoogleAuthProvider,
    OAuthCredential,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from 'firebase/auth'

import type { User } from 'firebase/auth'

import { auth, provider } from './firebase-init'

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


// export const oauth2Client = new google.auth.OAuth2(
//     OAuthCredential YOUR_CLIENT_ID,
//     YOUR_CLIENT_SECRET,
//     YOUR_REDIRECT_URL
//   );