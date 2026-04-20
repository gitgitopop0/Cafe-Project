import React from 'react'
import '../styles/NavAdmin.css'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { GiHamburgerMenu } from "react-icons/gi"
import useCafeStore from '../store/cafe_store'
import { MdDashboard } from "react-icons/md"
import { RiDrinks2Fill } from "react-icons/ri"
import { MdCategory } from "react-icons/md"
import { RiDrinksFill } from "react-icons/ri"
import { FaRegUser } from "react-icons/fa"

const NavAdmin = ({ open }) => {
    const { actionLogout } = useCafeStore()

    const navigate = useNavigate()

    return (
        <header className={`header-navAdmin ${open ? "open" : ""}`}>
            <nav className="main-navAdmin" aria-label="Admin Navigation">
                <div className="logo-navAdmin">
                    <h1 className='logo-cafe-navAdmin'>Café Admin</h1>

                    <ul className='con-menu-navAdmin'>
                        <li className="menu-navAdmin">
                            <NavLink to="/admin" end className={({ isActive }) =>
                                isActive ? "link-navAdmin-active-link-navAdmin" : "link-navAdmin"
                            } >
                                <MdDashboard />
                                Dashboard
                            </NavLink>
                        </li>
                        <li className="menu-navAdmin">
                            <NavLink to="/admin/menu" className={({ isActive }) =>
                                isActive ? "link-navAdmin-active-link-navAdmin" : "link-navAdmin"
                            } >
                                <RiDrinks2Fill />
                                Menu
                            </NavLink>
                        </li>
                        <li className="menu-navAdmin">
                            <NavLink to="/admin/category" className={({ isActive }) =>
                                isActive ? "link-navAdmin-active-link-navAdmin" : "link-navAdmin"
                            } >
                                <MdCategory />
                                Category
                            </NavLink>
                        </li>
                        <li className="menu-navAdmin">
                            <NavLink to="/admin/featuremenu" className={({ isActive }) =>
                                isActive ? "link-navAdmin-active-link-navAdmin" : "link-navAdmin"
                            }>
                                <RiDrinksFill />
                                Recommended
                            </NavLink>
                        </li>
                        <li className="menu-navAdmin">
                            <NavLink to="/admin/users" className={({ isActive }) =>
                                isActive ? "link-navAdmin-active-link-navAdmin" : "link-navAdmin"
                            }>
                                <FaRegUser />
                                Users
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="con-logout-admin">
                    <button onClick={() => navigate('/')} className="tohome">
                        Home Page
                    </button>
                    <button className="btn-logout-admin" onClick={async () => {
                        await actionLogout()
                    }}>
                        Logout
                    </button>
                </div>
            </nav>

        </header>
    )
}

export default NavAdmin