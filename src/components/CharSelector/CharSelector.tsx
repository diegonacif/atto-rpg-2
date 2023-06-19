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
import ReactModal from 'react-modal';

import faceless from '../../assets/charIcons/faceless.png';
import male01 from '../../assets/charIcons/male01.png';
import male02 from '../../assets/charIcons/male02.png';
import male03 from '../../assets/charIcons/male03.png';
import male04 from '../../assets/charIcons/male04.png';
import female01 from '../../assets/charIcons/female01.png';
import female02 from '../../assets/charIcons/female02.png';
import female03 from '../../assets/charIcons/female03.png';
import female04 from '../../assets/charIcons/female04.png';

import wireframeBg from '../../assets/ceiling-floor-background.png'

import '../../App.scss';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { numberMask } from '../../utils/numberMask';
import { numberWithDecimalsMask } from '../../utils/numberWithDecimalsMask';

interface IChars { 
  id: string,
  name: string,
  face: string,
  xp: number,
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
  const [experienceValue, setExperienceValue] = useState("");
  const [charAge, setCharAge] = useState("");
  const [charHeight, setCharHeight] = useState("");
  const [charWeight, setCharWeight] = useState("");
  const [charFace, setCharFace] = useState("");

  const [newCharButtonDisabled, setNewCharButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  console.log({
    experienceValue: experienceValue,
    charAge: charAge,
    charHeight: charHeight,
    charWeight: charWeight
  })

  // Is create button disabled
  useEffect(() => {
    if(charName !== "" && charGender !== "" && experienceValue !== "") {
      setNewCharButtonDisabled(false);
    } else {
      setNewCharButtonDisabled(true);
    }
  }, [charName, charGender, experienceValue])

  // Input mask control
  useEffect(() => {
    setExperienceValue(numberMask(experienceValue));
    setCharAge(numberMask(charAge));
    setCharHeight(numberWithDecimalsMask(charHeight));
    setCharWeight(numberWithDecimalsMask(charWeight));
  }, [experienceValue, charAge, charHeight, charWeight])
  

  const navigate = useNavigate();

  // Firestore loading
  const [value, loading, error] = useCollection(usersCollectionRef,
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );
  useEffect(() => {
    setFirestoreLoading(loading);
  }, [loading])

  // Chars Data
  useEffect(() => {
    setIsLoading(true);
    const getChars = async () => {
      const data = await getDocs(charsCollectionRef);
      setChars(data.docs.map((doc) => ({ ...doc.data(), id: doc.id, name: doc.data().name || "Nome não fornecido", xp: doc.data().xp || 0 , face: doc.data().face || "" })));
    }
    getChars();
    setIsLoading(false);
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
      xp: Number(experienceValue),
      age: charAge,
      height: charHeight,
      weight: charWeight,
      face: charFace,
    })
    .then(() => console.log("Registered"))
    .catch((error) => {
      console.error("Error registering user:", error);
    });
  }

