import { useContext, useEffect, useRef, useState } from 'react';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { useNavigate } from 'react-router-dom';
import { AiFillGoogleCircle } from 'react-icons/ai';
import greenVideo from '../../assets/green-video.mp4';
import greenVideoTumb from '../../assets/green-video-tumb.png';
import diceImg from '../../assets/d6-dice-green.png';

export const Login = () => {
  const { 
    handleGoogleSignIn, 
    userCredential,
  } = useContext(AuthGoogleContext);

  const navigate = useNavigate();

  // Back to main page when logged in
  useEffect(() => {
    userCredential ?
    navigate("/home") :
    null
  }, [userCredential]);

  // Video when in Safari
  const isSafari = () => {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("safari") > -1 && ua.indexOf("chrome") < 0;
  };

  const [shouldUseImage, setShouldUseImage] = useState(true);

  useEffect(() => {
    if (isSafari()) {
      setShouldUseImage(true);
    } else {
      setShouldUseImage(false);
    }
  }, []);
  
  return (
    <div className="login-container">
      {
        shouldUseImage ? 
        <div className="video-wrapper">
          <img src={greenVideoTumb} alt="" id="background-video" />
        </div> :
        <div className="video-wrapper" dangerouslySetInnerHTML={{ __html: `
          <video
            loop
            muted
            autoplay
            playsinline
            id="background-video"
          >
          <source src="${greenVideo}" type="video/mp4" />
          </video>
        ` }}></div>
      }
      <div className="hexagon">
        <div className="title-wrapper">
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
      </div>
    </div>
  )
}
