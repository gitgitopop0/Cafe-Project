import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { updateMenu, getMenuid } from '../server/menu.api'
import { category } from '../server/category.api'
import { toast } from 'react-toastify'
import "../styles/updateMenu.css"

const UpdateMenuAdmin = () => {

    const { id } = useParams()
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category_id: "",
        file: null
    })

    const navigate = useNavigate()

    useEffect(() => {
        fetchMenu()
    }, [id])

    const [oldImage, setOldImage] = useState(null)

    const fetchMenu = async () => {
        try {
            const res = await getMenuid(id)
            const data = res.data
            setOldImage(data.image_url)

            if (!id) return

            setForm({
                name: data.name,
                description: data.description,
                price: data.price,
                category_id: data.category_id,
                file: null
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("name", form.name)
        formData.append("description", form.description)
        formData.append("price", form.price)
        formData.append("category_id", form.category_id)
        if (form.file) {
            formData.append("file", form.file)
        }

        try {
            setLoading(true)
            await updateMenu(id, formData)
            toast.success("update menu success")
            navigate('/admin/menu')
        } catch (error) {
            console.log(error)
            toast.error("update menu fail")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])

    const [categories, setCategories] = useState([])

    const fetchCategory = async () => {
        try {
            const res = await category()
            setCategories(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const [preview, setPreview] = useState(null)

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview)
        }
    }, [preview])

    const fileRef = React.useRef()

    const handleFile = (e) => {
        const file = e.target.files[0]

        if (!file) return

        setForm({ ...form, file })
        setPreview(URL.createObjectURL(file))
    }


    return (
        <section className='header-update-menu'>
            <div className="title-update-menu">
                <h2 className='main-title-update-menu'>Update Menu</h2>
            </div>
            <main className="main-update-menu">
                <form onSubmit={handleSubmit} className="con-input-menu-admin">
                    <label className="label-creat-menu" htmlFor="name">name :</label>
                    <input value={form.name} onChange={handleChange} type="text" name="name" className="input-menu" required />
                    <label className="label-creat-menu" htmlFor="description">description :</label>
                    <input value={form.description} onChange={handleChange} type="text" name="description" className="input-menu" required />
                    <label className="label-creat-menu" htmlFor="price">price :</label>
                    <input value={form.price} onChange={handleChange} type="number" name="price" className="input-menu" required />
                    <label className="label-creat-menu" htmlFor="category_id">category :</label>
                    <select
                        disabled={loading}
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
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
                    <input disabled={loading} ref={fileRef} onChange={handleFile} type="file" name="file" className="input-img-menu" />
                    {!preview && oldImage && (
                        <img
                            src={oldImage}
                            alt="preview"
                            style={{ width: "150px", marginTop: "10px", borderRadius: "10px" }}
                        />
                    )}
                    <button disabled={loading} className="btn-submit-menu">
                        {loading ? "Updating..." : "Update"}
                    </button>
                </form>
                <div className="link-back-menu"><Link to={'/admin/menu'} className='link-backto-menu'>Back</Link></div>
            </main>
        </section>
    )
}

export default UpdateMenuAdmin