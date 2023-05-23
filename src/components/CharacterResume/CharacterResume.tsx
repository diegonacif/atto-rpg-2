import { useContext, useEffect, useState } from 'react';
import charImg from '../../assets/charIcons/faceless.png';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { PointsResumeContext } from '../../contexts/PointsResumeProvider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase-config';

import '../../App.scss';

interface ICoreInfoData {
  name: string;
  gender: string;
  xp: number;
  age: number;
  height: number;
  weight: number;
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
  })

  console.log(coreInfoData);
  
  // const [charName, setCharName] = useState("");
  // const [charGender, setCharGender] = useState("");
  // const [experienceValue, setExperienceValue] = useState(0);
  // const [charAge, setCharAge] = useState(0);
  // const [charHeight, setCharHeight] = useState(0);
  // const [charWeight, setCharWeight] = useState(0);

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
          }
        );
        // setCharName(data.name);
        // setCharGender(data.gender);
        // setExperienceValue(data.xp);
        // setCharAge(data.age);
        // setCharHeight(data.height);
        // setCharWeight(data.weight);
      }
    };
    getCharacterData();
  }, [])
  
  return (
    <div className="character-resume-container">
      <div className="text-wrapper">
        <span>Nome: {coreInfoData?.name}</span>
        <span>Gênero: 
          {
            coreInfoData?.gender === 'male' ?
            ' Masculino' :
            coreInfoData?.gender === 'female' ?
            ' Feminino' :
            ''
          }
        </span>
        <span>Experiência: {coreInfoData?.xp}</span>
      </div>
      <div className="image-wrapper">
        <img src={charImg} alt="character image" />
      </div>
      <div className="text-wrapper">
        <span>Idade: {coreInfoData?.age}</span>
        <span>Altura: {coreInfoData?.height}</span>
        <span>Peso: {coreInfoData?.weight}</span>
      </div>
    </div>
  )
}
