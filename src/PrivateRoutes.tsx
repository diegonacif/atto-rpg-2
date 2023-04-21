import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom";
import { AuthGoogleContext } from "./contexts/AuthGoogleProvider";

export const PrivateRoutes = () => {
  const { isSignedIn, isLoading, userCredential } = useContext(AuthGoogleContext);
  
  console.log( isSignedIn )

  return isLoading ?
  null :
  userCredential !== undefined ? <Outlet /> : <Navigate to="/" />;

}