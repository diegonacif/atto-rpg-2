import React, { useContext, useEffect, useState } from 'react'
import { perksData } from '../../services/gameData';
import { collection, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import { useParams } from 'react-router-dom';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';

interface IPerksData {
  id: string;
  description: string;
  level: number;
  points: number;
}

const PerksRow = ({ perkData }: { perkData: IPerksData }) => {
  const [selectedOption, setSelectedOption] = useState('');
  // const levelPointsCalculator = () => {

  // };
  console.log(perkData)

  return (
    <div className="perks-row">
    {/* <select 
      id="perk-1-name"
      onChange={(e) => setSelectedOption(e.target.value)}
      value={perkData?.description}
    >
      <option value="">Selecione uma vantagem</option>
      {perksData.map((option) => (
        <option key={option.name} value={option.name}>
          {option.name}
        </option>
      ))}
    </select> */}
    <span>{perkData.description}</span>
    <span>{perkData.level}</span>
    <span>{perkData.points}</span>
  </div>
  )
};

export const Perks = () => {
  const { id } = useParams<{ id: string }>();
  const { userId } = useContext(AuthGoogleContext);
  const perksCollectionRef = collection(db, "users", userId, "characters", id ? id : "", "perks")
  const [perksData, setPerksData] = useState<IPerksData[]>([{
    id: "",
    description: "",
    level: 0,
    points: 0,
  }])

  // console.log(perksData)

  // Getting Perks Data
  useEffect(() => {
    const getPerksData = async () => {
      const querySnapshot = await getDocs(perksCollectionRef);
      const docs = querySnapshot.docs.map((doc) => (({ 
        id: doc.id, 
        description: doc.data().description,
        level: doc.data().level,
        points: doc.data().points,
        ...doc.data()
      })));
      setPerksData(docs)
    }
    getPerksData();
  }, [])

  return (
    <div className="perks-container">
      {
        perksData.map((perk) => (
          <PerksRow perkData={perk}/>
        ))
      }
    </div>
  )
};
