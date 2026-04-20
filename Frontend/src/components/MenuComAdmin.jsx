import React, { useState, useEffect } from 'react'
import "../styles/MenuAdmin.css"
import { createMenu } from '../server/menu.api'
import { toast } from 'react-toastify'
import { category } from '../server/category.api'
import { useRef } from 'react'
import useCafeStore from '../store/cafe_store'
import { RiDeleteBin5Fill } from "react-icons/ri"
import { useNavigate } from 'react-router-dom'

const MenuComAdmin = () => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category_id: "",
        file: null
    })

    const { menus, listMenu, menuSkip, menuLimit, menuTotal, deleteMenu } = useCafeStore()

    const [categories, setCategories] = useState([])

    const [loading, setLoading] = useState(false)

    const [preview, setPreview] = useState(null)

    const fileRef = useRef()

    const navigate = useNavigate()

    useEffect(() => {
        fetchCategory()
    }, [])

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview)
        }
    }, [preview])

    useEffect(() => {
        listMenu()
    }, [])

    const fetchCategory = async () => {
        try {
            const res = await category()
            setCategories(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleChang = (e) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    const handleFile = (e) => {
        const file = e.target.files[0]

        if (!file) {
            toast.error("กรุณาเลือกภาพ")
            return
        }

        if (!file.type.startsWith("image/")) {
            toast.error("ต้องเป็นไฟล์รูปภาพเท่านั้น")
            return
        }

        setForm({ ...form, file })
        setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (loading) return

        if (!form.category_id) {
            toast.error("กรุณาเลือก category")
            return
        }

        if (!form.file) {
            toast.error("กรุณาเลือกรูปภาพ")
            return
        }

        const formData = new FormData()

        formData.append("name", form.name)
        formData.append("price", Number(form.price))
        formData.append("description", form.description)
        formData.append("category_id", form.category_id)
        formData.append("file", form.file)

        try {
            setLoading(true)
            await createMenu(formData)
            listMenu()
            setForm({
                name: "",
                description: "",
                price: "",
                category_id: "",
                file: null
            })
            setPreview(null)
            fileRef.current.value = ""
            toast.success("create menu success")
        } catch (error) {
            console.log(error)
            toast.error("create menu fail")
        } finally {
            setLoading(false)
        }
    }

    const handleNext = () => {
        const nextSkip = menuSkip + menuLimit

        if (nextSkip >= menuTotal) return

        listMenu(nextSkip, menuLimit)
    }

    const handlePrev = () => {
        const prevSkip = Math.max(0, menuSkip - menuLimit)
        listMenu(prevSkip, menuLimit)
    }

    const sortedMenus = [...menus].sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    )

    return (
        <section className='headre-menu-admin'>
            <main className="main-menu-admin">
                <div className="con-title-menu-admin">
                    <h2 className="tile-menu-admin">Menu Manager</h2>
                </div>
                <div className="con-form-input-menu-admin">
                    <h3 className="title-crate-menu">create menu</h3>
                    <form onSubmit={handleSubmit} className="con-input-menu-admin">
                        <label className="label-creat-menu" htmlFor="name">name :</label>
                        <input value={form.name} onChange={handleChang} type="text" name="name" className="input-menu" required />
                        <label className="label-creat-menu" htmlFor="description">description :</label>
                        <input value={form.description} onChange={handleChang} type="text" name="description" className="input-menu" required />
                        <label className="label-creat-menu" htmlFor="price">price :</label>
                        <input value={form.price} onChange={handleChang} type="number" name="price" className="input-menu" required />
                        <label className="label-creat-menu" htmlFor="category_id">category :</label>
                        <select
                            disabled={loading}
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChang}
                            className="input-menu-category"
                            required
                        >
                            <option className='option-menu' value="">-- category --</option>

                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <label className="label-creat-menu" htmlFor="image">image</label>
                        <input disabled={loading} ref={fileRef} onChange={handleFile} type="file" name="file" className="input-img-menu" required />
                        {preview && (
                            <img
                                src={preview}
                                alt="preview"
                                style={{ width: "150px", marginTop: "10px", borderRadius: "10px" }}
                            />
                        )}
                        <button disabled={loading} className="btn-submit-menu">
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </form>
                </div>
                <table className="main-table-menu-admin">
                    <thead className='head-table-menu-admin'>
                        <tr className='list-table-menu-admin'>
                            <th className='title-table-menu-admin'>img</th>
                            <th className='title-table-menu-admin'>Name</th>
                            <th className='title-table-menu-admin'>Description</th>
                            <th className='title-table-menu-admin'>Price</th>
                            <th className='title-table-menu-admin'>Update</th>
                            <th className='title-table-menu-admin'>Delete</th>
                        </tr>
                    </thead>

                    <tbody className='body-table-category'>
                        {sortedMenus.map((m) => (
                            <tr key={m.id} className='list-table-menu-admin'>
                                <td className='p-table-menu-admin'>
                                    {m.image_url && (
                                        <img src={m.image_url} alt={m.name} style={{ width: "50px", borderRadius: "5px" }} />
                                    )}
                                </td>
                                <td className='p-table-menu-admin'>{m.name}</td>
                                <td className='p-table-menu-admin'>{m.description}</td>
                                <td className='p-table-menu-admin'>{m.price}</td>
                                <td className='p-table-menu-admin'><button onClick={() => navigate(`/admin/updatemenu/${m.id}`)} className="btn-update-menu">update</button></td>
                                <td className='p-table-menu-admin'>
                                    <button onClick={() => deleteMenu(m.id)} className="btn-remove-menu"><RiDeleteBin5Fill /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {menuSkip > 0 && (
                    <div className='main-prev-next-user'>
                        <button onClick={handlePrev} className='btn-prev-user'>
                            Prev
                        </button>

                        <span className='page-user'>
                            Page {Math.floor(menuSkip / menuLimit) + 1}
                        </span>

                        <button onClick={handleNext} className='btn-next-user'
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </section>
    )
}

export default MenuComAdmin