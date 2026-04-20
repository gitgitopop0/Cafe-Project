import React from 'react'
import { Outlet } from 'react-router-dom'
import NavAdmin from '../components/NavAdmin'
import '../styles/LayoutAdmin.css'
import { GiHamburgerMenu } from "react-icons/gi"
import { useState } from 'react'

const LayoutAdmin = () => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className="layout-admin">

                <button className="ham-menu" onClick={() => setOpen(!open)}>
                    <GiHamburgerMenu />
                </button>
                {open && (
                    <div className="overlay" onClick={() => setOpen(false)}></div>
                )}
                <NavAdmin open={open} />

                <main className='admin-content'>
                    <Outlet />
                </main>
            </div>
        </>
    )
}

export default LayoutAdmin