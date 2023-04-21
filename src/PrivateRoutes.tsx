import { useContext } from "react"
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthGoogleContext } from "./contexts/AuthGoogleProvider";
import { Attributes } from "./components/Attributes/Attributes";
import { Perks } from "./components/Perks/Perks";
import { Flaws } from "./components/Flaws/Flaws";
import { Skills } from "./components/Skills/Skills";
import { Equips } from "./components/Equips/Equips";
import { App } from "./App";

export const PrivateRoutes = () => {
  const { isSignedIn, isLoading, userCredential } = useContext(AuthGoogleContext);
  
  console.log( isSignedIn )

  return isLoading ?
  null :
    <Routes>
      <Route path="home" element={<App />}>
        <Route index element={<Attributes />} />
        <Route path="perks" element={<Perks />} />
        <Route path="flaws" element={<Flaws />} />
        <Route path="skills" element={<Skills />} />
        <Route path="equips" element={<Equips />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>

}