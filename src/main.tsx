import React from 'react'
import ReactDOM from 'react-dom/client'
import  { App } from './App'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Attributes } from './components/Attributes/Attributes';
import { Perks } from './components/Perks/Perks';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<App />}>
          <Route index element={<Attributes />}/>
          <Route path={"perks"} element={<Perks />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
