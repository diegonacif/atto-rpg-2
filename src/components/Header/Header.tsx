import { User } from '@phosphor-icons/react'

import diceImg from '../../assets/d6-dice.png';
import { useContext, useState } from 'react';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { PointsResumeContext } from '../../contexts/PointsResumeProvider';

export const Header = () => {
  const { attributesSum } = useContext(PointsResumeContext)
  const [imgError, setImgError] = useState(false);

  const { 
    handleGoogleSignIn, 
    handleGoogleSignOut, 
    isSignedIn,
    signed, 
    userPhotoUrl
  } = useContext(AuthGoogleContext);

  return (
    <div className="header-container">
      <div className="title-wrapper">
        <h2>Atto RPG</h2>
        <img src={diceImg} alt="d6 dice" id="d6-dice" />
        <span>attributes: {attributesSum}</span>
      </div>
      <div className="user-wrapper" onClick={() => handleGoogleSignOut()}>
        {!imgError && <img src={userPhotoUrl} alt="" onError={() => setImgError(true)} />}
        {imgError && <User onClick={() => handleGoogleSignOut()} size={32} weight="duotone" />}
      </div>
    </div>
  )
}
