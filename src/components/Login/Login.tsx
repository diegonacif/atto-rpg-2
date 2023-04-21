import { useContext, useEffect } from 'react';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const { 
    handleGoogleSignIn, 
    handleGoogleSignOut, 
    isSignedIn,
    signed, 
    userCredential,
  } = useContext(AuthGoogleContext);

  const navigate = useNavigate();

  // Back to main page when logged in
  useEffect(() => {
    userCredential ?
    navigate("/home") :
    null
  }, [userCredential]);
  
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <button onClick={() => handleGoogleSignIn()}>Login com Google</button>
      </div>
    </div>
  )
}
