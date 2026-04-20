import React from 'react'
import { Outlet } from 'react-router-dom'
import MainNavCom from '../components/MainNavCom'

const MainNav = () => {
    return (
        <>
            <MainNavCom />
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default MainNav