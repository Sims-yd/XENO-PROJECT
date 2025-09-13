"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { authAPI } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (token) {
          const response = await authAPI.verifyToken()
          if (response.success) {
            setUser(response.data.user)
          } else {
            localStorage.removeItem("auth_token")
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("auth_token")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      const response = await authAPI.login(email, password)
      if (response.success) {
        setUser(response.data.user)
        return { success: true }
      } else {
        setError(response.message)
        return { success: false, error: response.message }
      }
    } catch (error) {
      const errorMessage = error.message || "Login failed"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    try {
      setError(null)
      setLoading(true)
      const response = await authAPI.register(name, email, password)
      if (response.success) {
        setUser(response.data.user)
        return { success: true }
      } else {
        setError(response.message)
        return { success: false, error: response.message }
      }
    } catch (error) {
      const errorMessage = error.message || "Registration failed"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = async (googleData) => {
    try {
      setError(null)
      const response = await authAPI.googleAuth(googleData)
      if (response.success) {
        setUser(response.data.user)
        return { success: true }
      } else {
        setError(response.message)
        return { success: false, error: response.message }
      }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("auth_token")
    }
  }

  const updateProfile = async (profileData) => {
    try {
      setError(null)
      const response = await authAPI.updateProfile(profileData)
      if (response.success) {
        setUser(response.data.user)
        return { success: true }
      } else {
        setError(response.message)
        return { success: false, error: response.message }
      }
    } catch (error) {
      setError(error.message)
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    googleLogin,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