  async function registerCharContent({ charsCollectionRef, charDocRef }:IRegisterCharContent) {
    const attributes = ['strength', 'dexterity', 'intelligence', 'health', 'hit-points', 'will', 'perception', 'fatigue-points', 'current-fatigue-points', 'current-hit-points']

    for (const attribute of attributes) {
      await setDoc(doc(charDocRef, 'attributes', attribute), { value: "10" });
    }
    await setDoc(doc(charDocRef, 'attributes', 'attributes-sum'), { value: 0 });

    const perksRef = collection(charDocRef, "perks");
    await setDoc(doc(perksRef), {
      description: "",
      level: 0,
      mod: 0,
      obs: "",
      points: 0
    });

    const flawsRef = collection(charDocRef, "flaws");
    await setDoc(doc(flawsRef), {
      description: "",
      level: 0,
      mod: 0,
      obs: "",
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

    const spellsRef = collection(charDocRef, "spells");
    await setDoc(doc(spellsRef), {
      description: "",
      level: 0,
      points: 0,
      nh: 0,
      mod: 0,
      obs: ""
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
    setExperienceValue("");
    setCharAge("");
    setCharHeight("");
    setCharWeight("");
    setCharFace("");
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
  const [isFaceSelectModalOpen, setIsFaceSelectModalOpen] = useState(false)

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  useEffect(() => {
    if(isModalOpen === false) {
      setCharSelectorRefresh(current => !current);
      setTimeout(() => {
        setCharName("");
        setCharGender("");
        setExperienceValue("");
        setCharAge("");
        setCharHeight("");
        setCharWeight("");
        setCharFace("");
      }, 150);
    }
  }, [isModalOpen])
  

  const handleSelectCharFace = (face: string) => {
    setCharFace(face);
    setIsFaceSelectModalOpen(false);
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

  const faceMapping: {[key: string]: string} = {
    male01: male01,
    male02: male02,
    male03: male03,
    male04: male04,
    female01: female01,
    female02: female02,
    female03: female03,
    female04: female04,
  };

  const currentImg = faceMapping[charFace] || faceless;


  return (
    <div className="char-selector-container">
      <div className="new-char-button" onClick={() => setIsModalOpen(true)}>
        <span>Novo personagem</span>
        <UserCirclePlus size={32} weight="duotone" id="new-char-icon" />
      </div>
      <ul>
        <SkeletonTheme 
          width="18rem" 
          height="5rem"
          baseColor="#4fa066"
          highlightColor="#60c47c"
        >
          {
            isLoading ?
            <>
              <Skeleton /> 
              <Skeleton /> 
              <Skeleton /> 
            </>
            :
            <>
              {
                chars.map(char => (
                  <div className="char-row" key={char.id}>
                    <div className="char-face-wrapper" onClick={() => handleSelectChar(char.id)}>
                      <img src={faceMapping[char.face] || faceless} alt="char-face" />
                    </div>
                    <div className="text-content" onClick={() => handleSelectChar(char.id)}>
                      <li >{char?.name}</li>
                      <span>XP: {char?.xp}</span>
                    </div>
                    <button className="delete-char-button" onClick={() => deleteChar(char.id)}>
                      <MinusCircle size={32} />
                    </button>
                  </div>
                ))
              }
            </>
          }
        </SkeletonTheme>
      </ul>
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => handleCloseModal()}
        style={modalCustomStyles}
        closeTimeoutMS={150}
        ariaHideApp={false}
      > 
        <img src={wireframeBg} alt="wireframe background" id="wireframe-background" />
        <div className="new-char-modal">
          <div className="new-char-icon-wrapper" onClick={() => setIsFaceSelectModalOpen(true)}>
            <img src={currentImg} alt="" />
          </div>
          <input 
            type="text" 
            value={charName} 
            onChange={(e) => setCharName(e.target.value)} 
            placeholder="Insira o nome"
          />
          <select 
            onChange={(e) => setCharGender(e.target.value)} 
            placeholder="Insira o gênero"
            defaultValue=""
            className={!charGender ? 'disabled' : ''}
          >
            <option value="" disabled>Selecione o gênero</option>
            <option value="female">Feminino</option>
            <option value="male">Masculino</option>
          </select>
          <input 
            type="text" 
            onChange={(e) => setExperienceValue(e.target.value)} 
            placeholder="Insira a experiência"
            value={experienceValue}
          />
          <input 
            type="text" 
            onChange={(e) => setCharAge(e.target.value)} 
            placeholder="Insira a idade"
            value={charAge}
          />
          <input 
            type="text" 
            onChange={(e) => setCharHeight(e.target.value)} 
            placeholder="Insira a altura"
            value={charHeight}
          />
          <input 
            type="text" 
            onChange={(e) => setCharWeight(e.target.value)} 
            placeholder="Insira o peso"
            value={charWeight}
          />
          <button disabled={newCharButtonDisabled} onClick={() => createChar()}>Criar personagem</button>
        </div>

        {/* Face Char Selector */}
        <ReactModal
          isOpen={isFaceSelectModalOpen}
          onRequestClose={() => setIsFaceSelectModalOpen(false)}
          style={modalCustomStyles}
          closeTimeoutMS={150}
          ariaHideApp={false}
        >
          <div className="face-char-selector-modal">
            <img src={male01} alt="male face 01" onClick={() => handleSelectCharFace("male01")} />
            <img src={male02} alt="male face 02" onClick={() => handleSelectCharFace("male02")} />
            <img src={male03} alt="male face 03" onClick={() => handleSelectCharFace("male03")} />
            <img src={male04} alt="male face 04" onClick={() => handleSelectCharFace("male04")} />
            <img src={female01} alt="female face 01" onClick={() => handleSelectCharFace("female01")} />
            <img src={female02} alt="female face 02" onClick={() => handleSelectCharFace("female02")} />
            <img src={female03} alt="female face 03" onClick={() => handleSelectCharFace("female03")} />
            <img src={female04} alt="female face 04" onClick={() => handleSelectCharFace("female04")} />
          </div>
        </ReactModal>
      </ReactModal>
    </div>
  )
}
