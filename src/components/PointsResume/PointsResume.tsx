import { useContext, useEffect, useState } from 'react';
import { PointsResumeContext } from '../../contexts/PointsResumeProvider';
import { Lock, LockOpen } from '@phosphor-icons/react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import { useParams } from 'react-router-dom';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';

import '../../App.scss';

interface ICoreInfoData {
  name: string;
  xp: number;
}

export const PointsResume = () => {
  const { userId } = useContext(AuthGoogleContext);
  const { 
    attributesSum,
    perksSum,
    flawsSum,
    skillsSum,
    characterIdSession
  } = useContext(PointsResumeContext);
  const coreInfoRef = doc(db, "users", userId, "characters", characterIdSession ? characterIdSession : "");
  
  const [coreInfoData, setCoreInfoData] = useState<ICoreInfoData>({
    name: "",
    xp: 0
  })
  const [xp, setXp] = useState(0);
  const [pointsLeft, setPointsLeft] = useState(0);
  const [isXpLocked, setIsXpLocked] = useState(true); 

  // Points left update
  useEffect(() => {
    const costs = (attributesSum + perksSum + skillsSum) - flawsSum
    setPointsLeft(xp - costs)
  }), [attributesSum, perksSum, skillsSum, flawsSum, xp];

  // Getting Character Data
  useEffect(() => {
    const getCharacterData = async () => {
      const querySnapshot = await getDoc(coreInfoRef);
      const data = querySnapshot.data();
      if(data) {
        setCoreInfoData(
          {
            name: data.name,
            xp: data.xp
          }
        );
        setXp(data.xp);
      }
    };
    getCharacterData();
  }, [isXpLocked])

  const handleLockXp = async () => {
    try {
      await setDoc(coreInfoRef, {
        name: coreInfoData.name,
        xp: xp
      })
      .then(() => {
        setIsXpLocked(true);
        console.log("xp atualizado com sucesso!")
      })
    } catch (error) {
      console.log("erro ao atualizar xp: ", error)
    }
  };

  return (
    <div className="points-resume-container">
      
      <section className="categories-sum-wrapper">
        <span>Total: {(attributesSum + perksSum + skillsSum) - flawsSum}</span>
        <span>Atributos: {attributesSum}</span>
        <span>Vantagens: {perksSum}</span>
        <span>Desvantagens: {flawsSum}</span>
        <span>Perícias: {skillsSum}</span>
      </section>
      <section className="points-resume-input-wrapper">
        <div className="input-row">
          <label htmlFor="experience-points">Pontos de Experiência</label>
          {
            isXpLocked ?
            <>
              <input 
                type="number" name="experience-points" value={xp} readOnly />
              <Lock size={24} weight="duotone" id="xp-locker" onClick={() => setIsXpLocked(false)} />
            </> :
            <>
              <input 
                type="number" 
                name="experience-points"
                value={xp}
                onChange={(e) => setXp(Number(e.target.value))}
              />
              <LockOpen size={24} weight="duotone" id="xp-locker" onClick={() => handleLockXp()} />
            </>
          }
        </div>
        <div className="input-row">
          <label htmlFor="points-left">Pontos disponíveis</label>
          <input type="number" name="points-left" value={isNaN(pointsLeft) ? 0 : pointsLeft } readOnly />
        </div>
      </section>
    </div>
  )
}
