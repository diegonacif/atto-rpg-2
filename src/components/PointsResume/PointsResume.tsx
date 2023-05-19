import { useContext } from 'react';
import { PointsResumeContext } from '../../contexts/PointsResumeProvider';

import '../../App.scss';

export const PointsResume = () => {
  const { 
    attributesSum,
    perksSum,
    flawsSum,
    skillsSum
  } = useContext(PointsResumeContext)
  return (
    <div className="points-resume-container">
      <span>Atributos: {attributesSum}</span>
      <span>Vantagens: {perksSum}</span>
      <span>Desvantagens: {flawsSum}</span>
      <span>Perícias: {skillsSum}</span>
    </div>
  )
}
