import { collection, doc, onSnapshot } from "firebase/firestore";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { db } from "../services/firebase-config";
import { AuthGoogleContext } from "./AuthGoogleProvider";

interface PointsResumeContextProps {
  setId: React.Dispatch<React.SetStateAction<string>>;
  attributesSum: number;
}

export const PointsResumeContext = createContext<PointsResumeContextProps>({
  setId: () => {},
  attributesSum: 0,
});

export const PointsResumeProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState("");
  const { userId } = useContext(AuthGoogleContext);
  
  const [attributesSum, setAttributesSum] = useState(0);
  const characterIdStored = sessionStorage.getItem("character-id");
  const characterId = JSON.parse(characterIdStored ? characterIdStored : "")

  console.log({
    characterId: characterId,
    userId: userId,
    attributesSum: attributesSum
  })

  // GOLDEN REALTIME SYNC DATABASE
  useEffect(() => {
    if(characterId && userId) {
      const attributesCollectionRef = collection(db, "users", userId, "characters", characterId, "attributes")
      const attributesSumCollectionRef = doc(attributesCollectionRef, "attributes-sum")
  
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
  }, [characterId, userId]);

  return (
    <PointsResumeContext.Provider value={{ 
      setId,
      attributesSum,
    }}>
      {children}
    </PointsResumeContext.Provider>
  )
}