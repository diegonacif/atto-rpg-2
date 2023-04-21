import { useContext } from 'react';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';

export const Login = () => {
  const { 
    handleGoogleSignIn, 
    handleGoogleSignOut, 
    isSignedIn,
    signed, 
  } = useContext(AuthGoogleContext);
  
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <button onClick={() => handleGoogleSignIn()}>Login com Google</button>
      </div>
    </div>
  )
}
