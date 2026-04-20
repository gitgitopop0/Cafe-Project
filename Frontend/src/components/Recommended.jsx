

import React, { useState, useEffect } from 'react'
import "../styles/Recommended.css"
import { AsyncPaginate } from 'react-select-async-paginate'
import { searchMenu } from '../server/menu.api'
import { createRecommended } from '../server/Recommended.api'
import { toast } from 'react-toastify'
import { RiDeleteBin5Fill } from "react-icons/ri"
import useCafeStore from '../store/cafe_store'

const Recommended = () => {
    const [selected, setSelected] = useState(null)
    const [loading, setLoading] = useState(false)
    const [dropdownKey, setDropdownKey] = useState(0)

    const { getRecommended, recommended, deleteRecommended } = useCafeStore()

    useEffect(() => {
        getRecommended()
    }, [])

    const loadOptions = async (search, _, { page = 1 }) => {
        try {
            const { data } = await searchMenu(search || "", (page - 1) * 20, 20)
            const filtered = data.menus.filter(m => !recommended.some(r => r.menu_id === m.id))

            return {
                options: filtered.map(m => ({ value: m.id, label: m.name })),
                hasMore: (page * 20) < data.total,
                additional: { page: page + 1 }
            }
        } catch {
            return { options: [], hasMore: false, additional: { page: 1 } }
        }
    }


    const resetDropdown = () => {
        setDropdownKey(prev => prev + 1)
        setSelected(null)
    }

    const handleCreate = async () => {
        if (!selected) return toast.warning("กรุณาเลือก menu")
        if (loading) return
        if (recommended.length >= 4) return toast.warning("เพิ่มได้สูงสุด 4")

        try {
            setLoading(true)
            await createRecommended({ menu_id: selected.value })
            await getRecommended()
            resetDropdown()
            toast.success("เพิ่มเมนูแล้ว")
        } catch {
            toast.error("เกิดข้อผิดพลาด")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        await deleteRecommended(id)
        await getRecommended()
        setDropdownKey(prev => prev + 1)
    }

    const sortedRecommended = [...recommended].sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    )


    return (
        <section className="header-recommendem">
            <main className="main-recom">

                <div className="con-title-recom">
                    <h2 className="title-recom">Recommended Manager</h2>
                </div>

                <div className="con-recom">
                    <h3 className="title-create-recom">Create Recommended</h3>
                    <div className="form-create-recom">
                        <AsyncPaginate
                            key={dropdownKey}
                            defaultOptions
                            cacheOptions={false}
                            className="s-menu"
                            loadOptions={loadOptions}
                            value={selected}
                            onChange={setSelected}
                            additional={{ page: 1 }}
                            debounceTimeout={300}
                            placeholder="ค้นหา menu..."
                            noOptionsMessage={() => "ไม่พบเมนู"}
                            loadingMessage={() => "กำลังค้นหา..."}
                            closeMenuOnSelect
                        />
                        <button
                            type="button"
                            disabled={loading}
                            onClick={handleCreate}
                            className="btn-submit-recom"
                        >
                            {loading ? "Creating..." : "Create"}
                        </button>
                    </div>
                </div>

                <table className="main-table-recom">
                    <thead className="head-table-recom">
                        <tr className="list-table-recom">
                            <th>img</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody className="body-table-category">
                        {sortedRecommended.map((item) => (
                            <tr className="list-table-recom" key={item.id}>
                                <td className="p-table-recom">
                                    <img
                                        src={item.menu?.image_url}
                                        alt={item.menu.name}
                                        style={{ width: "50px", borderRadius: "5px" }}
                                    />
                                </td>
                                <td className="p-table-recom">{item.menu.name}</td>
                                <td className="p-table-recom">{item.menu.price}</td>
                                <td className="p-table-recom">{item.menu.category?.name}</td>
                                <td className="p-table-recom">
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item.id)}
                                        className="btn-delete-recom"
                                    >
                                        <RiDeleteBin5Fill />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </main>
        </section>
    )
}

export default Recommended

