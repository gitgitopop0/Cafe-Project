import React, { useEffect, useMemo, useState } from 'react'
import "../styles/MenuPage.css"
import { FaSearch } from "react-icons/fa"
import useCafeStore from '../store/cafe_store'

const MenuUser = () => {

    const { listMenu, menus, menuLimit, menuSkip, menuTotal, categories, fetchCategories } = useCafeStore()

    const [searchText, setSearchText] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [selectedMenu, setSelectedMenu] = useState(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchText)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchText])

    useEffect(() => {
        listMenu(0, menuLimit, debouncedSearch)
    }, [debouncedSearch])

    useEffect(() => {
        fetchCategories()
    }, [])

    const sortedMenu = useMemo(() =>
        [...menus].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at))
            .filter(item =>
                selectedCategory === '' || item.category_id === Number(selectedCategory)
            )
        , [menus, selectedCategory])

    const handleNext = async () => {
        const nextSkip = menuSkip + menuLimit

        if (nextSkip >= menuTotal) return

        try {
            await listMenu(nextSkip, menuLimit, debouncedSearch)
        } catch (error) {
            console.log(error)
        }
    }

    const handlePrev = async () => {
        const prevSkip = Math.max(0, menuSkip - menuLimit)

        try {
            await listMenu(prevSkip, menuLimit, debouncedSearch)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <section className="header-menu">
                <main className="main-menu">
                    <div className="con-s-menu">
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="category-list-menu">
                            <option className='option-category-listmenu' value="">-- category --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <form onSubmit={(e) => e.preventDefault()} className="input-s-menu">
                            <input onChange={(e) => setSearchText(e.target.value)} className='s-list-menu' type="text" placeholder="ค้นหาเมนู..." />
                            <button className='btn-sub-mit-s-menu'><FaSearch /></button>
                        </form>
                    </div>
                    <div className="main-card-menu">
                        {sortedMenu.map((item) => (
                            <div key={item.id} className="con-card-menu" onClick={() => setSelectedMenu(item)}>
                                <div className="img-wrapper"><img src={item.image_url} alt="name" className="img-menu" /></div>
                                <div className="card-body">
                                    <h3 className="name-list-menu">{item.name}</h3>
                                    <p className="description-menu">{item.description}</p>
                                    <h4 className="price-menu">{parseFloat(item.price).toFixed(2)} ฿</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                    {menuSkip > 0 && (
                        <div className='main-prev-next-menu'>
                            <button onClick={handlePrev} className='btn-prev-menu'>
                                Prev
                            </button>

                            <span className='page-menu'>
                                Page {Math.floor(menuSkip / menuLimit) + 1}
                            </span>

                            <button onClick={handleNext} className='btn-next-menu'
                            >
                                Next
                            </button>
                        </div>
                    )}
                </main>
            </section>

            <footer className="footer-menu">
                <h4 className="footer-listmenu">---- cafe ----</h4>
            </footer>
            {selectedMenu && (
                <div className="modal-overlay" onClick={() => setSelectedMenu(null)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedMenu(null)}>✕</button>
                        <img src={selectedMenu.image_url} alt={selectedMenu.name} className="modal-img" />
                        <div className="modal-body">
                            <h2 className="modal-name">{selectedMenu.name}</h2>
                            <p className="modal-description">{selectedMenu.description}</p>
                            <h3 className="modal-price">{parseFloat(selectedMenu.price).toFixed(2)} ฿</h3>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default MenuUser