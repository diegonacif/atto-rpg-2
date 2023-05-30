import React, { useContext, useEffect, useRef, useState } from 'react'
import { perksData } from '../../services/gameData';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import { useParams } from 'react-router-dom';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import ReactModal from 'react-modal';
import { useCollection } from 'react-firebase-hooks/firestore';
import { LoadingSquare } from '../LoadingSquare/LoadingSquare';

import '../../App.scss';
import { ToastifyContext } from '../../contexts/ToastifyProvider';

interface IPerksData {
  id: string;
  description: string;
  level: number;
  points: number;
  obs: string;
};

interface ILevelPoints {
  [key: number]: number;
};

interface ISelectedPerk {
  name: string,
  levels: number[];
};

// PERKS ROW //
const PerksRow = ({ perkData, openModalHandler }: {
  perkData: IPerksData, 
  openModalHandler: (perkData: IPerksData) => void,
}) => {
  return (
    <div className="perks-row" key={`perk-${perkData.id}`}>
      <span onClick={() => openModalHandler(perkData)} id="perk-name">{perkData.description}{perkData.obs ? ` (${perkData.obs})` : ''}</span>
      <span>{perkData.level}</span>
      <span>{perkData.points}</span>
    </div>
  )
};

// PERKS MODAL //
const PerksModal = ({ currentPerkData, newPerk, setIsModalOpen }: 
  {
    currentPerkData: 
    IPerksData, 
    newPerk: boolean, 
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  }) => {
  const { id } = useParams<{ id: string }>();
  const { userId } = useContext(AuthGoogleContext);
  const { notifySuccess, notifyError } = useContext(ToastifyContext); // Toastify Context
  const perksCollectionRef = collection(db, "users", userId, "characters", id ? id : "", "perks")

  const [selectedPerk, setSelectedPerk] = useState(currentPerkData.description);
  const [selectedLevel, setSelectedLevel] = useState(currentPerkData.level);
  const [selectedPoints, setSelectedPoints] = useState(0);
  const [selectedObs, setSelectedObs] = useState(currentPerkData.obs);
  const [currentSelectedPerk, setCurrentSelectedPerk] = useState<ISelectedPerk>({
    name: "",
    levels: [],
  })

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

  useEffect(() => {
    const currentPerk = perksData.find((perk: ISelectedPerk) => perk.name === selectedPerk);
    console.log(currentPerk)
    setCurrentSelectedPerk({
      name: currentPerk?.name ?? "",
      levels: currentPerk?.levels ?? []
    });
    setSelectedPoints(calculatePoints(selectedLevel));
  }, [selectedPerk, selectedLevel])

  const isMounted = useRef(false);
  useEffect(() => {
    if(!isMounted.current) {
      setTimeout(() => {
        isMounted.current = true;
      }, 200);
    } else {
      setSelectedPoints(0);
      setSelectedLevel(0);
    }
  }, [selectedPerk])

  const addNewPerk = async () => {
    try {
      await addDoc(perksCollectionRef, {
        description: selectedPerk,
        level: selectedLevel,
        points: selectedPoints,
        obs: selectedObs,
      }).then(() => notifySuccess("Vantagem adicionada!"))
      setIsModalOpen(false)
    } catch (error) {
      console.error('Erro ao criar documento :', error);
      notifyError("Erro ao adicionar vantagem!")
    }
  }

  const updatePerk = async () => {
    const docRef = doc(perksCollectionRef, currentPerkData.id)
    try {
      await setDoc(docRef, {
        description: selectedPerk,
        level: selectedLevel,
        points: selectedPoints,
        obs: selectedObs,
      }).then(() => notifySuccess("Vantagem atualizada!"));
      console.log("Documento atualizado com sucesso!");
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar documento :', error);
      notifyError("Erro ao atualizar vantagem!")
    }
  }

  const deletePerk = async () => {
    const docRef = doc(perksCollectionRef, currentPerkData.id)
    try {
      await deleteDoc(docRef).then(() => notifySuccess("Vantagem removida!"));
      console.log("Documento excluído com sucesso!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao excluir documento", error);
      notifyError("Erro ao remover vantagem!");
    }
  } 
  
  return (
    <div className="perks-modal">
      <div className="perks-modal-row">
        <label htmlFor="">Descrição:</label>
        <select 
          id="perk-name"
          onChange={(e) => {
            const selectedPerk = perksData.find(perk => perk.name === e.target.value);
            setSelectedPerk(e.target.value);
            selectedPerk && setCurrentSelectedPerk(selectedPerk)
          }}
          value={selectedPerk}
        >
          <option value="">Selecione</option>
          {perksData.map((option) => (
            <option key={option.name} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      <div className="perks-modal-row">
        <label htmlFor="">Nível</label>
        <select 
          id="perk-level"
          onChange={(e) => setSelectedLevel(Number(e.target.value))}
          value={selectedLevel}
        >
          <option value="">0</option>
          {currentSelectedPerk?
            currentSelectedPerk.levels.map((level) => (
              <option key={`${level}`} value={`${level}`}>
                {`${level}`}
              </option>
          )):
          <option value="">0</option>
        }
        </select>
      </div>
      
      <div className="perks-modal-row">
        <label htmlFor="">Custo</label>
        <span className="not-editable">{selectedPoints}</span>
      </div>

      <div className="perks-modal-row">
        <label htmlFor="">Observações</label>
        <input 
          type="text" 
          placeholder="Opcional" 
          onChange={(e) => setSelectedObs(e.target.value)}
          value={selectedObs}
        />
      </div>

      <div className="buttons-row">
        {newPerk ? 
          <button 
            onClick={() => addNewPerk()}
            disabled={selectedPerk === "" ? true : false}
          >
            Adicionar
          </button>  :
          <>
            <button onClick={() => updatePerk()}>Atualizar</button>
            <button onClick={() => deletePerk()}>Deletar</button>
          </>
        }
      </div>
    </div>
  )
};

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
    obs: ""
  }])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPerkData, setCurrentPerkData] = useState<IPerksData>({
    id: "",
    description: "",
    level: 0,
    points: 0,
    obs: ""
  })
  const [isNewPerk, setIsNewPerk] = useState(false);
  const [firestoreLoading, setFirestoreLoading] = useState(true)

  // Firestore loading
  const [value, loading, error] = useCollection(perksCollectionRef,
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );
  useEffect(() => {
    setTimeout(() => {
      setFirestoreLoading(loading);
    }, 100);
  }, [loading])

  // Handling Modals
  const handleModalOpen = (perkData: IPerksData) => {
    setCurrentPerkData(perkData)
    setIsNewPerk(false);
    setIsModalOpen(true);
  };

  const handleNewPerkModalOpen = () => {
    setCurrentPerkData({
      id: "",
      description: "",
      level: 0,
      points: 0,
      obs: ""
    });
    setIsNewPerk(true);
    setIsModalOpen(true);
  }

  // Getting Perks Data
  useEffect(() => {
    const getPerksData = async () => {
      const querySnapshot = await getDocs(perksCollectionRef);
      const docs = querySnapshot.docs.map((doc) => (({ 
        id: doc.id, 
        description: doc.data().description,
        level: doc.data().level,
        points: doc.data().points,
        obs: doc.data().obs,
        ...doc.data()
      })));
      setPerksData(docs)
    }
    getPerksData();
  }, [isModalOpen]);

  // Perks Sum
  const perksSum = perksData.reduce((sum, perk) => {
    return sum + perk.points;
  }, 0);

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
        firestoreLoading ?
        <LoadingSquare /> :
        <>
          {
            perksData.map((perk) => (
              <PerksRow
                key={`perk-row-${perk.id}`}
                perkData={perk} 
                openModalHandler={handleModalOpen}
              />
            ))
          }
          <button onClick={() => handleNewPerkModalOpen()}>
            <span className="yellow-span"> Nova vantagem</span>
          </button>
          <ReactModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={customStyles}
            closeTimeoutMS={150}
            ariaHideApp={false}
          >
            <PerksModal 
              currentPerkData={currentPerkData} 
              newPerk={isNewPerk} 
              setIsModalOpen={setIsModalOpen}
            />
          </ReactModal>
        </>
      }
    </div>
  )
};
