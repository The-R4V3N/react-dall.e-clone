import React from 'react'
import ReactDOM from 'react-dom/client'
// import './dark-mode.css' // This is for the future dark mode feature (not yet implemented)
import './index.css'
import App from './App'

// This is for the future dark mode feature (not yet implemented)
// Check if the theme is set to "dark" in localStorage
// const isDarkMode = localStorage.getItem("theme") === "dark"



const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
