// API Configuration and Service Layer
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// API Client with authentication
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
    this.token = localStorage.getItem("auth_token")
  }

  setToken(token) {
    this.token = token
    if (token) {
      localStorage.setItem("auth_token", token)
    } else {
      localStorage.removeItem("auth_token")
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    const currentToken = localStorage.getItem("auth_token")
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`
    }

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)

      if (response.status === 401) {
        localStorage.removeItem("auth_token")
        this.token = null
        // Force page reload to show login
        window.location.reload()
        throw new Error("Access token required")
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    return this.request(url, { method: "GET" })
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: data,
    })
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: data,
    })
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "PATCH",
      body: data,
    })
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" })
  }
}

// Create API client instance
const apiClient = new ApiClient()

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password })
    if (response.success && response.data.token) {
      apiClient.setToken(response.data.token)
    }
    return response
  },

  register: async (name, email, password) => {
    const response = await apiClient.post("/auth/register", { name, email, password })
    if (response.success && response.data.token) {
      apiClient.setToken(response.data.token)
    }
    return response
  },

  googleAuth: async (googleData) => {
    const response = await apiClient.post("/auth/google", googleData)
    if (response.success && response.data.token) {
      apiClient.setToken(response.data.token)
    }
    return response
  },

  logout: async () => {
    try {
      await apiClient.post("/auth/logout")
    } finally {
      apiClient.setToken(null)
    }
  },

  getProfile: async () => {
    return apiClient.get("/auth/profile")
  },

  updateProfile: async (profileData) => {
    return apiClient.put("/auth/profile", profileData)
  },

  verifyToken: async () => {
    return apiClient.get("/auth/verify")
  },
}

// Customers API
export const customersAPI = {
  getAll: async (params = {}) => {
    return apiClient.get("/customers", params)
  },

  getById: async (id) => {
    return apiClient.get(`/customers/${id}`)
  },

  create: async (customerData) => {
    return apiClient.post("/customers", customerData)
  },

  update: async (id, customerData) => {
    return apiClient.put(`/customers/${id}`, customerData)
  },

  delete: async (id) => {
    return apiClient.delete(`/customers/${id}`)
  },

  getAnalytics: async () => {
    return apiClient.get("/customers/analytics/overview")
  },
}

// Orders API
export const ordersAPI = {
  getAll: async (params = {}) => {
    return apiClient.get("/orders", params)
  },

  getById: async (id) => {
    return apiClient.get(`/orders/${id}`)
  },

  create: async (orderData) => {
    return apiClient.post("/orders", orderData)
  },

  updateStatus: async (id, status) => {
    return apiClient.patch(`/orders/${id}/status`, { status })
  },

  delete: async (id) => {
    return apiClient.delete(`/orders/${id}`)
  },

  getAnalytics: async () => {
    return apiClient.get("/orders/analytics/overview")
  },
}

// Campaigns API
export const campaignsAPI = {
  getAll: async (params = {}) => {
    return apiClient.get("/campaigns", params)
  },

  getById: async (id) => {
    return apiClient.get(`/campaigns/${id}`)
  },

  create: async (campaignData) => {
    return apiClient.post("/campaigns", campaignData)
  },

  update: async (id, campaignData) => {
    return apiClient.put(`/campaigns/${id}`, campaignData)
  },

  delete: async (id) => {
    return apiClient.delete(`/campaigns/${id}`)
  },

  previewAudience: async (audienceRules) => {
    return apiClient.post("/campaigns/preview-audience", { audienceRules })
  },

  start: async (id) => {
    return apiClient.post(`/campaigns/${id}/start`)
  },

  pause: async (id) => {
    return apiClient.post(`/campaigns/${id}/pause`)
  },

  getAnalytics: async () => {
    return apiClient.get("/campaigns/analytics/overview")
  },
}

// Segments API
export const segmentsAPI = {
  parseDescription: async (description) => {
    return apiClient.post("/segments/ai/parse-description", { description })
  },

  getInsights: async (rules) => {
    return apiClient.post("/segments/insights", { rules })
  },
}

// Health check
export const healthAPI = {
  check: async () => {
    return apiClient.get("/health")
  },
}

export default apiClient
