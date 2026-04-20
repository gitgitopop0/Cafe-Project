import api from "../api/API"

export const listUsers = (skip = 0, limit = 20) => api.get(`/users/?skip=${skip}&limit=${limit}`)

export const removeUsers = (id) => api.delete(`/users/${id}`)

export const updateRoleUsers = (id, role) => api.patch(`/users/${id}/role`, { role })