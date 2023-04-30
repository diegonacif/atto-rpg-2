import { useContext, useEffect, useRef, useState } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { db } from '../../services/firebase-config';
import ReactModal from 'react-modal';
import { flawsData as flawsStaticData} from '../../services/gameData';
import '../../App.scss';

interface IFlawsData {
  id: string;
  description: string;
  level: number;
  points: number;
};

interface ISelectedPerk {
  name: string,
  levels: number[];
};

interface ILevelPoints {
  [key: number]: number;
};

export const Flaws = () => {
  const { id } = useParams<{ id: string }>();
  const { userId } = useContext(AuthGoogleContext);
  const flawsCollectionRef = collection(db, "users", userId, "characters", id ? id : "", "flaws")
  const [flawsData, setFlawsData] = useState<IFlawsData[]>([{
    id: "",
    description: "",
    level: 0,
    points: 0,
  }])

  // Modal Data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlaw, setSelectedFlaw] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [selectedPoints, setSelectedPoints] = useState(0);
  const [currentFlawData, setCurrentFlawData] = useState<IFlawsData>({
    id: "",
    description: "",
    level: 0,
    points: 0,
  });
  const [currentSelectedFlaw, setCurrentSeletedFlaw] = useState<ISelectedPerk | undefined>({
    name: "",
    levels: [],
  });
  const [isNewFlaw, setIsNewFlaw] = useState(false);
  
  // Handling Modals
  const handleModalOpen = (flaw: IFlawsData) => {
    setCurrentFlawData(flaw);
    setSelectedFlaw(flaw.description);
    setSelectedLevel(flaw.level);
    setSelectedPoints(flaw.points);
    setIsNewFlaw(false);
    setIsModalOpen(true);
  };

  const handleNewFlawModalOpen = () => {
    setSelectedFlaw("");
    setSelectedLevel(0);
    setSelectedPoints(0);
    setIsNewFlaw(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    isMounted.current = false;
    setIsModalOpen(false);
    setTimeout(() => {
      setIsNewFlaw(false);
    }, 200);
  };

  console.log(isNewFlaw)

  // Getting Perks Data
  useEffect(() => {
    const getFlawsData = async () => {
      const querySnapshot = await getDocs(flawsCollectionRef);
      const docs = querySnapshot.docs.map((doc) => (({ 
        id: doc.id, 
        description: doc.data().description,
        level: doc.data().level,
        points: doc.data().points,
        ...doc.data()
      })));
      setFlawsData(docs)
    }
    getFlawsData();
  }, [isModalOpen])

  const modalCustomStyles = {
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

  // Updating Current Selected Flaw from Static Data
  useEffect(() => {
    const currentFlaw = flawsStaticData.find(flaw => flaw.name === selectedFlaw);
    setCurrentSeletedFlaw(currentFlaw)
  }, [selectedFlaw]);

  // Modal Row clear when change flaw selection
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

  const isMounted = useRef(false);
  // console.log({
  //   selectedFlaw: selectedFlaw,
  //   isMounted: isMounted.current,
  //   selectedLevel: selectedLevel
  // });

  useEffect(() => {
    if(!isMounted.current && isModalOpen) {
      setTimeout(() => {
        isMounted.current = true;
      }, 300);
    } else {
      setSelectedLevel(0);
    }
  }, [selectedFlaw]);

  useEffect(() => {
    if(isMounted.current) {
      setSelectedPoints(calculatePoints(selectedLevel));
    } else {
      return;
    }
  }, [selectedLevel]);
  
  

  const addNewFlaw = async () => {
    try {
      await addDoc(flawsCollectionRef, {
        description: selectedFlaw,
        level: selectedLevel,
        points: selectedPoints
      }).then(
        () => handleCloseModal()
      )
    } catch (error) {
      console.error('Erro ao criar documento :', error)
    }
  }
  const updateFlaw = async () => { console.log("update flaw") }
  const deleteFlaw = async () => { console.log("delete flaw") }

  return (
    <div className="flaws-container">
      {
        flawsData.map((flaw) => (
          <div className="flaws-row">
            <span onClick={() => handleModalOpen(flaw)} id="flaw-name">{flaw.description}</span>
            <span id="flaw-level">{flaw.level}</span>
            <span id="flaw-points">{flaw.points}</span>
          </div>
        ))
      }

      <button onClick={() => handleNewFlawModalOpen()} id="new-flaw-button">Nova desvantagem</button>

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => handleCloseModal()}
        style={modalCustomStyles}
        closeTimeoutMS={150}
        ariaHideApp={false}
      >
        <div className="flaws-modal">
          <select 
            id="perk-name"
            onChange={(e) => {
              const currentFlaw = flawsStaticData.find(flaw => flaw.name === e.target.value);
              setSelectedFlaw(e.target.value);
              selectedFlaw && setCurrentSeletedFlaw(currentFlaw)
            }}
            value={selectedFlaw}
          >
            <option value="">Selecione uma vantagem</option>
            {flawsStaticData.map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
          <select 
            id="perk-level"
            onChange={(e) => setSelectedLevel(Number(e.target.value))}
            value={selectedLevel}
          >
            <option value="">0</option>
            {currentSelectedFlaw?
              currentSelectedFlaw.levels.map((level) => (
                <option key={`${level}`} value={`${level}`}>
                  {`${level}`}
                </option>
            )):
            <option value="">0</option>
          }
          </select>
          <span>{selectedPoints}</span>
          {isNewFlaw ? 
            <button onClick={() => addNewFlaw()}>Save</button>  :
            <>
              <button onClick={() => updateFlaw()}>Update</button>
              <button onClick={() => deleteFlaw()}>Delete</button>
            </>
          }
        </div>
      </ReactModal>
        
    </div>
  )
}
