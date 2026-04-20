import React from 'react'
import '../styles/Register.css'
import { Link } from 'react-router-dom'
import { IoIosHome } from "react-icons/io"
import { useState } from 'react'
import { toast } from 'react-toastify'
import useCafeStore from '../store/cafe_store'
import { useNavigate } from 'react-router-dom'

const RegisterCom = () => {
  const actionRegister = useCafeStore((state) => state.actionRegister)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})

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

    const newErrors = {}

    if (!formData.password) {
      newErrors.password = "Password is required!"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required!"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix errors!")
      return
    }

    try {
      await actionRegister(formData)
      toast.success("Registration successful!")
      navigate('/login')
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Registration failed!"
      toast.error(errorMessage)
    }
  }

  return (
    <section className='main-register'>
      <main className="con-register">
        <h2 className="class-register">Register</h2>
        <form className="form-register" onSubmit={handleSubmit}>
          <label htmlFor="username" className="label-register">Username</label>
          <input onChange={handleChange} value={formData.username} type="text" id="username" name="username" className="input-register" required />
          <label htmlFor="email" className="label-register">Email</label>
          <input onChange={handleChange} value={formData.email} type="text" id="email" name="email" className="input-register" required />
          <label htmlFor="password" className="label-register">Password</label>
          <input onChange={handleChange} value={formData.password} type="password" id="password" name="password" className="input-register" required />
          {errors.password && <span className="error-register">{errors.password}</span>}
          <label htmlFor="confirmPassword" className="label-register">Confirm Password</label>
          <input onChange={handleChange} value={formData.confirmPassword} type="password" id="confirmPassword" name="confirmPassword" className="input-register" required />
          {errors.confirmPassword && <span className="error-register">{errors.confirmPassword}</span>}
          <button type="submit" className="btn-register">Register</button>
        </form>
        <div className="list-link-register">
          <Link to="/login" className="link-register">Login</Link>
          <Link to="/" className="home-link-register">
            <IoIosHome />
          </Link>
        </div>
      </main>
    </section>
  )
}

export default RegisterCom