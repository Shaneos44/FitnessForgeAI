import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase app
export const firebaseApp: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Client-side Firestore initialization
export const getFirebaseDb = async () => {
  if (typeof window === "undefined") {
    // Server-side: use admin SDK or return null
    console.warn("Attempting to use client Firestore on server side")
    return null
  }

  try {
    const { getFirestore } = await import("firebase/firestore")
    return getFirestore(firebaseApp)
  } catch (error) {
    console.error("Error initializing Firestore:", error)
    return null
  }
}

// Server-side Firestore initialization for API routes
export const getServerFirestore = async () => {
  try {
    // Use Firebase Admin SDK for server-side operations
    const admin = await import("firebase-admin")

    if (!admin.apps.length) {
      // Initialize with service account or default credentials
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        // Add other admin config if needed
      })
    }

    return admin.firestore()
  } catch (error) {
    console.error("Error initializing server Firestore:", error)
    // Fallback to mock data for development
    return null
  }
}

// Export Firestore types for convenience
export { Timestamp, FieldValue } from "firebase/firestore"

// Utility to check if config is present
export const isFirebaseAvailable = () => {
  const required = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ]
  const missing = required.filter((key) => !process.env[key])
  if (missing.length > 0) {
    console.warn("Missing Firebase environment variables:", missing)
    return false
  }
  return true
}
