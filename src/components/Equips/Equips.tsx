import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import '../../App.scss';
import { db } from '../../services/firebase-config';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { useCollection } from 'react-firebase-hooks/firestore';
import { LoadingSquare } from '../LoadingSquare/LoadingSquare';
import ReactModal from 'react-modal';

interface IEquipsData {
  id: string;
  description: string;
  weight: number;
  cost: number;
};

export const Equips = () => {
  const { id } = useParams<{ id: string }>();
  const { userId } = useContext(AuthGoogleContext);
  const equipsCollectionRef = collection(db, "users", userId, "characters", id ? id : "", "equips")
  const [equipsData, setEquipsData] = useState<IEquipsData[]>([{
    id: "",
    description: "",
    weight: 0,
    cost: 0
  }])

  const [firestoreLoading, setFirestoreLoading] = useState(true)

  // Firestore loading
  const [value, loading, error] = useCollection(equipsCollectionRef,
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );
  useEffect(() => {
    setFirestoreLoading(loading);
  }, [loading])

  // Modal Data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("")
  const [selectedEquip, setSelectedEquip] = useState("");
  const [selectedWeight, setSelectedWeight] = useState(0);
  const [selectedCost, setSelectedCost] = useState(0);

  const [isNewEquip, setIsNewEquip] = useState(false);

  // Handling Modals
  const handleModalOpen = (equip: IEquipsData) => {
    setSelectedId(equip.id)
    setSelectedEquip(equip.description);
    setSelectedWeight(equip.weight);
    setSelectedCost(equip.cost);
    setIsNewEquip(false);
    setIsModalOpen(true);
  };

  const handleNewSkillModalOpen = () => {
    setSelectedEquip("");
    setSelectedWeight(0);
    setSelectedCost(0);
    setIsNewEquip(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    isMounted.current = false;
    setIsModalOpen(false);
    setTimeout(() => {
      setIsNewEquip(false);
    }, 200);
  };
  
  // Getting Skills Data
  useEffect(() => {
    const getEquipsData = async () => {
      const querySnapshot = await getDocs(equipsCollectionRef);
      const docs = querySnapshot.docs.map((doc) => (({ 
        id: doc.id, 
        description: doc.data().description,
        weight: doc.data().weight,
        cost: doc.data().cost,
        ...doc.data()
      })));
      setEquipsData(docs)
    }
    getEquipsData();
  }, [isModalOpen]);

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

  const isMounted = useRef(false);

  const addNewEquip = async () => {
    try {
      await addDoc(equipsCollectionRef, {
        description: selectedEquip,
        weight: selectedWeight,
        cost: selectedCost
      }).then(() => {
        handleCloseModal();
        console.log("equipamento criado com sucesso!")
      })
    } catch (error) {
      console.log("Erro ao criar equipamento")
    }
  };

  const updateEquip = async () => {
    const docRef = doc(equipsCollectionRef, selectedId);
    try {
      await setDoc(docRef, {
        description: selectedEquip,
        weight: selectedWeight,
        cost: selectedCost
      }).then (() => {
        handleCloseModal();
        console.log("Equipamento atualizado com sucesso!")
      })
    } catch (error) {
      console.log("Erro ao atualizar equipamento: ", error)
    }
  }

  const deleteEquip = async () => {
    const docRef = doc(equipsCollectionRef, selectedId);
    try {
      await deleteDoc(docRef)
      .then(() => {
        handleCloseModal();
        console.log("Equipamento deletado com sucesso!")
      })
    } catch (error) {
      console.log("Erro ao deletar equipamento: ", error)
    }
  }

  return (
    <div className="equips-container">
      {
        firestoreLoading ?
        <LoadingSquare /> :
        <>
          {
            equipsData.map((equip) => (
              <div className="equips-row" key={`equip-${equip.id}`}>
                <span onClick={() => handleModalOpen(equip)} id="equip-name">{equip.description}</span>
                <span id="equip-weight">{equip.weight}</span>
                <span id="equip-cost">{equip.cost}</span>
              </div>
            ))
          }

          <button onClick={() => handleNewSkillModalOpen()} id="new-equip-button">Novo equipamento</button>

          <ReactModal
            isOpen={isModalOpen}
            onRequestClose={() => handleCloseModal()}
            style={modalCustomStyles}
            closeTimeoutMS={150}
            ariaHideApp={false}
          >
            <div className="equips-modal">
              <input 
                type="string"
                id="equip-description"
                value={selectedEquip}
                onChange={(e) => setSelectedEquip(e.target.value)}
              />
              <input 
                type="number"
                id="equip-weight"
                value={selectedWeight}
                onChange={(e) => setSelectedWeight(Number(e.target.value))}
              />
              <input 
                type="number"
                id="equip-cost"
                value={selectedCost}
                onChange={(e) => setSelectedCost(Number(e.target.value))}
              />
              
              {isNewEquip ? 
                <button onClick={() => addNewEquip()}>Save</button>  :
                <>
                  <button onClick={() => updateEquip()}>Update</button>
                  <button onClick={() => deleteEquip()}>Delete</button>
                </>
              }
            </div>
          </ReactModal>
        </>
      }
    </div>
  )
}
