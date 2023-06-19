import React, { useContext, useEffect, useRef, useState } from 'react';
import '../../App.scss';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import { useParams } from 'react-router-dom';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { useCollection } from 'react-firebase-hooks/firestore';
import { LoadingSquare } from '../LoadingSquare/LoadingSquare';
import ReactModal from 'react-modal';
import { spellsData as spellsStaticData} from '../../services/gameData';
import { ToastifyContext } from '../../contexts/ToastifyProvider';

interface ISpellsData {
  id: string;
  description: string;
  level: number;
  points: number;
  nh: number;
  obs: string;
  mod: number;
};

interface ISelectedSpell {
  name: string,
  level: number;
};

export const Spells = () => {
  const { notifySuccess, notifyError } = useContext(ToastifyContext); // Toastify Context
  const { id } = useParams<{ id: string }>();
  const { userId } = useContext(AuthGoogleContext);
  const spellsCollectionRef = collection(db, "users", userId, "characters", id ? id : "", "spells")
  const [spellsData, setSpellsData] = useState<ISpellsData[]>([{
    id: "",
    description: "",
    level: 0,
    points: 0,
    nh: 0,
    obs: "",
    mod: 0
  }])
  const [firestoreLoading, setFirestoreLoading] = useState(true)

  // Firestore loading
  const [value, loading, error] = useCollection(spellsCollectionRef,
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );
  useEffect(() => {
    setTimeout(() => {
      setFirestoreLoading(loading);
    }, 100);
  }, [loading])

  // Intelligence Data
  const attributesCollectionRef = collection(db, "users", userId, "characters", id ? id : "", "attributes");
  const intelligenceRef = doc(attributesCollectionRef, 'intelligence');
  const [intelligence, setIntelligence] = useState(10);
  useEffect(() => {
    const getAttributeData = async () => {
      const docSnap = await getDoc(intelligenceRef);
      if (docSnap.exists()) {
        const attributeData = docSnap.data() as { value: number };
        setIntelligence(attributeData.value)
      }
    };
    getAttributeData();
  }, [])

   // Points List
  const pointsList = [
    4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80
  ]

  // Modal Data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpell, setSelectedSpell] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [selectedNh, setSelectedNh] = useState(0);
  const [selectedPoints, setSelectedPoints] = useState(4);
  const [selectedObs, setSelectedObs] = useState("");
  const [selectedMod, setSelectedMod] = useState(0);
  const [currentSpellData, setCurrentSpellData] = useState<ISpellsData>({
    id: "",
    description: "",
    level: 0,
    mod: 0,
    nh: 0,
    points: 0,
    obs: "",
  });
  const [currentSelectedSpell, setCurrentSeletedSpell] = useState<ISelectedSpell | undefined>({
    name: "",
    level: 0,
  });
  const [isNewSpell, setIsNewSpell] = useState(false);

  console.log({
    selectedSpell: selectedSpell,
    selectedLevel: selectedLevel,
    selectedNh: selectedNh,
    selectedMod: selectedMod,
    selectedObs: selectedObs,
    selectedPoints: selectedPoints,
    currentSelectedSpell: currentSelectedSpell
  })

  const isMounted = useRef(false);

  const clearInputsData = () => {
    setSelectedSpell("");
    setSelectedLevel(0);
    setSelectedPoints(4);
    setSelectedObs("");
    setSelectedMod(0);
  }

  // Handling Modals
  const handleModalOpen = (spell: ISpellsData) => {
    setCurrentSpellData(spell);
    setSelectedSpell(spell.description);
    setSelectedLevel(spell.level);
    setSelectedPoints(spell.points);
    setSelectedObs(spell.obs);
    setSelectedMod(spell.mod);
    setIsNewSpell(false);
    setIsModalOpen(true);
  };

    const handleNewSpellModalOpen = () => {
    clearInputsData();
    setIsNewSpell(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    isMounted.current = false;
    setIsModalOpen(false);
    setTimeout(() => {
      setIsNewSpell(false);
      clearInputsData();
    }, 200);
  };

  // Getting Spells Data
  useEffect(() => {
    const getSpellsData = async () => {
      const querySnapshot = await getDocs(spellsCollectionRef);
      const docs = querySnapshot.docs.map((doc) => (({ 
        id: doc.id, 
        description: doc.data().description,
        level: doc.data().level,
        points: doc.data().points,
        nh: doc.data().nh,
        obs: doc.data().obs,
        mod: doc.data().mod,
        ...doc.data()
      })));
      setSpellsData(docs)
    }
    getSpellsData();
  }, [isModalOpen])

  // NH Calculation
  useEffect(() => {
    if(selectedSpell === "") {
      setSelectedNh(0);
    } else {
      setSelectedNh(Number(intelligence) + ((selectedPoints / 4) - 1) - 3 + selectedMod)
    }
  }, [selectedPoints, selectedMod, intelligence, selectedSpell])  

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

  // Updating Current Selected Spell from Static Data
  useEffect(() => {
    const currentSpell = spellsStaticData.find(spell => spell.name === selectedSpell);
    setCurrentSeletedSpell(currentSpell);
    // setSelectedPoints(calculatePoints(selectedLevel) + selectedMod);
  }, [selectedSpell, selectedLevel, selectedMod]);

  const addNewSpell = async () => {
    try {
      await addDoc(spellsCollectionRef, {
        description: selectedSpell,
        level: currentSelectedSpell ? currentSelectedSpell.level : 0,
        mod: selectedMod,
        nh: selectedNh,
        obs: selectedObs,
        points: selectedPoints,
      }).then(
        () => {
          handleCloseModal();
          console.log("Magia adicionada com sucesso!");
          notifySuccess("Magia adicionada!");
        }
      )
    } catch (error) {
      console.error("Erro ao adicionar magia: ", error);
      notifyError("Erro ao adicionar magia");
    }
  }

  const updateSpell = async () => {
    const docRef = doc(spellsCollectionRef, currentSpellData.id);
    try {
      await setDoc(docRef, {
        description: selectedSpell,
        level: currentSelectedSpell ? currentSelectedSpell.level : 0,
        mod: selectedMod,
        nh: selectedNh,
        obs: selectedObs,
        points: selectedPoints,
      }).then(
        () => {
          handleCloseModal();
          console.log("Magia atualizada com sucesso!")
          notifySuccess("Magia atualizada!");
        }
      )
    } catch (error) {
      console.error("Erro ao atualizar magia: ", error);
      notifyError("Erro ao atualizar magia");
    }
  }

  const deleteSpell = async () => {
    const docRef = doc(spellsCollectionRef, currentSpellData.id)
    try {
      await deleteDoc(docRef)
      .then(
        () => {
          handleCloseModal();
          console.log("Magia deletada com sucesso!");
          notifySuccess("Magia removida!");
        }
      )
    } catch (error) {
      console.error("Erro ao deletar magia", error);
      notifyError("Erro ao remover magia");
    };
  }

  return (
    <div className="spells-container">
      {
        firestoreLoading ?
        <LoadingSquare /> :
        <>
          {
            spellsData.length !== 0 &&
            <div className="spells-row-title">
              <span className="spells-row-title-item">Descrição</span>
              <span className="spells-row-title-item">Nível</span>
              <span className="spells-row-title-item">Mod</span>
              <span className="spells-row-title-item">NH</span>
              <span className="spells-row-title-item">Pontos</span>
            </div>
          }
          {
            spellsData.map((spell) => (
              <div className="spells-row" key={`spell-${spell.id}`}>
                <span onClick={() => handleModalOpen(spell)} id="spell-name">{spell.description}</span>
                <span id="spell-level">{spell.level}</span>
                <span id="spell-nh">{spell.mod}</span>
                <span id="spell-nh">{spell.nh}</span>
                <span id="spell-points">{spell.points}</span>
              </div>
            ))
          }

          <button onClick={() => handleNewSpellModalOpen()} id="new-spell-button">
            <span className="yellow-span">Nova magia</span>
          </button>

          <ReactModal
            isOpen={isModalOpen}
            onRequestClose={() => handleCloseModal()}
            style={modalCustomStyles}
            closeTimeoutMS={150}
            ariaHideApp={false}
          >
            <div className="spells-modal">
              <div className="select-wrapper select-title">
                <select 
                  className={`spell-name ${selectedSpell === "" ? "empty-spell" : ""}`}
                  onChange={(e) => {
                    setSelectedSpell(e.target.value);
                  }}
                  value={selectedSpell}
                >
                  <option value="">Selecione uma magia</option>
                  {spellsStaticData.map((option) => (
                    <option key={option.name} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="spells-modal-row">
                <label htmlFor="">NH: </label>
                <span className="not-editable">
                  {selectedNh}
                </span>
              </div>
              
              <div className="spells-modal-row">
                <label htmlFor="">Modificador: </label>
                <input 
                  type="number"
                  id="spell-mod"
                  value={selectedMod}
                  onChange={(e) => setSelectedMod(Number(e.target.value))}
                />
              </div>

              <div className="spells-modal-row">
                <label htmlFor="">Observações: </label>
                <input 
                  type="text"
                  placeholder="Opcional"
                  id="spell-obs"
                  value={selectedObs}
                  onChange={(e) => setSelectedObs(e.target.value)}
                />
              </div>

              <div className="spells-modal-row">
                <label htmlFor="">Pontuação</label>
                <div className="select-wrapper-inner">
                  <select 
                    name="select-points" 
                    id="select-points"
                    value={selectedPoints}
                    onChange={(e) => setSelectedPoints(Number(e.target.value))}
                  >
                    {
                      pointsList.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))
                    }
                  </select>
                </div>
              </div>

              {isNewSpell ? 
                <button 
                  onClick={() => addNewSpell()}
                  disabled={selectedSpell === "" ? true : false}
                >
                  Adicionar
                </button>  :
                <div className="buttons-row">
                  <button onClick={() => updateSpell()}>Atualizar</button>
                  <button onClick={() => deleteSpell()}>Deletar</button>
                </div>
              }
            </div>
          </ReactModal>
        </>
      }
    </div>
  )
}
