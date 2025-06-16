import { getFirebaseDb, getServerFirestore } from "@/lib/firebase"

// Helper to get the appropriate database instance
const getDb = async () => {
  if (typeof window === "undefined") {
    // Server-side: use admin SDK
    return await getServerFirestore()
  } else {
    // Client-side: use regular SDK
    return await getFirebaseDb()
  }
}

// User Profile Functions
export async function createUserProfile(userId: string, profileData: any) {
  try {
    const db = await getDb()
    if (!db) {
      console.warn("Database not available, using mock data")
      return { success: true }
    }

    if (typeof window === "undefined") {
      // Server-side with admin SDK
      await db
        .collection("users")
        .doc(userId)
        .set({
          ...profileData,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
    } else {
      // Client-side with regular SDK
      const { doc, setDoc, Timestamp } = await import("firebase/firestore")
      const userRef = doc(db, "users", userId)
      await setDoc(userRef, {
        ...profileData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    }

    console.log("User profile created successfully")
    return { success: true }
  } catch (error) {
    console.error("Error creating user profile:", error)
    return { success: false, error: error.message }
  }
}

export async function updateUserProfile(userId: string, updates: any) {
  try {
    const db = await getDb()
    if (!db) {
      console.warn("Database not available, using mock data")
      return { success: true }
    }

    if (typeof window === "undefined") {
      // Server-side with admin SDK
      await db
        .collection("users")
        .doc(userId)
        .update({
          ...updates,
          updatedAt: new Date(),
        })
    } else {
      // Client-side with regular SDK
      const { doc, updateDoc, Timestamp } = await import("firebase/firestore")
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      })
    }

    console.log("User profile updated successfully")
    return { success: true }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: error.message }
  }
}

export async function getUserProfile(userId: string) {
  try {
    const db = await getDb()
    if (!db) {
      console.warn("Database not available, returning mock user profile")
      return {
        name: "Demo User",
        email: "demo@example.com",
        fitnessLevel: "Beginner",
        goals: ["General fitness"],
        onboardingCompleted: true,
      }
    }

    if (typeof window === "undefined") {
      // Server-side with admin SDK
      const doc = await db.collection("users").doc(userId).get()
      if (doc.exists) {
        return doc.data()
      } else {
        console.log("No user profile found")
        return null
      }
    } else {
      // Client-side with regular SDK
      const { doc, getDoc } = await import("firebase/firestore")
      const userRef = doc(db, "users", userId)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        return userSnap.data()
      } else {
        console.log("No user profile found")
        return null
      }
    }
  } catch (error) {
    console.error("Error getting user profile:", error)
    // Return mock data instead of throwing
    return {
      name: "Demo User",
      email: "demo@example.com",
      fitnessLevel: "Beginner",
      goals: ["General fitness"],
      onboardingCompleted: true,
    }
  }
}

