import { User } from '@phosphor-icons/react'

import diceImg from '../../assets/d6-dice.png';

export const Header = () => {
  return (
    <div className="header-container">
      <div className="title-wrapper">
        <h2>Atto RPG</h2>
        <img src={diceImg} alt="d6 dice" id="d6-dice" />
      </div>
      <div className="user-wrapper">
        <User size={32} weight="duotone" />
      </div>
    </div>
  )
}
