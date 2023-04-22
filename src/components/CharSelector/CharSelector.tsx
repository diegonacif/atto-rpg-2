import { useContext, useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import { useCollection } from 'react-firebase-hooks/firestore';
import '../../App.scss';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';

interface IUser {
  id: string
}
// interface IUsers {
//   users: IUser[];
// }

export const CharSelector = () => {
  const { userId } = useContext(AuthGoogleContext);
  const [firestoreLoading, setFirestoreLoading] = useState(true);
  const usersCollectionRef = collection(db, "users");
  const [users, setUsers] = useState<IUser[]>([])
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  const [charName, setCharName] = useState("")

  const IdsArray = firestoreLoading ? [] : users?.map((user) => user.id)
  
  console.log(alreadyRegistered, userId)

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

  // // Already Exists ?
  // useEffect(() => {
  //   if(firestoreLoading) {
  //     return;
  //   } else {
  //     const handleAlreadyExists = () => {
  //       setAlreadyRegistered(IdsArray.includes(userId))
  //     }
  //     handleAlreadyExists();
  //   }
  // }, [IdsArray])

  // Create user data
  async function registerUser() {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    // const docRef = doc(db, "users", userId, "characters", "id-unica-do-boneco-1");

    if(!userDoc.exists()) {
      console.info(`User document does not exist. Creating: ${userId}`);
      await setDoc(userDocRef, {});
    }

    const charsCollectionRef = collection(userDocRef, 'characters');
    const charDocRef = doc(charsCollectionRef, "char1");

    return await setDoc(charDocRef, {
      name: charName
    })
    .then(() => console.log("Registered"))
    .catch((error) => {
      console.error("Error registering user:", error);
    });
  }

  return (
    <div className="char-selector-container">
      <input type="text" onChange={(e) => setCharName(e.target.value)}/>
      <button onClick={() => registerUser()}>Criar boneco</button>
      <ul>
        <li>Char 1</li>
        <li>Char 2</li>
        <li>Char 3</li>
      </ul>
    </div>
  )
}
