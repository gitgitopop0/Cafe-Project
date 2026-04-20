import React from 'react'
import AppRouter from './AppRouter'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  )
}

export default App