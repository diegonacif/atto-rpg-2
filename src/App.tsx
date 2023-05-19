import { Outlet } from 'react-router-dom'
import { Header } from './components/Header/Header'

import './App.scss'

export const App = () => {

  return (
    <div className="App">
      <Header />
      <Outlet />
    </div>
  )
}
