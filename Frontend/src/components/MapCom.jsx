import React from 'react'
import "../styles/Map.css"

const MapCom = () => {
  return (
    <>
      <section className="header-map">
        <main className="main-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15934872.713756554!2d90.81018112174658!3d12.820659186025276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304d8df747424db1%3A0x9ed72c880757e802!2z4Lib4Lij4Liw4LmA4LiX4Lio4LmE4LiX4Lii!5e0!3m2!1sth!2sus!4v1776697966543!5m2!1sth!2sus"
            className='map'
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          />
        </main>
      </section>
      <footer className="footer-map">
        <div className="h4 title footer">Cafe Map</div>
      </footer>
    </>
  )
}

export default MapCom