import './App.scss'
import { Attributes } from './components/Attributes/Attributes'
import { Header } from './components/Header/Header'
import { Menu } from './components/Menu/Menu'

function App() {

  return (
    <div className="App">
      <Header />
      <Menu />
      <Attributes />
    </div>
  )
}

export default App
