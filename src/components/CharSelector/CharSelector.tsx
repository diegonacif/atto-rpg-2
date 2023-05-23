import { useContext, useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import { useCollection } from 'react-firebase-hooks/firestore';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import type { DocumentReference, DocumentSnapshot, CollectionReference } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import { MinusCircle, UserCirclePlus } from '@phosphor-icons/react';
import { PointsResumeContext } from '../../contexts/PointsResumeProvider';
import faceless from '../../assets/charIcons/palada.png';

import '../../App.scss';
import ReactModal from 'react-modal';

interface IChars { 
  id: string,
  name: string
  xp: number
}
interface IregisterChar { charDocRef: DocumentReference<firebase.firestore.DocumentData> }
interface IRegisterUserProps {
  userDocRef: DocumentReference<firebase.firestore.DocumentData>;
  userDoc: DocumentSnapshot<firebase.firestore.DocumentData>;
}
interface IRegisterCharContent {
  charsCollectionRef: CollectionReference<firebase.firestore.DocumentData>;
  charDocRef: DocumentReference<firebase.firestore.DocumentData>;
}

export const CharSelector = () => {
  const { setCharacterIdSession } = useContext(PointsResumeContext)
  const { userId } = useContext(AuthGoogleContext);
  const [firestoreLoading, setFirestoreLoading] = useState(true);
  const usersCollectionRef = collection(db, "users");
  const charsCollectionRef = collection(db, "users", userId, "characters");
  const [chars, setChars] = useState<IChars[]>([])
  const [charSelectorRefresh, setCharSelectorRefresh] = useState(false);
  // const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  const [charName, setCharName] = useState("");
  const [charGender, setCharGender] = useState("");
  const [experienceValue, setExperienceValue] = useState(0);
  const [charAge, setCharAge] = useState(0);
  const [charHeight, setCharHeight] = useState(0);
  const [charWeight, setCharWeight] = useState(0);

  const navigate = useNavigate();

  // const IdsArray = firestoreLoading ? [] : users?.map((user) => user.id)

  // Firestore loading
  const [value, loading, error] = useCollection(usersCollectionRef,
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );
  useEffect(() => {
    setFirestoreLoading(loading);
  }, [loading])

  // Chars Data
  useEffect(() => {
    const getChars = async () => {
      const data = await getDocs(charsCollectionRef);
      setChars(data.docs.map((doc) => ({ ...doc.data(), id: doc.id, name: doc.data().name || "Nome não fornecido", xp: doc.data().xp || 0 })));
    }
    getChars();
  }, [charSelectorRefresh])


  // Create user and char data
  async function registerUser({ userDocRef, userDoc }: IRegisterUserProps) {
    if(!userDoc.exists()) {
      console.info(`User document does not exist. Creating: ${userId}`);
      return await setDoc(userDocRef, {});
    } else {
      return;
    }
  }

  async function registerChar({ charDocRef }: IregisterChar) {
    return await setDoc(charDocRef, {
      name: charName,
      gender: charGender,
      xp: experienceValue,
      age: charAge,
      height: charHeight,
      weight: charWeight,
    })
    .then(() => console.log("Registered"))
    .catch((error) => {
      console.error("Error registering user:", error);
    });
  }

  async function registerCharContent({ charsCollectionRef, charDocRef }:IRegisterCharContent) {
    const attributes = ['strength', 'dexterity', 'intelligence', 'health', 'hit-points', 'will', 'perception', 'fatigue-points']

    for (const attribute of attributes) {
      await setDoc(doc(charDocRef, 'attributes', attribute), { value: 10 });
    }
    await setDoc(doc(charDocRef, 'attributes', 'attributes-sum'), { value: 0 });

    const perksRef = collection(charDocRef, "perks");
    await setDoc(doc(perksRef), {
      description: "",
      points: 0
    });

    const flawsRef = collection(charDocRef, "flaws");
    await setDoc(doc(flawsRef), {
      description: "",
      points: 0
    });

    const skillsRef = collection(charDocRef, "skills");
    await setDoc(doc(skillsRef), {
      description: "",
      mod: 0,
      nh: 0,
      attRelative: "",
      points: 0
    });

    const equipsRef = collection(charDocRef, "equips");
    await setDoc(doc(equipsRef), {
      description: "",
      weight: 0,
      cost: 0
    });
  }

  async function createChar() {
    const uid = uuidv4();
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    const charsCollectionRef = collection(userDocRef, 'characters');
    const charDocRef = doc(charsCollectionRef, uid);

    await registerUser({ userDocRef, userDoc });
    await registerChar({ charDocRef });
    await registerCharContent({ charsCollectionRef, charDocRef });

    setCharName("");
    setCharGender("");
    setExperienceValue(0);
    setCharAge(0);
    setCharHeight(0);
    setCharWeight(0);
    setCharSelectorRefresh(current => !current);
    setIsModalOpen(false);
  }

  async function deleteChar(id: string) {

    const deleteRef = doc(db, 'users', userId, 'characters', id);
    const attributesRef = collection(deleteRef, 'attributes')
    const perksRef = collection(deleteRef, 'perks')
    const flawsRef = collection(deleteRef, 'flaws')
    const skillsRef = collection(deleteRef, 'skills')
    const equipsRef = collection(deleteRef, 'equips')

    const attributesSnapshot = await getDocs(attributesRef);
    attributesSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    const perksSnapshot = await getDocs(perksRef);
    perksSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    const flawsSnapshot = await getDocs(flawsRef);
    flawsSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    const skillsSnapshot = await getDocs(skillsRef);
    skillsSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    const equipsSnapshot = await getDocs(equipsRef);
    equipsSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    await deleteDoc(deleteRef);

    setCharSelectorRefresh(current => !current);
  }

  
  async function handleSelectChar(id: string) {
    setCharacterIdSession(id)
    navigate(`/home/character/${id}`);
  }

  // Modal Data
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setCharName("");
    setCharGender("");
    setExperienceValue(0);
    setCharAge(0);
    setCharHeight(0);
    setCharWeight(0);
    setCharSelectorRefresh(current => !current);
    setIsModalOpen(false);
  }

  const modalCustomStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '1rem',
      borderRadius: '8px'
    },
  };

  return (
    <div className="char-selector-container">
      <div className="new-char-button" onClick={() => setIsModalOpen(true)}>
        <span>Novo personagem</span>
        <UserCirclePlus size={32} weight="duotone" id="new-char-icon" />
      </div>
      <ul>
        {
          chars.map(char => (
            <div className="char-row" key={char.id}>
              <div className="char-face-wrapper">
                <img src={faceless} alt="char-face" />
              </div>
              <div className="text-content">
                <li onClick={() => handleSelectChar(char.id)}>{char?.name}</li>
                <span>XP: {char?.xp}</span>
              </div>
              <button className="delete-char-button" onClick={() => deleteChar(char.id)}>
                <MinusCircle size={32} />
              </button>
            </div>
          ))
        }
      </ul>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => handleCloseModal()}
        style={modalCustomStyles}
        closeTimeoutMS={150}
        ariaHideApp={false}
      >
        <div className="new-char-modal">
          <div className="new-char-icon-wrapper">
            <img src={faceless} alt="" />
          </div>
          <input 
            type="text" 
            value={charName} 
            onChange={(e) => setCharName(e.target.value)} 
            placeholder="Insira o nome"
          />
          <input 
            type="text" 
            value={charGender} 
            onChange={(e) => setCharGender(e.target.value)} 
            placeholder="Insira o gênero"
          />
          <input 
            type="number" 
            onChange={(e) => setExperienceValue(Number(e.target.value))} 
            placeholder="Insira a experiência"
          />
          <input 
            type="text" 
            onChange={(e) => setCharAge(Number(e.target.value))} 
            placeholder="Insira a idade"
          />
          <input 
            type="text" 
            onChange={(e) => setCharHeight(Number(e.target.value))} 
            placeholder="Insira a altura"
          />
          <input 
            type="text" 
            onChange={(e) => setCharWeight(Number(e.target.value))} 
            placeholder="Insira o peso"
          />
          <button onClick={() => createChar()}>Criar boneco</button>
        </div>
      </ReactModal>
    </div>
  )
}
