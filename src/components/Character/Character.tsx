import React from 'react'
import { Menu } from '../Menu/Menu'
import { Outlet } from 'react-router-dom'

export const Character = () => {
  return (
    <div className="character-container">
      <Menu />
      <Outlet />
    </div>
  )
}
