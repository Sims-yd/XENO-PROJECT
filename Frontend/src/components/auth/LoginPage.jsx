
import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { useAuth } from "../../hooks/useAuth"
import { useGoogleLogin } from "@react-oauth/google"

export function LoginPage() {
  const { login, register, googleLogin, error, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [validationErrors, setValidationErrors] = useState({})

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setIsLoading(true)

      // Example: get profile info from Google
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        },
      })
      const profile = await res.json()

      // Now call your backend login with profile data
      await googleLogin({
        googleId: profile.sub,       // Google unique ID
        email: profile.email,
        name: profile.name,
        avatar: profile.picture,
      })
    } catch (error) {
      console.error("Google login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}

    if (isRegister && (!formData.name || formData.name.length < 2)) {
      errors.name = "Name must be at least 2 characters"
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setValidationErrors({})

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      let result
      if (isRegister) {
        result = await register(formData.name, formData.email, formData.password)
      } else {
        result = await login(formData.email, formData.password)
      }

      if (!result.success) {
        setValidationErrors({ form: result.error })
      }
    } catch (error) {
      setValidationErrors({ form: "Authentication failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true)
        const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        const profile = await userInfo.json()

        await googleLogin({
          googleId: profile.sub,
          email: profile.email,
          name: profile.name,
          avatar: profile.picture
        })
      } catch (error) {
        console.error("Google login failed:", error)
      } finally {
        setIsLoading(false)
      }
    },
    onError: () => {
      console.error("Google login failed")
      setIsLoading(false)
    }
  })

  return (
    <div className="h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements - lighter colors */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-100/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Logo positioned at top left */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
  <img src="/logo.png" alt="App Logo" className="h-8 w-8" />
        <div>
          <span className="text-xl font-bold text-slate-800">Xeno CRM</span>
          <p className="text-blue-600 text-xs">Smart Customer Management</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-4">{isRegister ? "Create Account" : "Welcome Back"}</h1>
              <p className="text-blue-600">
                {isRegister ? "Join Xeno CRM to manage your customers" : "Sign in to your Xeno CRM account"}
              </p>
            </div>

            {/* Login/Register Form */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-100 shadow-md">
              <CardContent className="p-6">
                {error && (
                  <div className="bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isRegister && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-300 to-indigo-300 hover:from-blue-400 hover:to-indigo-400 text-white py-3 font-semibold"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {isRegister ? "Creating Account..." : "Signing In..."}
                      </div>
                    ) : isRegister ? (
                      "Create Account"
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-transparent text-slate-400">Or continue with</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleGoogleLogin()}
                    disabled={isLoading}
                    className="w-full mt-4 bg-white hover:bg-blue-50 text-slate-800 border border-slate-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 border-2 border-blue-200 border-t-blue-400 rounded-full animate-spin" />
                        Connecting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continue with Google
                      </div>
                    )}
                  </Button>
                </div>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {isRegister ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                  </button>
                </div>
              </CardContent>
            </Card>
        </div>
      </main>
    </div>
  )
}
