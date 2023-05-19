import { useContext } from 'react';
import { PointsResumeContext } from '../../contexts/PointsResumeProvider';

import '../../App.scss';

export const PointsResume = () => {
  const { 
    attributesSum,
    perksSum 
  } = useContext(PointsResumeContext)
  return (
    <div className="points-resume-container">
      <span>Atributos: {attributesSum}</span>
      <span>Vantagens: {perksSum}</span>
      <span>Desvantagens: 0</span>
      <span>Perícias: 0</span>
    </div>
  )
}
