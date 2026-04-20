import api from "../api/API"

export const getMenuByCategory = () => api.get("/admin/stats/menu-by-category")

export const userToday = () => api.get("/admin/stats/users-today")

export const featured = () => api.get("/admin/stats/featured-count")