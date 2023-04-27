import React, { useContext, useEffect, useState } from 'react'
import { perksData } from '../../services/gameData';
import { collection, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import { useParams } from 'react-router-dom';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import ReactModal from 'react-modal';

import '../../App.scss';

interface IPerksData {
  id: string;
  description: string;
  level: number;
  points: number;
}

interface ILevelPoints {
  [key: number]: number;
}

// PERKS ROW //
const PerksRow = ({ perkData, openModalHandler }: {
  perkData: IPerksData, 
  openModalHandler: (perkData: IPerksData) => void,
}) => {
  const levelPoints: ILevelPoints = {
    1: 5,
    2: 10,
    3: 20,
    4: 30,
    5: 50,
  };

  const calculatePoints = (level: number): number => {
    return levelPoints[level] || 0;
  };

  return (
    <div className="perks-row">
    
    <span onClick={() => openModalHandler(perkData)}>{perkData.description}</span>
    <span>{perkData.level}</span>
    <span>{calculatePoints(perkData.level)}</span>
  </div>
  )
};

// PERKS MODAL //
const PerksModal = ({ currentPerkData }: {currentPerkData: IPerksData}) => {
  const [selectedPerk, setSelectedPerk] = useState(currentPerkData.description);
  const [selectedLevel, setSelectedLevel] = useState(currentPerkData.level)
  const [currentSelectedPerk, setCurrentSelectedPerk] = useState({
    name: "",
    levels: [{}]
  })

  console.log(currentSelectedPerk.levels.map(level => level))

  return (
    <div className="perks-modal">
      <select 
        id="perk-1-name"
        onChange={(e) => {
          const selectedPerk = perksData.find(perk => perk.name === e.target.value);
          setSelectedPerk(e.target.value);
          selectedPerk && setCurrentSelectedPerk(selectedPerk)
        }}
        value={selectedPerk}
      >
        <option value="">Selecione uma vantagem</option>
        {perksData.map((option) => (
          <option key={option.name} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
      <select 
        id="perk-1-level"
        onChange={(e) => setSelectedLevel(Number(e.target.value))}
        value={selectedLevel}
      >
        {currentSelectedPerk ?
          currentSelectedPerk.levels.map((level) => (
            <option key={`${level}`} value={`${level}`}>
              {`${level}`}
            </option>
        )):
        <option value="">Selecione uma vantagem primeiro</option>
      }
      </select>
    </div>
  )
}

// PERKS //
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPerkData, setCurrentPerkData] = useState<IPerksData>({
    id: "",
    description: "",
    level: 0,
    points: 0,
  })

  const handleModalOpen = (perkData: IPerksData) => {
    setCurrentPerkData(perkData)
    setIsModalOpen(true);
  };

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

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '1rem',

    },
  };

  return (
    <div className="perks-container">
      {
        perksData.map((perk) => (
          <PerksRow 
            perkData={perk} 
            openModalHandler={handleModalOpen}
          />
        ))
      }
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customStyles}
        closeTimeoutMS={150}
        ariaHideApp={false}
      >
        <PerksModal currentPerkData={currentPerkData} />
      </ReactModal>
    </div>
  )
};
