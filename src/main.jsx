import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css' // <-- Importamos nuestros estilos
import 'bootstrap/dist/css/bootstrap.min.css' // <-- Importamos Bootstrap (opcional para grillas)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)