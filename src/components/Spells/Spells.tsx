import React from 'react';
import '../../App.scss';

export const Spells = () => {
  return (
    <div className="spells-container">
      <div className="spells-row-title">
        <span className="spells-row-title-item">Descrição</span>
        <span className="spells-row-title-item">Mod</span>
        <span className="spells-row-title-item">NH</span>
        <span className="spells-row-title-item">Pontos</span>
      </div>

      <div className="skills-row" key={`skill`}>
        <span onClick={() => console.log("abrir modal")} id="skill-name">uma descrição</span>
        <span id="skill-level">0</span>
        <span id="skill-points">12</span>
        <span id="skill-points">4</span>
      </div>
      <div className="skills-row" key={`skill`}>
        <span onClick={() => console.log("abrir modal")} id="skill-name">uma descrição</span>
        <span id="skill-level">0</span>
        <span id="skill-points">12</span>
        <span id="skill-points">4</span>
      </div>

      <button onClick={() => console.log("open modal")} id="new-spell-button">
        <span className="yellow-span">Nova magia</span>
      </button>
    </div>
  )
}
