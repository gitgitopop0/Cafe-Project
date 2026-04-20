import React from 'react'
import '../styles/Login.css'
import { Link } from 'react-router-dom'
import { IoIosHome } from "react-icons/io"
import { useState } from 'react'
import { toast } from 'react-toastify'
import useCafeStore from '../store/cafe_store'
import { useNavigate } from 'react-router-dom'

const LoginCom = () => {

    const actionLogin = useCafeStore((state) => state.actionLogin)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            const res = await actionLogin(formData)
            toast.success("Login successful!")

            const role = res.data.user.role
            if (role === 'admin') {
                navigate('/admin')
            } else{
                navigate('/')
            }

        } catch (error) {
            const errorMessage = error.response?.data?.detail || "Login failed!"
            toast.error(errorMessage)
        }
    }

    return (
        <>
            <section className='main-login'>
                <main className="con-login">
                    <h2 className="class-login">Login</h2>
                    <form className="form-login" onSubmit={handleSubmit}>
                        <label htmlFor="email" className="label-login">Email</label>
                        <input onChange={handleChange} value={formData.email} type="text" id="email" name="email" className="input-login" required />
                        <label htmlFor="password" className="label-login">Password</label>
                        <input onChange={handleChange} value={formData.password} type="password" id="password" name="password" className="input-login" required />
                        <button type="submit" className="btn-login">Login</button>
                    </form>
                    <div className="list-link-login">
                        <Link to="/register" className="link-login">Register</Link>
                        <Link to="/" className="home-link-login">
                            <IoIosHome />
                        </Link>
                    </div>
                </main>
            </section>
        </>
    )
}

export default LoginCom