import React from 'react'
import { Menu } from '../Menu/Menu'
import { Outlet, useNavigate } from 'react-router-dom'

export const Character = () => {
  const navigate = useNavigate();
  return (
    <div className="character-container">
      <button 
        style={{ marginLeft: "3rem", padding: "0.25rem 0.5rem", backgroundColor: "#D1D5DB", borderRadius: "4px" }} 
        onClick={() => navigate("/home")}
      >
        Voltar
      </button>
      <Menu />
      <Outlet />
    </div>
  )
}
