import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function createUserIfNotExists(user) {
  if (!user) return

  try {
    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: "executor",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      })
      return
    }

    const currentData = userSnap.data()
    await setDoc(
      userRef,
      {
        email: user.email ?? currentData.email ?? null,
        displayName: user.displayName ?? currentData.displayName ?? null,
        photoURL: user.photoURL ?? currentData.photoURL ?? null,
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    )
  } catch (error) {
    console.error("Error creating/updating user document:", error)
  }
}
