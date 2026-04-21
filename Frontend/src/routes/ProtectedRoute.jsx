import React from 'react'
import { Navigate } from 'react-router-dom'
import useCafeStore from '../store/cafeStore'

const ProtectedRoute = ({ children, requiredRole }) => {
    const user = useCafeStore((state) => state.user)

    if (!user) return <Navigate to="/login" replace />
    if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />

    return children
}

export default ProtectedRoute