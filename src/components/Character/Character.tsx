import { useState } from 'react'
import { Menu } from '../Menu/Menu'
import { Outlet } from 'react-router-dom'
import { PointsResume } from '../PointsResume/PointsResume';
import { CharacterResume } from '../CharacterResume/CharacterResume';
import { CaretCircleDown, CaretCircleUp, TrendUp, UserList, YinYang } from '@phosphor-icons/react';
import Collapsible from 'react-collapsible';
import { PerksFlawsResume } from '../PerksFlawsResume/PerksFlawsResume';
import { Footer } from '../Footer/Footer';

import '../../App.scss';

export const Character = () => {
  const [currentFlip, setCurrentFlip] = useState('character-resume');
  const [isHeaderOpen, setIsHeaderOpen] = useState(true);

  return (
    <div className="character-container">
      <Collapsible 
        trigger={
          isHeaderOpen ?
          <CaretCircleUp 
            size={28} 
            weight="fill" 
            className="open-close-character-header"
            onClick={() => setIsHeaderOpen(false)}
          /> :
          <CaretCircleDown 
            size={28} 
            weight="fill" 
            className="open-close-character-header"
            onClick={() => setIsHeaderOpen(true)}
          />
        }
        open={true}
        easing="ease"
        transitionTime={500}
      >
        <header className="character-header">
          <section className="character-header-content">
            {
              currentFlip === 'character-resume' ?
              <CharacterResume /> :
              currentFlip === 'points-resume' ?
              <PointsResume /> :
              currentFlip === 'perks-and-flaws-resume' ?
              <PerksFlawsResume /> :
              null
            }
          </section>
          <div className="nav-menu">
            <UserList size={32} weight="duotone" onClick={() => setCurrentFlip('character-resume')}/>
            <YinYang size={32} weight="duotone" onClick={() => setCurrentFlip('perks-and-flaws-resume')}/>
            <TrendUp size={32} weight="duotone" onClick={() => setCurrentFlip('points-resume')}/>
          </div>
        </header>
      </Collapsible>
      
      <Menu />
      <Outlet />
      <Footer />
    </div>
  )
}
