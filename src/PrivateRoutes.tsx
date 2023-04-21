import { useContext } from "react"
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthGoogleContext } from "./contexts/AuthGoogleProvider";

export const PrivateRoutes = () => {
  const { isSignedIn, isLoading, userCredential } = useContext(AuthGoogleContext);

  console.log({
    isSignedIn: isSignedIn,
    isLoading: isLoading,
    userCredential: userCredential
  })

  if(isLoading) {
    return null;
  } else {
    return userCredential ? <Outlet /> : <Navigate to="/" />;
  }
}