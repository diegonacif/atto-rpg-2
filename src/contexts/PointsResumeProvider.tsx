import { collection, doc, onSnapshot } from "firebase/firestore";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { db } from "../services/firebase-config";
import { AuthGoogleContext } from "./AuthGoogleProvider";
import { useSessionStorage } from "usehooks-ts";

interface PointsResumeContextProps {
  setCharacterIdSession: React.Dispatch<React.SetStateAction<string>>;
  attributesSum: number;
}

export const PointsResumeContext = createContext<PointsResumeContextProps>({
  setCharacterIdSession: () => {},
  attributesSum: 0,
});

export const PointsResumeProvider = ({ children }: { children: ReactNode }) => {
  // const [id, setId] = useState("");
  const { userId } = useContext(AuthGoogleContext);
  
  const [attributesSum, setAttributesSum] = useState(0);
  const [characterIdSession, setCharacterIdSession] = useSessionStorage('character-id', "")

  // const characterIdStored = sessionStorage.getItem("character-id");
  // const characterId = characterIdStored ? JSON.parse(characterIdStored) : null;

  // console.log({
  //   characterIdSession: characterIdSession,
  //   userId: userId,
  //   attributesSum: attributesSum
  // })

  // GOLDEN REALTIME SYNC DATABASE
  useEffect(() => {
    if(characterIdSession && userId) {
      const attributesCollectionRef = collection(db, "users", userId, "characters", characterIdSession, "attributes")
      const attributesSumCollectionRef = doc(attributesCollectionRef, "attributes-sum")

      console.log(attributesSumCollectionRef)
  
      const unsuscribe = onSnapshot(attributesSumCollectionRef, (snapshot) => {
        if (snapshot.exists()) {
          const attributesSumValue = snapshot.data().value;
          setAttributesSum(attributesSumValue);
          console.log(attributesSumValue);
          console.log("attribute sum changed");
        }
      });
  
      return () => unsuscribe();
    } else {
      return;
    }
  }, [characterIdSession, userId]);

  return (
    <PointsResumeContext.Provider value={{ 
      setCharacterIdSession,
      attributesSum,
    }}>
      {children}
    </PointsResumeContext.Provider>
  )
}