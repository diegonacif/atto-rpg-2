import { useParams } from 'react-router-dom';
import '../../App.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import ReactModal from 'react-modal';
import { skillsData as skillsStaticData } from '../../services/gameData';

interface ISkillsData {
  id: string;
  description: string;
  mod: number;
  nh: number;
  attRelative: {
    attribute: string;
    difficulty: string;
  };
  points: number;
};

interface ISelectedSkill {
  name: string,
  attRelative: {
    attribute: string;
    difficulty: string;
  }
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
    attRelative: {
      attribute: "",
      difficulty: ""
    },
    points: 0,
  }])

  // Modal Data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [selectedPoints, setSelectedPoints] = useState(0);
  const [currentSkillData, setCurrentSkillData] = useState<ISkillsData>({
    id: "",
    description: "",
    mod: 0,
    nh: 0,
    attRelative: {
      attribute: "",
      difficulty: "",
    },
    points: 0,
  });
  const [currentSelectedSkill, setCurrentSeletedSkill] = useState<ISelectedSkill | undefined>({
    name: "",
    attRelative: {
      attribute: "",
      difficulty: "",
    }
  });
  const [isNewSkill, setIsNewSkill] = useState(false);
  
  // Handling Modals
  const handleModalOpen = (skill: ISkillsData) => {
    setCurrentSkillData(skill);
    setSelectedSkill(skill.description);
    // setSelectedLevel(skill.level);
    setSelectedPoints(skill.points);
    setIsNewSkill(false);
    setIsModalOpen(true);
  };

  const handleNewSkillModalOpen = () => {
    setSelectedSkill("");
    setSelectedLevel(0);
    setSelectedPoints(0);
    setIsNewSkill(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    isMounted.current = false;
    setIsModalOpen(false);
    setTimeout(() => {
      setIsNewSkill(false);
    }, 200);
  };

  // Getting Skills Data
  useEffect(() => {
    const getSkillsData = async () => {
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
    getSkillsData();
  }, []);

  const modalCustomStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '1rem',

    },
  };

  const isMounted = useRef(false);

  const addNewSkill = async () => {
    console.log("add new skill");
  }
  const updateSkill = async () => {
    console.log("update new skill");
  }
  const deleteSkill = async () => {
    console.log("delete new skill");
  }
  
  return (
    <div className="skills-container">
      {
        skillsData.map((skill) => {
          const attributeValue = skill.attRelative?.attribute;
          const difficultyValue = skill.attRelative?.difficulty;
          
          return (
            <div className="skills-row">
              <span onClick={() => handleModalOpen(skill)} id="skill-name">{skill.description}</span>
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

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={() => handleCloseModal()}
        style={modalCustomStyles}
        closeTimeoutMS={150}
        ariaHideApp={false}
      >
        <div className="skills-modal">
          <select 
            id="skill-name"
            onChange={(e) => {
              const currentSkill = skillsStaticData.find(skill => skill.name === e.target.value);
              setSelectedSkill(e.target.value);
              selectedSkill && setCurrentSeletedSkill(currentSkill)
            }}
            value={selectedSkill}
          >
            <option value="">Selecione uma vantagem</option>
            {skillsStaticData.map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
          {/* <select 
            id="skill-level"
            onChange={(e) => setSelectedLevel(Number(e.target.value))}
            value={selectedLevel}
          >
            <option value="">0</option>
            {currentSelectedSkill ?
              currentSelectedSkill?.levels.map((level) => (
                <option key={`${level}`} value={`${level}`}>
                  {`${level}`}
                </option>
            )):
            <option value="">0</option>
          }
          </select> */}
          <span>{selectedPoints}</span>
          {isNewSkill ? 
            <button onClick={() => addNewSkill()}>Save</button>  :
            <>
              <button onClick={() => updateSkill()}>Update</button>
              <button onClick={() => deleteSkill()}>Delete</button>
            </>
          }
        </div>
      </ReactModal>
    </div>
  )
}
