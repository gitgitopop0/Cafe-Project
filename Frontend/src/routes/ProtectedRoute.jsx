import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const raw = localStorage.getItem('cafe-storage')
    if (!raw) return <Navigate to="/login" replace />
    
    const { state } = JSON.parse(raw)
    const user = state?.user
    
    if (!user) return <Navigate to="/login" replace />
    if (user.role !== "admin") return <Navigate to="/" replace />

    return children
}

export default ProtectedRoute