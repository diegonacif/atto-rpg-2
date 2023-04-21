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
import { Flaws } from './components/Flaws/Flaws';
import { Skills } from './components/Skills/Skills';
import { Equips } from './components/Equips/Equips';
import { Login } from './components/Login/Login';
import { AuthGoogleProvider } from './contexts/AuthGoogleProvider';
import { PrivateRoutes } from './PrivateRoutes';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthGoogleProvider>
      <Routes>
        <Route path={"/"} element={<Login />} />
        <Route element={<PrivateRoutes />} />
      </Routes>
    </AuthGoogleProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
