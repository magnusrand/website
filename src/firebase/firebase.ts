import { collection, getDoc } from '@firebase/firestore'
import { doc } from 'firebase/firestore'

import { db } from './firebase-init'

export const getPhoto = async (): Promise<string> => {
    const photoDoc = await getDoc(
        doc(
            collection(db, 'album', 'YHkzx1CvWeINqrBAupGl', 'photos'),
            'YLS2GFXolGpNW4tKbbxG',
        ),
    )
    const photoLink = photoDoc.data()?.link
    return photoLink ?? ''
}
