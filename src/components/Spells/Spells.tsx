import React, { useContext, useEffect, useState } from 'react';
import '../../App.scss';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import { useParams } from 'react-router-dom';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { useCollection } from 'react-firebase-hooks/firestore';
import { LoadingSquare } from '../LoadingSquare/LoadingSquare';

interface ISpellsData {
  id: string;
  description: string;
  level: number;
  points: number;
  nh: number;
  obs: string;
  mod: number;
};

export const Spells = () => {
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

  console.log(spellsData)

  // Firestore loading
  const [value, loading, error] = useCollection(spellsCollectionRef,
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );
  useEffect(() => {
    setTimeout(() => {
      setFirestoreLoading(loading);
    }, 100);
  }, [loading])

  // Modal Data
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  return (
    <div className="spells-container">
      {
        firestoreLoading ?
        <LoadingSquare /> :
        <>
          <div className="spells-row-title">
            <span className="spells-row-title-item">Descrição</span>
            <span className="spells-row-title-item">Mod</span>
            <span className="spells-row-title-item">NH</span>
            <span className="spells-row-title-item">Pontos</span>
          </div>

          {
            spellsData.map((spell) => (
              <div className="spells-row" key={`spell-${spell.id}`}>
                <span onClick={() => console.log("abrir modal")} id="spell-name">{spell.description}</span>
                <span id="spell-level">{spell.level}</span>
                <span id="spell-nh">{spell.nh}</span>
                <span id="spell-points">{spell.points}</span>
              </div>
            ))
          }

          <button onClick={() => console.log("open modal")} id="new-spell-button">
            <span className="yellow-span">Nova magia</span>
          </button>
        </>
      }
    </div>
  )
}
