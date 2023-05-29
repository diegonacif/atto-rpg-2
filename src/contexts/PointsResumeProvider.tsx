import { collection, doc, onSnapshot } from "firebase/firestore";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { db } from "../services/firebase-config";
import { AuthGoogleContext } from "./AuthGoogleProvider";
import { useSessionStorage } from "usehooks-ts";
import { useLocation } from "react-router-dom";

interface PointsResumeContextProps {
  characterIdSession: string
  setCharacterIdSession: React.Dispatch<React.SetStateAction<string>>;
  attributesSum: number;
  perksSum: number;
  flawsSum: number;
  skillsSum: number;
}

export const PointsResumeContext = createContext<PointsResumeContextProps>({
  characterIdSession: "",
  setCharacterIdSession: () => {},
  attributesSum: 0,
  perksSum: 0,
  flawsSum: 0,
  skillsSum: 0,
});

export const PointsResumeProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useContext(AuthGoogleContext);
  
  const [attributesSum, setAttributesSum] = useState(0);
  const [perksSum, setPerksSum] = useState(0);
  const [flawsSum, setFlawsSum] = useState(0);
  const [skillsSum, setSkillsSum] = useState(0);
  const [characterIdSession, setCharacterIdSession] = useSessionStorage('character-id', "")

  // console.log(characterIdSession);

  const location = useLocation();

  // Clear Values when not in character url
  useEffect(() => {
    if (!location.pathname.startsWith('/home/character')) {
      setCharacterIdSession("");
      setAttributesSum(0);
      setPerksSum(0);
      setFlawsSum(0);
      setSkillsSum(0);
    }
  }, [location]);

  // GOLDEN REALTIME SYNC DATABASE //

  // Attributes
  useEffect(() => {
    if(characterIdSession && userId) {
      const attributesCollectionRef = collection(db, "users", userId, "characters", characterIdSession, "attributes")
      const attributesSumCollectionRef = doc(attributesCollectionRef, "attributes-sum")
  
      const unsuscribe = onSnapshot(attributesSumCollectionRef, (snapshot) => {
        if (snapshot.exists()) {
          const attributesSumValue = snapshot.data().value;
          setAttributesSum(attributesSumValue);
          // console.log(attributesSumValue);
        }
      });
  
      return () => unsuscribe();
    } else {
      return;
    }
  }, [characterIdSession, userId]);

  // Perks
  useEffect(() => {
    if(characterIdSession && userId) {
      const perksCollectionRef = collection(db, "users", userId, "characters", characterIdSession, "perks")
      
      const unsuscribe = onSnapshot(perksCollectionRef, (snapshot) => {
        const updatedPointsArray: number[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const points = data.points;

          updatedPointsArray.push(points);
        });

        const totalPoints = updatedPointsArray.reduce((sum, points) => sum + points, 0);
        setPerksSum(totalPoints);
      });
      return () => unsuscribe();
    } else {
      return;
    }
  }, [characterIdSession, userId]);

  // Flaws
  useEffect(() => {
    if(characterIdSession && userId) {
      const flawsCollectionRef = collection(db, "users", userId, "characters", characterIdSession, "flaws")
      
      const unsuscribe = onSnapshot(flawsCollectionRef, (snapshot) => {
        const updatedPointsArray: number[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const points = data.points;

          updatedPointsArray.push(points);
        });

        const totalPoints = updatedPointsArray.reduce((sum, points) => sum + points, 0);
        setFlawsSum(totalPoints);
      });
      return () => unsuscribe();
    } else {
      return;
    }
  }, [characterIdSession, userId]);

  // Skills
  useEffect(() => {
    if(characterIdSession && userId) {
      const skillsCollectionRef = collection(db, "users", userId, "characters", characterIdSession, "skills")
      
      const unsuscribe = onSnapshot(skillsCollectionRef, (snapshot) => {
        const updatedPointsArray: number[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const points = data.points;

          updatedPointsArray.push(points);
        });

        const totalPoints = updatedPointsArray.reduce((sum, points) => sum + points, 0);
        setSkillsSum(totalPoints);
      });
      return () => unsuscribe();
    } else {
      return;
    }
  }, [characterIdSession, userId]);

  return (
    <PointsResumeContext.Provider value={{ 
      characterIdSession,
      setCharacterIdSession,
      attributesSum,
      perksSum,
      flawsSum,
      skillsSum,
    }}>
      {children}
    </PointsResumeContext.Provider>
  )
}