import { useContext, useEffect, useState } from 'react';
import charImg from '../../assets/charIcons/faceless.png';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { PointsResumeContext } from '../../contexts/PointsResumeProvider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase-config';

import faceless from '../../assets/charIcons/faceless.png';
import male01 from '../../assets/charIcons/male01.png';
import male02 from '../../assets/charIcons/male02.png';
import male03 from '../../assets/charIcons/male03.png';
import male04 from '../../assets/charIcons/male04.png';
import female01 from '../../assets/charIcons/female01.png';
import female02 from '../../assets/charIcons/female02.png';
import female03 from '../../assets/charIcons/female03.png';
import female04 from '../../assets/charIcons/female04.png';

import '../../App.scss';

interface ICoreInfoData {
  name: string;
  gender: string;
  xp: number;
  age: number;
  height: number;
  weight: number;
  face: string;
}

export const CharacterResume = () => {
  const { userId } = useContext(AuthGoogleContext);
  const { characterIdSession } = useContext(PointsResumeContext);
  const coreInfoRef = doc(db, "users", userId, "characters", characterIdSession ? characterIdSession : "");
  
  const [coreInfoData, setCoreInfoData] = useState<ICoreInfoData>({
    name: "",
    gender: "",
    xp: 0,
    age: 0,
    height: 0,
    weight: 0,
    face: ""
  })

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
            height: data.height,
            weight: data.weight,
            face: data.face
          }
        );
      }
    };
    getCharacterData();
  }, [])

  const faceMapping: {[key: string]: string} = {
    male01: male01,
    male02: male02,
    male03: male03,
    male04: male04,
    female01: female01,
    female02: female02,
    female03: female03,
    female04: female04,
  };
  
  return (
    <div className="character-resume-container">
      <div className="text-wrapper">
        <div className="text-row">
          <label htmlFor="">Nome</label>
          <span>{coreInfoData?.name}</span>
        </div>
        <div className="text-row">
          <label htmlFor="">Gênero</label>
          <span>
            {
              coreInfoData?.gender === 'male' ?
              ' Masculino' :
              coreInfoData?.gender === 'female' ?
              ' Feminino' :
              ''
            }
          </span>
        </div>
        <div className="text-row">
          <label htmlFor="">Experiência</label>
          <span>{coreInfoData?.xp}</span>
        </div>
      </div>

      <div className="image-wrapper">
        <img src={faceMapping[coreInfoData?.face] || faceless} alt="character image" />
      </div>
      
      <div className="text-wrapper">
        <div className="text-row">
          <label htmlFor="">Idade</label>
          <span>{coreInfoData?.age}</span>
        </div>
        <div className="text-row">
          <label htmlFor="">Altura</label>
          <span>{coreInfoData?.height}</span>
        </div>
        <div className="text-row">
          <label htmlFor="">Peso</label>
          <span>{coreInfoData?.weight}</span>
        </div>
      </div>
    </div>
  )
}
