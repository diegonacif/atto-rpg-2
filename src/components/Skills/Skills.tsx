import { useParams } from 'react-router-dom';
import '../../App.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
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

  // Points List
  const pointsList = [
    1, 2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80
  ]

  // Modal Data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedMod, setSelectedMod] = useState(0);
  const [selectedNh, setSelectedNh] = useState(0);
  const [selectedAttRelative, setSelectedAttRelative] = useState<{attribute: string | undefined, difficulty: string | undefined}>({
    attribute: "",
    difficulty: ""
  });
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

  console.log(selectedPoints)
  
  // Handling Modals
  const handleModalOpen = (skill: ISkillsData) => {
    setCurrentSkillData(skill);
    setSelectedSkill(skill.description);
    setSelectedAttRelative({
      attribute: skill.attRelative?.attribute,
      difficulty: skill.attRelative?.difficulty
    })
    setSelectedPoints(skill.points);
    setIsNewSkill(false);
    setIsModalOpen(true);
  };

  const handleNewSkillModalOpen = () => {
    setSelectedSkill("");
    setSelectedAttRelative({
      attribute: "",
      difficulty: ""
    })
    setSelectedPoints(1);
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
  }, [isModalOpen]);

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
    try {
      await addDoc(skillsCollectionRef, {
        description: selectedSkill,
        mod: selectedMod,
        nh: selectedNh,
        attRelative: {
          attribute: selectedAttRelative.attribute,
          difficulty: selectedAttRelative.difficulty
        },
        points: selectedPoints,
      }).then(
        () => {
          handleCloseModal();
          console.log("perícia criada com sucesso");
        }
      )
    } catch (error) {
      console.error("Erro ao criar perícia: ", error)
    }
  }

  const updateSkill = async () => {
    const docRef = doc(skillsCollectionRef, currentSkillData.id)
    try {
      await setDoc(docRef, {
        description: selectedSkill,
        mod: selectedMod,
        nh: selectedNh,
        attRelative: {
          attribute: selectedAttRelative.attribute,
          difficulty: selectedAttRelative.difficulty
        },
        points: selectedPoints,
      }).then(
        () => {
          handleCloseModal();
          console.log("perícia atualizada com sucesso!")
        }
      )
    } catch (error) {
      console.error("Erro ao atualizar perícia: ", error)
    }
  }

  const deleteSkill = async () => {
    const docRef = doc(skillsCollectionRef, currentSkillData.id)
    try {
      await deleteDoc(docRef)
      .then(
        () => {
          handleCloseModal();
          console.log("perícia deletada com sucesso!")
        }
      )
    } catch (error) {
      console.error("Erro ao deletar perícia", error)
    };
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

      <button onClick={() => handleNewSkillModalOpen()} id="new-skill-button">Nova perícia</button>

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
              // selectedSkill && setCurrentSeletedSkill(currentSkill)
              setSelectedAttRelative({
                attribute: currentSkill?.attRelative?.attribute,
                difficulty: currentSkill?.attRelative?.difficulty
              })
            }}
            value={selectedSkill}
          >
            <option value="">Selecione uma perícia</option>
            {skillsStaticData.map((option) => (
              <option key={option.name} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
          <span>{selectedAttRelative?.attribute} / {selectedAttRelative.difficulty}</span>
          <input 
            type="string"
            id="skill-mod"
            value={selectedMod}
            onChange={(e) => setSelectedMod(Number(e.target.value))}
          />
          <span>nh: {selectedNh}</span>
          <select 
            name="select-points" 
            id="select-points"
            value={selectedPoints}
            onChange={(e) => setSelectedPoints(Number(e.target.value))}
          >
            {
              pointsList.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))
            }
          </select>
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
