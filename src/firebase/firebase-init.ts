import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: 'AIzaSyCNunJy-lSja8KBdfmHejyITir4e_qO7es',
    authDomain: 'magnusrand-911ec.firebaseapp.com',
    projectId: 'magnusrand-911ec',
    storageBucket: 'magnusrand-911ec.appspot.com',
    messagingSenderId: '516297674542',
    appId: '1:516297674542:web:ecd51b9e9b2d19da49b4bf',
    measurementId: 'G-F342E12DWZ',
}

// const emulatorConfig = {}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
auth.useDeviceLanguage()
export const provider = new GoogleAuthProvider()
if (location.hostname === 'localhost') {
    connectFirestoreEmulator(db, 'localhost', 8081)
}
