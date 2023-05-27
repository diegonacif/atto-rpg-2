import { useContext, useState } from 'react';
import { User } from '@phosphor-icons/react'
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { useNavigate } from 'react-router-dom';

import diceImg from '../../assets/d6-dice-green.png';
import avatarFrame from '../../assets/avatar-frame.png';

export const Header = () => {
  
  const [imgError, setImgError] = useState(false);

  const { 
    handleGoogleSignIn, 
    handleGoogleSignOut, 
    isSignedIn,
    signed, 
    userPhotoUrl
  } = useContext(AuthGoogleContext);

  const navigate = useNavigate();

  return (
    <div className="header-container">
      <div className="title-wrapper" onClick={() => navigate("/home")}>
        <h2>Atto RPG</h2>
        <img src={diceImg} alt="d6 dice" id="d6-dice" />
        
      </div>
      <div className="avatar-frame-wrapper">

        <div className="user-wrapper" onClick={() => handleGoogleSignOut()}>
          {!imgError && <img src={userPhotoUrl} alt="" onError={() => setImgError(true)} />}
          {imgError && <User onClick={() => handleGoogleSignOut()} size={32} weight="duotone" />}
          <img src={avatarFrame} alt="avatar frame" id="avatar-frame" />
        </div>
      </div>
    </div>
  )
}
