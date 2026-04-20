import React from 'react'
import '../styles/MainNav.css'
import { RiLoginCircleLine } from "react-icons/ri";
import { NavLink, Link } from 'react-router-dom';
import Logo from '../img/Café logo with vintage floral accents.png'
import useCafeStore from '../store/cafe_store';
import { useState } from 'react';
import { FaUserCircle } from "react-icons/fa"
import { RiLogoutCircleRLine } from "react-icons/ri"

const MainNavCom = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, actionLogout } = useCafeStore()

  return (
    <header className='header-nav'>
      <nav className='main-nav' aria-label="Main Navigation">
        {!user ? (
          <Link to="/login" className='login-nav' aria-label="Login">
            <RiLoginCircleLine />
            <span className="visually-hidden">Login</span>
          </Link>
        ) : (
          <div className='user-dropdown'>

            <div
              className='welcome-nav'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FaUserCircle />
            </div>

            {isMenuOpen && (
              <div className='dropdown-menu'>
                <div className='dropdown-item'>
                  Username: {user.username}
                </div>
                <div className='dropdown-item'>
                  Email: {user.email}
                </div>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className='dropdown-item-admin'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  className='dropdown-item-logout-btn'
                  onClick={() => {
                    actionLogout()
                    setIsMenuOpen(false)
                  }}
                >
                  <RiLogoutCircleRLine />
                </button>
              </div>
            )}

          </div>
        )}
        <div className='container-nav'>
          <div className="nav-left"></div>

          <h1 className='logo-nav'>
            <Link to="/" className='link-logo-nav'>
              <img src={Logo} alt="Cafe Logo - ร้านกาแฟสุดชิล" className='logo-img' />
            </Link>
            <span className="visually-hidden">Cafe Chill</span>
          </h1>

          <div className="nav-right">
          </div>
        </div>
        <div className="menu-wrapper" aria-label="Main Menu">
          <ul className="btn-nav">
            <li className="list-btn-nav"><NavLink className={({ isActive }) => isActive ? 'link-btn-nav active' : 'link-btn-nav'} to="/">Home</NavLink></li>
            <li className="list-btn-nav"><NavLink className={({ isActive }) => isActive ? 'link-btn-nav active' : 'link-btn-nav'} to="/menu">Menu</NavLink></li>
            <li className="list-btn-nav"><NavLink className={({ isActive }) => isActive ? 'link-btn-nav active' : 'link-btn-nav'} to="/map">Map</NavLink></li>
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default MainNavCom