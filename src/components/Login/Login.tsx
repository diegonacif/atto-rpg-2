import { useContext, useEffect } from 'react';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { useNavigate } from 'react-router-dom';
import { AiFillGoogleCircle } from 'react-icons/ai';
import greenVideo from '../../assets/green-video.mp4';
import diceImg from '../../assets/d6-dice-green.png';

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
      <video id="background-video" loop autoPlay muted>
        <source src={greenVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="hexagon">
        <div className="title-wrapper" onClick={() => navigate("/home")}>
          <h2>Atto RPG</h2>
          <img src={diceImg} alt="d6 dice" id="d6-dice" />
        </div>
      </div>
      <h3>Faça login com sua conta Google</h3>
      <div 
        className="login-wrapper"
        onClick={() => handleGoogleSignIn()}
      >
        <AiFillGoogleCircle id="google-logo" size={'1.5rem'} />
        <span>Continuar com Google</span>
        {/* <button onClick={() => handleGoogleSignIn()}>Continuar com Google</button> */}
      </div>
    </div>
  )
}
