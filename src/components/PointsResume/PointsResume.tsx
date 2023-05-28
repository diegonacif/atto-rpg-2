import { useContext, useEffect, useState } from 'react';
import { PointsResumeContext } from '../../contexts/PointsResumeProvider';
import { Lock, LockOpen } from '@phosphor-icons/react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import { useParams } from 'react-router-dom';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import blankOrb from '../../assets/blank-orb.png';

import '../../App.scss';

interface ICoreInfoData {
  name: string;
  gender: string;
  xp: number;
  age: number;
  weight: number;
  height: number;
  face: string;
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
    gender: "",
    xp: 0,
    age: 0,
    weight: 0,
    height: 0,
    face: ""
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
            gender: data.gender,
            xp: data.xp,
            age: data.age,
            weight: data.weight,
            height: data.height,
            face: data.face
          }
        );
        setXp(data.xp);
      }
    };
    getCharacterData();
  }, [isXpLocked])

  console.log(coreInfoData);

  const handleLockXp = async () => {
    try {
      await setDoc(coreInfoRef, {
        name: coreInfoData.name,
        gender: coreInfoData.gender,
        xp: xp,
        age: coreInfoData.age,
        weight: coreInfoData.weight,
        height: coreInfoData.height,
        face: coreInfoData.face
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
        {/* <span>Total: {(attributesSum + perksSum + skillsSum) - flawsSum}</span> */}
        <div className="categories-sum-inner">
          <span>Atributos: {attributesSum}</span>
          <span>Perícias: {skillsSum}</span>
          <span>Vantagens: {perksSum}</span>
          <span>Desvantagens: {flawsSum}</span>
        </div>
        <div className="blank-orb-wrapper">
          {/* <img src={blankOrb} alt="remaining points" id="remaining-points"/> */}
          <input type="number" name="points-left" id="points-left" value={isNaN(pointsLeft) ? 0 : pointsLeft } readOnly />
        </div>
      </section>
      <section className="points-resume-input-wrapper">
        <div className="input-row">
          <label htmlFor="experience-points">Pontos de Experiência</label>
          {
            isXpLocked ?
            <div className="input-wrapper">
              <input 
                type="number" 
                name="experience-points" 
                value={xp} 
                readOnly 
              />
              <Lock size={22} weight="duotone" id="xp-locker" onClick={() => setIsXpLocked(false)} />
            </div> :
            <div className="input-wrapper">
              <input 
                type="number" 
                name="experience-points"
                value={xp}
                onChange={(e) => setXp(Number(e.target.value))}
              />
              <LockOpen size={22} weight="duotone" id="xp-locker" onClick={() => handleLockXp()} />
            </div>
          }
        </div>
        <div className="input-row">
          <label htmlFor="points-left">Soma Total</label>
          <div className="input-wrapper">
            <input type="number" name="points-left" value={(attributesSum + perksSum + skillsSum) - flawsSum} readOnly />
          </div>
        </div>
      </section>
    </div>
  )
}
