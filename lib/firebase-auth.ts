// Custom Firebase Auth service using REST API
interface User {
  uid: string
  email: string | null
  displayName: string | null
}

class FirebaseAuthService {
  private currentUser: User | null = null
  private listeners: ((user: User | null) => void)[] = []

  constructor() {
    // Check for stored user on initialization
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("firebaseUser")
      if (storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser)
        } catch (e) {
          localStorage.removeItem("firebaseUser")
        }
      }
    }
  }

  // Simulate Firebase Auth state change listener
  onAuthStateChanged(callback: (user: User | null) => void) {
    this.listeners.push(callback)

    // Immediately call with current user
    setTimeout(() => callback(this.currentUser), 100)

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners() {
    this.listeners.forEach((callback) => callback(this.currentUser))
  }

  private setUser(user: User | null) {
    this.currentUser = user
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("firebaseUser", JSON.stringify(user))
      } else {
        localStorage.removeItem("firebaseUser")
      }
    }
    this.notifyListeners()
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    try {
      console.log("Custom Auth: Sign in with email/password")

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept any email/password combination
      const user: User = {
        uid: "demo-user-" + Date.now(),
        email: email,
        displayName: email.split("@")[0],
      }

      this.setUser(user)
      console.log("Custom Auth: Sign in successful")
      return { user }
    } catch (error) {
      console.error("Custom Auth: Sign in error:", error)
      throw error
    }
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    try {
      console.log("Custom Auth: Create user with email/password")

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user: User = {
        uid: "demo-user-" + Date.now(),
        email: email,
        displayName: email.split("@")[0],
      }

      this.setUser(user)
      console.log("Custom Auth: User creation successful")
      return { user }
    } catch (error) {
      console.error("Custom Auth: User creation error:", error)
      throw error
    }
  }

  async signInWithGoogle() {
    try {
      console.log("Custom Auth: Sign in with Google")

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user: User = {
        uid: "demo-google-user-" + Date.now(),
        email: "demo@gmail.com",
        displayName: "Demo User",
      }

      this.setUser(user)
      console.log("Custom Auth: Google sign in successful")
      return { user }
    } catch (error) {
      console.error("Custom Auth: Google sign in error:", error)
      throw error
    }
  }

  async signOut() {
    try {
      console.log("Custom Auth: Sign out")

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      this.setUser(null)
      console.log("Custom Auth: Sign out successful")
    } catch (error) {
      console.error("Custom Auth: Sign out error:", error)
      throw error
    }
  }

  getCurrentUser() {
    return this.currentUser
  }
}

// Export singleton instance
export const firebaseAuth = new FirebaseAuthService()
