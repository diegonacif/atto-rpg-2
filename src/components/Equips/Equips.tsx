import { collection, getDocs } from 'firebase/firestore';
import '../../App.scss';
import { db } from '../../services/firebase-config';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';

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

  // Modal Data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedMod, setSelectedMod] = useState(0);
  const [selectedNh, setSelectedNh] = useState(0);
  const [selectedAttRelative, setSelectedAttRelative] = useState<{attribute: string | undefined, difficulty: string | undefined}>({
    attribute: "",
    difficulty: ""
  });
  const [selectedPoints, setSelectedPoints] = useState(0);

  const [isNewSkill, setIsNewSkill] = useState(false);
  
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

  return (
    <div className="equips-container">
      {
        equipsData.map((equip) => (
          <div className="equips-row" key={`equip-${equip.id}`}>
            <span id="equip-name">{equip.description}</span>
            <span id="equip-weight">{equip.weight}</span>
            <span id="equip-cost">{equip.cost}</span>
          </div>
        ))
      }
    </div>
  )
}
