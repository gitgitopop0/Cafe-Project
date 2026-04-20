import React, { useState, useEffect } from 'react'
import "../styles/CategoryAdmin.css"
import useCafeStore from '../store/cafe_store'
import { toast } from 'react-toastify'
import { MdDelete } from "react-icons/md"
import { updateCategory } from '../server/category.api'

const CategoryComAdmin = () => {
  const [name, setName] = useState("")
  const { categories, fetchCategories, createCategory, deleteCategory } = useCafeStore()
  const [editValues, setEditValues] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await createCategory({ name })
      setName("")
      await fetchCategories()
      toast.success("Create successful!")
    } catch (error) {
      toast.error(error.response?.data.detail)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleUpdate = async (id) => {
    try {
      const name = editValues[id]

      if (!name || name.trim() === "") {
        toast.error("Name cannot be empty")
        return
      }
      await updateCategory(id, { name })
      toast.success("Updated")
      setEditValues((prev) => {
        const newState = { ...prev }
        delete newState[id]
        return newState
      })
      fetchCategories()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <section className="header-category">
        <main className="main-category">
          <div className="main-titel-category">
            <h2 className="titel-category">Category Manager</h2>
          </div>
          <div className="con-creat-categoy">
            <form className="form-creat-category" onSubmit={handleSubmit}>
              <label className="label-creat-category" htmlFor="name">create category</label>
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="name" className="input-category" required />
              <button type="submit" className="btn-category">create</button>
            </form>
          </div>
          <table className="main-table-category">
            <thead className='head-table-category'>
              <tr className='list-table-category'>
                <th className='title-table-category'>No.</th>
                <th className='title-table-category'>Name</th>
                <th className='title-table-category'>update</th>
                <th className='title-table-category'>remove</th>
              </tr>
            </thead>

            <tbody className='body-table-category'>
              {categories?.map((item, index) => (
                <tr key={index} className='list-table-category'>
                  <td className='p-table-catgory'>{index + 1}</td>
                  <td className='p-table-catgory'>{item.name}</td>
                  <td className='p-table-catgory'>
                    <form action="" className="update-category">
                      <input value={editValues[item.id] || ""} onChange={(e) => setEditValues({
                        ...editValues,
                        [item.id]: e.target.value
                      })} type="text" name="update" className="input-update-category" required />
                      <button type="button" className="btn-update-category" disabled={!editValues[item.id]} onClick={() => handleUpdate(item.id)}>update</button>
                    </form>
                  </td>
                  <td itemProp="name" className='p-table-catgory'>
                    <button className='btn-remove-category' onClick={() => deleteCategory(item.id)}>
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </section>
    </>
  )
}

export default CategoryComAdmin