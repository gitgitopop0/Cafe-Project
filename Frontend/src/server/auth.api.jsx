import api from "../api/API"

export const login = (formData) => api.post("/auth/login", formData)

export const register = (formData) => api.post("/auth/register", formData)

export const logout = () => api.post("/auth/logout")

export const getMe = () => api.get("/auth/me")