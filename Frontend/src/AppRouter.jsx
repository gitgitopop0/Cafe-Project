import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import Map from './pages/Map'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import MainNav from './Layouts/MainNav'
import LayoutAdmin from './Layouts/LayoutAdmin'
import DashBoard from './pages/admin/DashBoard'
import MenuAdmin from './pages/admin/MenuAdmin'
import CategoryAdmin from './pages/admin/CategoryAdmin'
import User from './pages/admin/User'
import Featuremenu from './pages/admin/Featuremenu'
import ProtectedRoute from './routes/ProtectedRoute'
import UpdateMenu from './pages/admin/updateMenu'

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainNav />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "map",
                element: <Map />
            },
            {
                path: "menu",
                element: <MenuPage />
            },
        ]
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute requiredRole="admin">
                <LayoutAdmin />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <DashBoard />
            },
            {
                path: "menu",
                element: <MenuAdmin />
            },
            {
                path: "category",
                element: <CategoryAdmin />
            },
            {
                path: "users",
                element: <User />
            },
            {
                path: "featuremenu",
                element: <Featuremenu />
            },
            {
                path: "updatemenu/:id",
                element: <UpdateMenu />
            }
        ]
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },

])

const AppRouter = () => {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default AppRouter