import { useContext, useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import { useCollection } from 'react-firebase-hooks/firestore';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import firebase from 'firebase/compat/app';
import type { DocumentReference, DocumentSnapshot, CollectionReference } from 'firebase/firestore';

import '../../App.scss';

interface IUser { id: string }
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
  const [users, setUsers] = useState<IUser[]>([])
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  const [charName, setCharName] = useState("")

  // const IdsArray = firestoreLoading ? [] : users?.map((user) => user.id)

  // Firestore loading
  const [value, loading, error] = useCollection(usersCollectionRef,
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );
  useEffect(() => {
    setFirestoreLoading(loading);
  }, [loading])

  // Users Data
  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
    getUsers();
  }, [])


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
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    const charsCollectionRef = collection(userDocRef, 'characters');
    const charDocRef = doc(charsCollectionRef, "char2");

    await registerUser({ userDocRef, userDoc });
    await registerChar({ charDocRef });
    await registerCharContent({ charsCollectionRef, charDocRef });
  }

  return (
    <div className="char-selector-container">
      <input type="text" onChange={(e) => setCharName(e.target.value)}/>
      <button onClick={() => createChar()}>Criar boneco</button>
      <ul>
        <li>Char 1</li>
        <li>Char 2</li>
        <li>Char 3</li>
      </ul>
    </div>
  )
}
