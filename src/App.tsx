import { Outlet } from 'react-router-dom'
import './App.scss'
import { Attributes } from './components/Attributes/Attributes'
import { Header } from './components/Header/Header'
import { Menu } from './components/Menu/Menu'
import { Perks } from './components/Perks/Perks'

export const App = () => {

  return (
    <div className="App">
      <Header />
      <Outlet />
    </div>
  )
}
