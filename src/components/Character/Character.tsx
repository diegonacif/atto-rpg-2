import { useEffect, useState } from 'react'
import { Menu } from '../Menu/Menu'
import { Outlet } from 'react-router-dom'
import { PointsResume } from '../PointsResume/PointsResume';
import { CharacterResume } from '../CharacterResume/CharacterResume';
import { CaretCircleDown, CaretCircleUp, TrendUp, UserList, YinYang } from '@phosphor-icons/react';
import Collapsible from 'react-collapsible';
import { PerksFlawsResume } from '../PerksFlawsResume/PerksFlawsResume';
import { Footer } from '../Footer/Footer';
import greenVideo from '../../assets/green-video.mp4';
import greenVideoTumb from '../../assets/green-video-tumb.png';

import '../../App.scss';

export const Character = () => {
  const [currentFlip, setCurrentFlip] = useState('character-resume');
  const [isHeaderOpen, setIsHeaderOpen] = useState(true);

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
          {
            shouldUseImage ?
            <img src={greenVideoTumb} alt="" id="background-video" /> :
            <div dangerouslySetInnerHTML={{ __html: `
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
          <div className="video-glass"></div>
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
            <div className={`menu-item-wrapper ${currentFlip === 'character-resume' ? 'selected-menu' : ''}`}>
              <UserList className={`character-menu`} size={32} weight="duotone" onClick={() => setCurrentFlip('character-resume')}/>
            </div>
            <div className={`menu-item-wrapper ${currentFlip === 'perks-and-flaws-resume' ? 'selected-menu' : ''}`}>
              <YinYang className="perks-and-flaws-menu" size={32} weight="duotone" onClick={() => setCurrentFlip('perks-and-flaws-resume')}/>
            </div>
            <div className={`menu-item-wrapper ${currentFlip === 'points-resume' ? 'selected-menu' : ''}`}>
              <TrendUp className="points-menu" size={32} weight="duotone" onClick={() => setCurrentFlip('points-resume')}/>
            </div>
          </div>
        </header>
      </Collapsible>
      
      <Menu />
      <Outlet />
      <Footer />
    </div>
  )
}
