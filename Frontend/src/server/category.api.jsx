import api from "../api/API"

export const category = () => api.get("/category/")

export const crateCategory = (formData) => api.post("/category", formData)

export const updateCategory = (id, formData) => api.patch(`/category/${id}`, formData)

export const removeCategory = (id) => api.delete(`/category/${id}`)