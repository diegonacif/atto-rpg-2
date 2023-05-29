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
import { Character } from './components/Character/Character';
import { CharSelector } from './components/CharSelector/CharSelector';
import { CharactersProvider } from './contexts/CharactersProvider';
import { PointsResumeProvider } from './contexts/PointsResumeProvider';
import { ToastifyProvider } from './contexts/ToastifyProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthGoogleProvider>
      <ToastifyProvider>
        <PointsResumeProvider>
          <Routes>
            <Route path={"/"} element={<Login />} />
            <Route element={<PrivateRoutes />}>
              <Route path={"home"} element={<App />}>
                <Route index element={<CharSelector />} />
                <Route path={"character/:id"} element={<Character />}>
                  <Route index element={<Attributes />} />
                  <Route path={"perks"} element={<Perks />} />
                  <Route path={"flaws"} element={<Flaws />} />
                  <Route path={"skills"} element={<Skills />} />
                  <Route path={"equips"} element={<Equips />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </PointsResumeProvider>
      </ToastifyProvider>
    </AuthGoogleProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
