import { useState } from 'react'
import { Menu } from '../Menu/Menu'
import { Outlet, useNavigate } from 'react-router-dom'
import { PointsResume } from '../PointsResume/PointsResume';
import { CharacterResume } from '../CharacterResume/CharacterResume';
import { TrendUp, UserList, YinYang } from '@phosphor-icons/react';

export const Character = () => {
  const navigate = useNavigate();
  const [currentFlip, setCurrentFlip] = useState('points-resume');
  return (
    <div className="character-container">
      <header className="character-header">
        {/* <button 
          className="back-button"
          onClick={() => navigate("/home")}
        >
          Voltar
        </button> */}
        {
          currentFlip === 'character-resume' ?
          <CharacterResume /> :
          currentFlip === 'points-resume' ?
          <PointsResume /> :
          currentFlip === 'perks-and-flaws-resume' ?
          <h1>Perks'n'Flaws</h1> :
          null
        }
        <div className="nav-menu">
          <UserList size={32} weight="duotone" onClick={() => setCurrentFlip('character-resume')}/>
          <YinYang size={32} weight="duotone" onClick={() => setCurrentFlip('perks-and-flaws-resume')}/>
          <TrendUp size={32} weight="duotone" onClick={() => setCurrentFlip('points-resume')}/>
        </div>
      </header>
      <Menu />
      <Outlet />
    </div>
  )
}
