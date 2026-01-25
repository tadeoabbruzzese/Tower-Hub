import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function createUserIfNotExists(user) {
  if (!user) return

  const userRef = doc(db, "users", user.uid)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    // Usuario nuevo
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: "executor", // default
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    })
  } else {
    // Usuario existente → solo actualizamos lastLogin
    await setDoc(
      userRef,
      {
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    )
  }
}
