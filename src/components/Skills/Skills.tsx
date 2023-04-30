import { useParams } from 'react-router-dom';
import '../../App.scss';
import { useContext, useEffect, useState } from 'react';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase-config';

interface ISkillsData {
  id: string;
  description: string;
  mod: number;
  nh: number;
  attRelative: {attribute: string ; difficulty: string}[];
  points: number;
};

export const Skills = () => {
  const { id } = useParams<{ id: string }>();
  const { userId } = useContext(AuthGoogleContext);
  const skillsCollectionRef = collection(db, "users", userId, "characters", id ? id : "", "skills")
  const [skillsData, setSkillsData] = useState<ISkillsData[]>([{
    id: "",
    description: "",
    mod: 0,
    nh: 0,
    attRelative: [],
    points: 0,
  }])
  
  console.log(skillsData)

  // Getting Skills Data
  useEffect(() => {
    const getFlawsData = async () => {
      const querySnapshot = await getDocs(skillsCollectionRef);
      const docs = querySnapshot.docs.map((doc) => (({ 
        id: doc.id, 
        description: doc.data().description,
        mod: doc.data().mod,
        nh: doc.data().nh,
        attRelative: doc.data().attRelative,
        points: doc.data().points,
        ...doc.data()
      })));
      setSkillsData(docs)
    }
    getFlawsData();
  }, [])
  
  return (
    <div className="skills-container">
      {
        skillsData.map((skill) => {
          const attributeValue = skill.attRelative.find(obj => obj.attribute)?.attribute;
          const difficultyValue = skill.attRelative.find(obj => obj.difficulty)?.difficulty;
          
          return (
            <div className="skills-row">
              <span id="skill-name">{skill.description}</span>
              <span id="skill-mod">{skill.mod}</span>
              <span id="skill-nh">{skill.nh}</span>
              <span id="skill-attRelative">
              {attributeValue && difficultyValue && `${attributeValue.toUpperCase()} / ${difficultyValue.toUpperCase()}`}
              </span>
              <span id="skill-points">{skill.points}</span>
            </div>
          )
        })
      }
    </div>
  )
}
