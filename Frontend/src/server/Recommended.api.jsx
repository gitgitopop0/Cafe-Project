import api from "../api/API";

export const createRecommended = (formData) => api.post("/featuremenu/", formData)

export const listRecommended = () => api.get("/featuremenu/")

export const removeRecommended = (id) => api.delete(`/featuremenu/${id}`)