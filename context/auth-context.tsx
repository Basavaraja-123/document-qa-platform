"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockLogin, mockSignUp, mockLogout, mockGetCurrentUser } from "@/lib/mock-services"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "viewer"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await mockGetCurrentUser()
        setUser(currentUser)
      } catch (error) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const user = await mockLogin(email, password)
    setUser(user)
  }

  const signUp = async (email: string, password: string, name: string) => {
    const user = await mockSignUp(email, password, name)
    setUser(user)
  }

  const logout = async () => {
    await mockLogout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signUp, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
