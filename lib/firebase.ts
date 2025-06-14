// Firebase configuration with better error handling
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check if we have all required config
const hasFirebaseConfig = () => {
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

// Mock Google Auth Provider class
export class MockGoogleAuthProvider {
  providerId = "google.com"

  constructor() {
    this.providerId = "google.com"
  }
}

// Enhanced Mock Firebase Auth implementation
export const createMockAuth = () => {
  console.log("🔥 Using Mock Firebase Auth (Demo Mode)")

  return {
    currentUser: null,
    signInWithEmailAndPassword: async (email: string, password: string) => {
      console.log("Mock: Sign in with email/password")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept any email/password
      const user = {
        uid: "demo-user-" + Date.now(),
        email: email,
        displayName: email.split("@")[0],
        emailVerified: true,
      }

      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("mockUser", JSON.stringify(user))
      }

      return { user }
    },
    createUserWithEmailAndPassword: async (email: string, password: string) => {
      console.log("Mock: Create user with email/password")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user = {
        uid: "demo-user-" + Date.now(),
        email: email,
        displayName: email.split("@")[0],
        emailVerified: true,
      }

      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("mockUser", JSON.stringify(user))
      }

      return { user }
    },
    signInWithPopup: async (provider: any) => {
      console.log("Mock: Sign in with Google")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user = {
        uid: "demo-google-user-" + Date.now(),
        email: "demo@gmail.com",
        displayName: "Demo User",
        emailVerified: true,
      }

      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("mockUser", JSON.stringify(user))
      }

      return { user }
    },
    signOut: async () => {
      console.log("Mock: Sign out")
      if (typeof window !== "undefined") {
        localStorage.removeItem("mockUser")
      }
      await new Promise((resolve) => setTimeout(resolve, 500))
      return true
    },
    onAuthStateChanged: (callback: (user: any) => void) => {
      console.log("Mock: Setting up auth state listener")

      // Check for stored user on initialization
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("mockUser")
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser)
            setTimeout(() => callback(user), 100)
          } catch (e) {
            callback(null)
          }
        } else {
          callback(null)
        }
      } else {
        callback(null)
      }

      return () => {} // unsubscribe function
    },
  }
}

// Enhanced Mock Firestore implementation
export const createMockDb = () => {
  console.log("🔥 Using Mock Firestore (Demo Mode)")

  // In-memory storage for demo with some sample data
  const mockData: { [key: string]: any } = {
    "users/demo-user": {
      email: "demo@example.com",
      displayName: "Demo User",
      name: "Demo User",
      createdAt: new Date().toISOString(),
      subscription: { status: "active", plan: "basic" },
      hasSeenWelcome: false,
    },
    "workouts/demo-workout-1": {
      userId: "demo-user",
      name: "Morning Run",
      type: "cardio",
      duration: 30,
      completedAt: { toDate: () => new Date() },
      completed: true,
    },
    "workouts/demo-workout-2": {
      userId: "demo-user",
      name: "Strength Training",
      type: "strength",
      duration: 45,
      completedAt: { toDate: () => new Date(Date.now() - 86400000) },
      completed: true,
    },
    "trainingPlans/demo-plan-1": {
      userId: "demo-user",
      name: "Beginner Fitness Plan",
      type: "general",
      createdAt: new Date().toISOString(),
    },
  }

  return {
    collection: (collectionName: string) => ({
      doc: (docId: string) => ({
        set: async (data: any) => {
          mockData[`${collectionName}/${docId}`] = {
            ...data,
            updatedAt: new Date().toISOString(),
          }
          console.log(`Mock DB: Set document ${collectionName}/${docId}`)
        },
        get: async () => {
          const data = mockData[`${collectionName}/${docId}`]
          return {
            exists: () => !!data,
            data: () => data || null,
            id: docId,
          }
        },
        update: async (updates: any) => {
          if (mockData[`${collectionName}/${docId}`]) {
            mockData[`${collectionName}/${docId}`] = {
              ...mockData[`${collectionName}/${docId}`],
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          }
          console.log(`Mock DB: Updated document ${collectionName}/${docId}`)
        },
      }),
      add: async (data: any) => {
        const docId = "mock-doc-" + Date.now()
        mockData[`${collectionName}/${docId}`] = {
          ...data,
          createdAt: new Date().toISOString(),
        }
        console.log(`Mock DB: Added document to ${collectionName}`)
        return { id: docId }
      },
      where: (field: string, operator: string, value: any) => ({
        orderBy: (orderField: string, direction?: string) => ({
          getDocs: async () => {
            const docs = Object.entries(mockData)
              .filter(([key, data]) => {
                if (!key.startsWith(collectionName + "/")) return false
                // Simple filtering for demo
                if (field === "userId" && operator === "==" && data.userId === value) return true
                return field === "userId" ? data.userId === value : true
              })
              .map(([key, data]) => ({
                id: key.split("/")[1],
                data: () => data,
              }))
            return { docs }
          },
        }),
        getDocs: async () => {
          const docs = Object.entries(mockData)
            .filter(([key, data]) => {
              if (!key.startsWith(collectionName + "/")) return false
              // Simple filtering for demo
              if (field === "userId" && operator === "==" && data.userId === value) return true
              return field === "userId" ? data.userId === value : true
            })
            .map(([key, data]) => ({
              id: key.split("/")[1],
              data: () => data,
            }))
          return { docs, size: docs.length }
        },
      }),
      getDocs: async () => {
        const docs = Object.entries(mockData)
          .filter(([key]) => key.startsWith(collectionName + "/"))
          .map(([key, data]) => ({
            id: key.split("/")[1],
            data: () => data,
          }))
        return { docs, size: docs.length }
      },
    }),
    doc: (collectionName: string, docId: string) => ({
      set: async (data: any) => {
        mockData[`${collectionName}/${docId}`] = {
          ...data,
          updatedAt: new Date().toISOString(),
        }
        console.log(`Mock DB: Set document ${collectionName}/${docId}`)
      },
      get: async () => {
        const data = mockData[`${collectionName}/${docId}`]
        return {
          exists: () => !!data,
          data: () => data || null,
          id: docId,
        }
      },
      update: async (updates: any) => {
        if (mockData[`${collectionName}/${docId}`]) {
          mockData[`${collectionName}/${docId}`] = {
            ...mockData[`${collectionName}/${docId}`],
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        }
        console.log(`Mock DB: Updated document ${collectionName}/${docId}`)
      },
    }),
  }
}

// Main Firebase initialization functions
export const getFirebaseAuth = async () => {
  if (typeof window === "undefined") {
    throw new Error("Auth can only be used on the client side")
  }

  // Always use mock auth for now to avoid configuration issues
  console.log("🔥 Firebase: Using demo authentication")
  return createMockAuth()
}

// FIXED: Export the database initialization function
export const initializeFirebaseForDb = async () => {
  if (typeof window === "undefined") {
    throw new Error("Database can only be used on the client side")
  }

  // Always use mock database for now
  console.log("🔥 Firebase: Using demo database")
  return createMockDb()
}

export const getFirebaseDb = async () => {
  return initializeFirebaseForDb()
}

// Export the mock GoogleAuthProvider class
export const GoogleAuthProvider = MockGoogleAuthProvider

// Utility functions
export const isFirebaseAvailable = () => {
  return hasFirebaseConfig()
}

export const resetFirebase = () => {
  console.log("Firebase reset (demo mode)")
  if (typeof window !== "undefined") {
    localStorage.removeItem("mockUser")
  }
}

// Legacy exports for compatibility
export const auth = null
export const db = null
export const storage = null