// Training Plan Functions
export async function createTrainingPlan(userId: string, planData: any) {
  try {
    const db = await getDb()
    if (!db) {
      console.warn("Database not available, using mock data")
      return { success: true, id: "mock-plan-" + Date.now() }
    }

    if (typeof window === "undefined") {
      // Server-side with admin SDK
      const docRef = await db.collection("trainingPlans").add({
        userId,
        ...planData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      return { success: true, id: docRef.id }
    } else {
      // Client-side with regular SDK
      const { collection, addDoc, Timestamp } = await import("firebase/firestore")
      const plansRef = collection(db, "trainingPlans")
      const docRef = await addDoc(plansRef, {
        userId,
        ...planData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      return { success: true, id: docRef.id }
    }
  } catch (error) {
    console.error("Error creating training plan:", error)
    return { success: false, error: error.message }
  }
}

export async function getUserTrainingPlans(userId: string) {
  try {
    const db = await getDb()
    if (!db) {
      console.warn("Database not available, returning mock training plans")
      return [
        {
          id: "mock-plan-1",
          name: "Demo Training Plan",
          type: "Half Ironman",
          createdAt: new Date(),
        },
      ]
    }

    if (typeof window === "undefined") {
      // Server-side with admin SDK
      const snapshot = await db
        .collection("trainingPlans")
        .where("userId", "==", userId)
        .orderBy("createdAt", "desc")
        .get()

      const plans: any[] = []
      snapshot.forEach((doc) => {
        plans.push({
          id: doc.id,
          ...doc.data(),
        })
      })
      return plans
    } else {
      // Client-side with regular SDK
      const { collection, query, where, getDocs, orderBy } = await import("firebase/firestore")
      const plansRef = collection(db, "trainingPlans")
      const q = query(plansRef, where("userId", "==", userId), orderBy("createdAt", "desc"))

      const querySnapshot = await getDocs(q)
      const plans: any[] = []

      querySnapshot.forEach((doc) => {
        plans.push({
          id: doc.id,
          ...doc.data(),
        })
      })
      return plans
    }
  } catch (error) {
    console.error("Error getting user training plans:", error)
    return []
  }
}

// Workout Functions
export async function getUserWorkouts(userId: string, limit = 50) {
  try {
    const db = await getDb()
    if (!db) {
      console.warn("Database not available, returning mock workouts")
      return [
        {
          id: "mock-workout-1",
          name: "Demo Workout",
          type: "Running",
          duration: 30,
          completed: true,
          date: new Date(),
        },
      ]
    }

    if (typeof window === "undefined") {
      // Server-side with admin SDK
      const snapshot = await db
        .collection("workouts")
        .where("userId", "==", userId)
        .orderBy("date", "desc")
        .limit(limit)
        .get()

      const workouts: any[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        workouts.push({
          id: doc.id,
          ...data,
          // Convert Firestore timestamps to dates if they exist
          date: data.date?.toDate ? data.date.toDate() : data.date,
          completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : data.completedAt,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        })
      })
      return workouts
    } else {
      // Client-side with regular SDK
      const { collection, query, where, getDocs, orderBy, limit: firestoreLimit } = await import("firebase/firestore")
      const workoutsRef = collection(db, "workouts")
      const q = query(workoutsRef, where("userId", "==", userId), orderBy("date", "desc"), firestoreLimit(limit))

      const querySnapshot = await getDocs(q)
      const workouts: any[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        workouts.push({
          id: doc.id,
          ...data,
          // Convert Firestore timestamps to dates if they exist
          date: data.date?.toDate ? data.date.toDate() : data.date,
          completedAt: data.completedAt?.toDate ? data.completedAt.toDate() : data.completedAt,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        })
      })
      return workouts
    }
  } catch (error) {
    console.error("Error getting user workouts:", error)
    return []
  }
}

// Analytics and Stats Functions
export async function getUserStats(userId: string) {
  try {
    const workouts = await getUserWorkouts(userId)
    const plans = await getUserTrainingPlans(userId)

    const totalWorkouts = workouts.length
    const completedWorkouts = workouts.filter((w) => w.completed === true || w.status === "completed").length
    const completionRate = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0

    let totalDistance = 0
    let totalDuration = 0

    workouts.forEach((workout) => {
      if (workout.distance) {
        totalDistance += Number.parseFloat(workout.distance) || 0
      }
      if (workout.duration) {
        totalDuration += Number.parseInt(workout.duration) || 0
      }
    })

    return {
      totalWorkouts,
      completedWorkouts,
      completionRate: Math.round(completionRate),
      totalPlans: plans.length,
      totalDistance: Math.round(totalDistance * 10) / 10,
      totalDuration: Math.round(totalDuration),
      averagePace: totalDistance > 0 && totalDuration > 0 ? totalDuration / totalDistance : 0,
    }
  } catch (error) {
    console.error("Error getting user stats:", error)
    return {
      totalWorkouts: 0,
      completedWorkouts: 0,
      completionRate: 0,
      totalPlans: 0,
      totalDistance: 0,
      totalDuration: 0,
      averagePace: 0,
    }
  }
}

// Helper functions
export async function createWorkout(userId: string, workoutData: any) {
  return await createTrainingPlan(userId, { ...workoutData, type: "workout" })
}

export async function updateWorkout(workoutId: string, updates: any) {
  console.log("Update workout not implemented yet")
  return { success: true }
}

export async function getWorkout(workoutId: string) {
  console.log("Get workout not implemented yet")
  return null
}

export async function updateUserSubscription(userId: string, subscriptionData: any) {
  return await updateUserProfile(userId, { subscription: subscriptionData })
}

export async function getUserSubscription(userId: string) {
  try {
    const userProfile = await getUserProfile(userId)
    return userProfile?.subscription || { status: "trial", plan: "basic" }
  } catch (error) {
    console.error("Error getting user subscription:", error)
    return { status: "trial", plan: "basic" }
  }
}

export async function logWorkout(userId: string, workoutData: any) {
  return await createWorkout(userId, {
    ...workoutData,
    completed: true,
    status: "completed",
    completedAt: new Date(),
  })
}

export function getDbInstance() {
  return getDb()
}
