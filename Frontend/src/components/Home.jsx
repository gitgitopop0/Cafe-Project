import React, { useEffect, useRef, useState } from 'react'
import "../styles/Home.css"
import useCafeStore from '../store/cafe_store'

const Home = () => {
    const { recommended, getRecommended } = useCafeStore()
    const [currentIndex, setCurrentIndex] = useState(0)
    const timerRef = useRef(null)

    useEffect(() => {
        getRecommended()
    }, [])

    const resetTimer = () => {
        clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            setCurrentIndex(prev =>
                prev === recommended.length - 1 ? 0 : prev + 1
            )
        }, 3000)
    }

    useEffect(() => {
        if (recommended.length === 0) return
        resetTimer()
        return () => clearInterval(timerRef.current)
    }, [recommended.length])

    const handlePrev = () => {
        setCurrentIndex(prev => prev === 0 ? recommended.length - 1 : prev - 1)
        resetTimer()
    }

    const handleNext = () => {
        setCurrentIndex(prev => prev === recommended.length - 1 ? 0 : prev + 1)
        resetTimer()
    }

    return (
        <>
            <section className="header-home">
                <p className="section-label">featured menu</p>
                <div className="slider-con">
                    {recommended.map((item, i) => (
                        <div key={item.id} className={`slide ${i === currentIndex ? 'active' : ''}`}>
                            <img src={item.menu.image_url} alt={item.menu.name} className="slider-img" />
                            <div className="slide-overlay" />
                            <div className="slide-info">
                                <span className="slide-badge">Recommended</span>
                                <div className="slide-name">{item.menu.name}</div>
                                <div className="slide-price">{parseFloat(item.menu.price).toFixed(2)} ฿</div>
                            </div>
                        </div>
                    ))}
                    <button className="nav-btn nav-prev" onClick={handlePrev}>&#8249;</button>
                    <button className="nav-btn nav-next" onClick={handleNext}>&#8250;</button>
                    <div className="slider-dots">
                        {recommended.map((_, i) => (
                            <span
                                key={i}
                                className={`dot ${i === currentIndex ? 'active' : ''}`}
                                onClick={() => { setCurrentIndex(i); resetTimer() }}
                            />
                        ))}
                    </div>
                </div>
                <div className="slider-card">
                    {recommended.map((item, i) => (
                        <div key={item.id} className={`main-card-sli ${i === currentIndex ? 'active' : ''}`}
                            onClick={() => { setCurrentIndex(i); resetTimer() }} >
                            <img src={item.menu.image_url} alt="" className="card-sli-img" />
                        </div>
                    ))}
                </div>
            </section>
            <footer className="footer-home">
                <a href="https://www.facebook.com/boorapa.youpoung" className="footer-link">Facebook</a>
                <a href="https://www.facebook.com/profile.php?id=61587695670261" className="footer-link">Page</a>
            </footer>
        </>
    )
}

export default Home