import api from "../api/API"

export const getMenu = () => api.get("/menu/")

export const createMenu = (formData) => api.post("/menu/", formData,
    {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }
)

export const listMenu = (skip = 0, limit = 20) => api.get(`/menu/?skip=${skip}&limit=${limit}`)

export const updateMenu = (id, formData) => api.patch(`/menu/${id}`, formData)

export const getMenuid = (id) => api.get(`/menu/${id}`)

export const removeMenu = (id) => api.delete(`/menu/${id}`)

export const searchMenu = (q, skip = 0, limit = 20) =>
    api.get(`/menu/search?q=${q}&skip=${skip}&limit=${limit}`)