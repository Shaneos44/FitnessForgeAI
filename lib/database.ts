// Database functions that work with mock Firebase

export const createUserProfile = async (userId: string, profileData: any) => {
  try {
    const { initializeFirebaseForDb } = await import("@/lib/firebase")
    const db = await initializeFirebaseForDb()

    // Mock Timestamp for demo
    const Timestamp = {
      now: () => new Date(),
    }

    // Use the mock db structure
    await db.doc("users", userId).set({
      ...profileData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

export const getUserProfile = async (userId: string) => {
  try {
    const { initializeFirebaseForDb } = await import("@/lib/firebase")
    const db = await initializeFirebaseForDb()

    // For demo, always return demo user data if userId contains "demo"
    if (userId.includes("demo") || userId.includes("google")) {
      return {
        email: "demo@example.com",
        displayName: "Demo User",
        name: "Demo User",
        createdAt: new Date().toISOString(),
        subscription: { status: "active", plan: "basic" },
        hasSeenWelcome: false,
      }
    }

    const docSnap = await db.doc("users", userId).get()

    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      // Return default profile for new users
      return {
        email: "user@example.com",
        displayName: "New User",
        name: "New User",
        createdAt: new Date().toISOString(),
        subscription: { status: "trial", plan: "basic" },
        hasSeenWelcome: false,
      }
    }
  } catch (error) {
    console.error("Error getting user profile:", error)
    // Return fallback data instead of throwing
    return {
      email: "demo@example.com",
      displayName: "Demo User",
      name: "Demo User",
      createdAt: new Date().toISOString(),
      subscription: { status: "active", plan: "basic" },
      hasSeenWelcome: false,
    }
  }
}

export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    const { initializeFirebaseForDb } = await import("@/lib/firebase")
    const db = await initializeFirebaseForDb()

    const Timestamp = {
      now: () => new Date(),
    }

    await db.doc("users", userId).update({
      ...updates,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    // Don't throw error for demo
  }
}

// Training Plan Functions
export const createTrainingPlan = async (userId: string, planData: any) => {
  try {
    const { initializeFirebaseForDb } = await import("@/lib/firebase")
    const db = await initializeFirebaseForDb()

    const Timestamp = {
      now: () => new Date(),
    }

    const docRef = await db.collection("trainingPlans").add({
      userId,
      ...planData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating training plan:", error)
    return "demo-plan-" + Date.now()
  }
}

export const getUserTrainingPlans = async (userId: string) => {
  try {
    const { initializeFirebaseForDb } = await import("@/lib/firebase")
    const db = await initializeFirebaseForDb()

    const querySnapshot = await db.collection("trainingPlans").where("userId", "==", userId).getDocs()
    return querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting training plans:", error)
    // Return demo data
    return [
      {
        id: "demo-plan-1",
        name: "Beginner Fitness Plan",
        type: "general",
        createdAt: new Date().toISOString(),
      },
    ]
  }
}

// Workout Functions
export const logWorkout = async (userId: string, workoutData: any) => {
  try {
    const { initializeFirebaseForDb } = await import("@/lib/firebase")
    const db = await initializeFirebaseForDb()

    const Timestamp = {
      now: () => new Date(),
    }

    const docRef = await db.collection("workouts").add({
      userId,
      ...workoutData,
      completedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error logging workout:", error)
    return "demo-workout-" + Date.now()
  }
}

export const getUserWorkouts = async (userId: string, limit = 10) => {
  try {
    const { initializeFirebaseForDb } = await import("@/lib/firebase")
    const db = await initializeFirebaseForDb()

    const querySnapshot = await db.collection("workouts").where("userId", "==", userId).getDocs()
    const workouts = querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // If no workouts found, return demo data
    if (workouts.length === 0) {
      return [
        {
          id: "demo-workout-1",
          name: "Morning Run",
          type: "cardio",
          duration: "30 min",
          completedAt: { toDate: () => new Date() },
          completed: true,
        },
        {
          id: "demo-workout-2",
          name: "Strength Training",
          type: "strength",
          duration: "45 min",
          completedAt: { toDate: () => new Date(Date.now() - 86400000) },
          completed: true,
        },
      ]
    }

    return workouts
  } catch (error) {
    console.error("Error getting workouts:", error)
    // Return demo data on error
    return [
      {
        id: "demo-workout-1",
        name: "Morning Run",
        type: "cardio",
        duration: "30 min",
        completedAt: { toDate: () => new Date() },
        completed: true,
      },
    ]
  }
}

// Subscription Functions
export const updateUserSubscription = async (userId: string, subscriptionData: any) => {
  try {
    const { initializeFirebaseForDb } = await import("@/lib/firebase")
    const db = await initializeFirebaseForDb()

    const Timestamp = {
      now: () => new Date(),
    }

    await db.doc("users", userId).update({
      subscription: {
        ...subscriptionData,
        updatedAt: Timestamp.now(),
      },
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error updating user subscription:", error)
    // Don't throw error for demo
  }
}

export const getUserSubscription = async (userId: string) => {
  try {
    const { initializeFirebaseForDb } = await import("@/lib/firebase")
    const db = await initializeFirebaseForDb()

    const docSnap = await db.doc("users", userId).get()

    if (docSnap.exists()) {
      const userProfile = docSnap.data()
      return userProfile?.subscription || { status: "trial", plan: "basic" }
    } else {
      return { status: "trial", plan: "basic" }
    }
  } catch (error) {
    console.error("Error getting user subscription:", error)
    return { status: "trial", plan: "basic" }
  }
}

// Analytics Functions
export const getUserStats = async (userId: string) => {
  try {
    const { initializeFirebaseForDb } = await import("@/lib/firebase")
    const db = await initializeFirebaseForDb()

    const workoutsSnapshot = await db.collection("workouts").where("userId", "==", userId).getDocs()

    const totalWorkouts = workoutsSnapshot.size || 5 // Demo data
    const completedWorkouts = workoutsSnapshot.docs.filter((doc: any) => doc.data().completed === true).length || 3

    const plansSnapshot = await db.collection("trainingPlans").where("userId", "==", userId).getDocs()

    return {
      totalWorkouts,
      completedWorkouts,
      completionRate: totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 75,
      totalPlans: plansSnapshot.size || 1,
    }
  } catch (error) {
    console.error("Error getting user stats:", error)
    // Return demo stats on error
    return {
      totalWorkouts: 5,
      completedWorkouts: 3,
      completionRate: 75,
      totalPlans: 1,
    }
  }
}
