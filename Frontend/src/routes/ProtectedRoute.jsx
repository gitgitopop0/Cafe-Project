import React from 'react'
import { Navigate } from 'react-router-dom'
import useCafeStore from '../store/cafe_store'

const ProtectedRoute = ({ children }) => {
    const user = useCafeStore(state => state.user)

    if (!user) return <Navigate to="/login" replace />
    if (user.role !== "admin") return <Navigate to="/" replace />

    return children
}

export default ProtectedRoute