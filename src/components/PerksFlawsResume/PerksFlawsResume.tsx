import { useContext, useEffect, useState } from 'react';
import '../../App.scss';
import { collection, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { db } from '../../services/firebase-config';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

interface IPerksFlawsData {
  id: string;
  description: string;
  level: number;
  points: number;
};

export const PerksFlawsResume = () => {
  const { id } = useParams<{ id: string }>();
  const { userId } = useContext(AuthGoogleContext);
  const perksCollectionRef = collection(db, "users", userId, "characters", id ? id : "", "perks")
  const flawsCollectionRef = collection(db, "users", userId, "characters", id ? id : "", "flaws")
  
  const [perksData, setPerksData] = useState<IPerksFlawsData[]>([{
    id: "",
    description: "",
    level: 0,
    points: 0,
  }]);

  const [flawsData, setFlawsData] = useState<IPerksFlawsData[]>([{
    id: "",
    description: "",
    level: 0,
    points: 0,
  }])

  const [isLoading, setIsLoading] = useState(true);

  // Getting Perks Data
  useEffect(() => {
    const getPerksData = async () => {
      setIsLoading(true);
      const querySnapshot = await getDocs(perksCollectionRef);
      const docs = querySnapshot.docs.map((doc) => (({
        id: doc.id, 
        description: doc.data().description,
        level: doc.data().level,
        points: doc.data().points,
        ...doc.data()
      })))
      setPerksData(docs);
      setIsLoading(false);
    }
    getPerksData();
  }, []);

  // Getting Flaws Data
  useEffect(() => {
    const getFlawsData = async () => {
      setIsLoading(true);
      const querySnapshot = await getDocs(flawsCollectionRef);
      const docs = querySnapshot.docs.map((doc) => (({ 
        id: doc.id, 
        description: doc.data().description,
        level: doc.data().level,
        points: doc.data().points,
        ...doc.data()
      })));
      setFlawsData(docs);
      setIsLoading(false);
    }
    getFlawsData();
  }, [])

  return (
    <div className="perks-flaws-resume-container">
      <SkeletonTheme 
        width="4.5rem" 
        height="1rem"
        baseColor="#4fa066"
        highlightColor="#60c47c"
      >
        <section className="perks">
          <h4>Vantagens</h4>
          {
            isLoading ?
            <Skeleton count={3} containerClassName="skeleton-span" /> :
            <>
              {
                perksData.map((perk) => (
                  <span key={perk?.id}>{perk?.description}</span>
                ))
              }
            </>
          }
        </section>
        <section className="flaws">
          <h4>Desvantagens</h4>
          {
            isLoading ?
            <Skeleton count={3} containerClassName="skeleton-span" /> :
            <>
              {
                flawsData.map((flaw) => (
                  <span key={flaw?.id}>{flaw?.description}</span>
                ))
              }
            </>
          }
        </section>
      </SkeletonTheme>
    </div>
  )
}
