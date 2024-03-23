import React from 'react'

import { logOut, signInWithGoogle, useAuth } from '../../firebase/firebase-auth'

import './styles.css'

export const LogIn = () => {
    const user = useAuth()
    return (
        <div>
            login: {user?.email}{' '}
            <button onClick={signInWithGoogle}>Logg inn</button>
            <button onClick={logOut}>Log ut</button>
        </div>
    )
}
