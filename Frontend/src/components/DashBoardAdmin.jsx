import React, { useState } from 'react'
import '../styles/DashBoard.css'
import { FaUser } from "react-icons/fa"
import { MdEmojiFoodBeverage } from "react-icons/md"
import { MdCategory } from "react-icons/md"
import { MdFeaturedPlayList } from "react-icons/md"
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import useCafeStore from '../store/cafe_store'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const DashBoardAdmin = () => {

    const { menuByCategory, fetchMenuByCategory, categories, fetchCategories } = useCafeStore()

    const [stats, setStats] = useState({
        usersToday: 0,
        totalMenu: 0,
        featured: 0
    })

    useEffect(() => {
        const loadData = async () => {

            await Promise.all([
                fetchMenuByCategory(),
                fetchCategories()
            ])

            const store = useCafeStore.getState()

            const [users, menu, featured] = await Promise.all([
                store.fetchUsersToday(),
                store.fetchMenu(),
                store.fetchFeatured()
            ])

            setStats({
                usersToday: users.count || 0,
                totalMenu: menu || 0,
                featured: featured || 0
            })
        }

        loadData()
    }, [])

    const totalCategory = categories?.length || 0


    return (
        <section className='header-dashboard'>
            <main className="main-dashboard">
                <h1 className='title-dashboard'>Welcome to the Admin Dashboard</h1>
                <div className="con-card-dashboard">
                    <div className="card-dashboard">
                        <div className="main-card-dashboarb">
                            <div className="icon-card-dashbord"><FaUser /></div>
                            <h2 className="card-title-dashboard">User Today: {stats.usersToday}</h2>
                        </div>
                        <Link to="/admin/users" className='link-card-dashboard'>[ View Users ]</Link>
                    </div>
                    <div className="card-dashboard">
                        <div className="main-card-dashboarb">
                            <div className="icon-card-dashbord"><MdEmojiFoodBeverage /></div>
                            <h2 className="card-title-dashboard">Total Menu: {stats.totalMenu}</h2>
                        </div>
                        <Link to="/admin/menu" className='link-card-dashboard'>[ View Menu ]</Link>
                    </div>
                    <div className="card-dashboard">
                        <div className="main-card-dashboarb">
                            <div className="icon-card-dashbord"><MdCategory /></div>
                            <h2 className="card-title-dashboard">Category: {totalCategory}</h2>
                        </div>
                        <Link to="/admin/category" className='link-card-dashboard'>[ View Categories ]</Link>
                    </div>
                    <div className="card-dashboard">
                        <div className="main-card-dashboarb">
                            <div className="icon-card-dashbord"><MdFeaturedPlayList /></div>
                            <h2 className="card-title-dashboard">Recommended: {stats.featured}</h2>
                        </div>
                        <Link to="/admin/featuremenu" className='link-card-dashboard'>[ View Featured ]</Link>
                    </div>
                </div>
                <div className="Chart-DashBoard">
                    <h2 className="title-menu-category">Menu by Category</h2>
                    <div className="con-menu-category">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={menuByCategory || []}>
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#000000" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </section>
    )
}

export default DashBoardAdmin