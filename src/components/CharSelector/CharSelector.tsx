import { useContext, useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import { useCollection } from 'react-firebase-hooks/firestore';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import type { DocumentReference, DocumentSnapshot, CollectionReference } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import { v4 as uuidv4 } from 'uuid';

import '../../App.scss';

interface IChars { 
  id: string,
  name: string
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
  const { userId } = useContext(AuthGoogleContext);
  const [firestoreLoading, setFirestoreLoading] = useState(true);
  const usersCollectionRef = collection(db, "users");
  const charsCollectionRef = collection(db, "users", userId, "characters");
  const [chars, setChars] = useState<IChars[]>([])
  const [charSelectorRefresh, setCharSelectorRefresh] = useState(false);
  // const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  console.log(chars)

  const [charName, setCharName] = useState("")

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
      setChars(data.docs.map((doc) => ({ ...doc.data(), id: doc.id, name: doc.data().name || "Nome não fornecido" })));
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
      name: charName
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

    setCharName("")
    setCharSelectorRefresh(current => !current);
  }

  // async function deleteChar() {

  // }

  return (
    <div className="char-selector-container">
      <input type="text" value={charName} onChange={(e) => setCharName(e.target.value)}/>
      <button onClick={() => createChar()}>Criar boneco</button>
      <ul>
        {
          chars.map(char => (
            <li key={char.id}>{char?.name}</li>
          ))
        }
      </ul>
    </div>
  )
}
