import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase-config';

import hpOrb from '../../assets/hp-potion.png';
import fpOrb from '../../assets/mana-potion.png';

export const Footer = () => {
  const { id } = useParams<{ id: string }>();
  const { userId } = useContext(AuthGoogleContext);
  const attributesCollectionRef = collection(db, "users", userId, "characters", id ? id : "", "attributes");
  const hpRef = doc(attributesCollectionRef, 'current-hit-points');
  const fpRef = doc(attributesCollectionRef, 'current-fatigue-points');
  const maxHpRef = doc(attributesCollectionRef, 'hit-points');
  const maxFpRef = doc(attributesCollectionRef, 'fatigue-points');

  const [originalCurrentHp, setOriginalCurrentHp] = useState("");
  const [originalCurrentFp, setOriginalCurrentFp] = useState("");
  const [maxHpValue, setMaxHpValue] = useState(0);
  const [maxFpValue, setMaxFpValue] = useState(0);
  const [hpValue, setHpValue] = useState("");
  const [fpValue, setFpValue] = useState("");
  const [refresh, setRefresh] = useState(false);

  // Getting Max HP and FP data
  useEffect(() => {
    const getMaxHpData = async () => {
      const querySnapshot = await getDoc(maxHpRef);
      const data = querySnapshot.data();
      if(data) {
        setMaxHpValue(data.value);
      } else {
        return;
      }
    };
    getMaxHpData();
  }, [refresh])

  useEffect(() => {
    const getMaxFpData = async () => {
      const querySnapshot = await getDoc(maxFpRef);
      const data = querySnapshot.data();
      if(data) {
        setMaxFpValue(data.value);
      } else {
        return;
      }
    };
    getMaxFpData();
  }, [refresh])

  // Getting Hp and Fp data
  useEffect(() => {
    const getHpData = async () => {
      const querySnapshot = await getDoc(hpRef);
      const data = querySnapshot.data();
      if(data) {
        setOriginalCurrentHp(data.value);
        setHpValue(data.value);
      } else {
        return;
      }
    };
    getHpData();
  }, [refresh])

  useEffect(() => {
    const getFpData = async () => {
      const querySnapshot = await getDoc(fpRef);
      const data = querySnapshot.data();
      if(data) {
        setOriginalCurrentFp(data.value);
        setFpValue(data.value);
      } else {
        return;
      }
    };
    getFpData();
  }, [refresh])

  // Updating Hp and Fp data

  const handleUpdateHp = () => {
    if(hpValue !== originalCurrentHp) {
      updateHp();
    } else {
      console.log("not updating hp")
    }
  };

  const handleUpdateFp = () => {
    if(fpValue !== originalCurrentFp) {
      updateFp();
    } else {
      console.log("not updating fp")
    }
  };

  const updateHp = async() => {
    try {
      await setDoc(hpRef, {value: hpValue})
      .then(
        () => {
          setRefresh(current => !current);
          console.log("HP atualizado com sucesso!");
        }
      )
    } catch (error) {
      console.error("Erro ao atualizar current HP", error);
    }
  };

  const updateFp = async() => {
    try {
      await setDoc(fpRef, {value: fpValue})
      .then(
        () => {
          setRefresh(current => !current);
          console.log("FP atualizado com sucesso!");
        }
      )
    } catch (error) {
      console.error("Erro ao atualizar current FP", error);
    }
  };

   // Validating Inputs
  const handleHpInputChange = (value: string) => {
    const inputValue = value;
    let formattedHpValue = formatInputValue(inputValue);

    if (Number(formattedHpValue) > maxHpValue) {
      formattedHpValue = String(maxHpValue);
    }

    setHpValue(formattedHpValue)
  };

  const handleFpInputChange = (value: string) => {
    const inputValue = value;
    let formattedFpValue = formatInputValue(inputValue);

    if (Number(formattedFpValue) > maxFpValue) {
      formattedFpValue = String(maxFpValue);
    }

    setFpValue(formattedFpValue)
  };

  const formatInputValue = (inputValue: string) => {
    let formattedValue = inputValue.trim();
  
    // Remover caracteres não numéricos, exceto o sinal de negativo no início
    formattedValue = formattedValue.replace(/[^\d-]/g, '');
  
    // Remover zeros à esquerda, exceto o zero negativo
    formattedValue = formattedValue.replace(/^0+(?!$)/, '');

    // Remover sinais de negativo no meio ou no final dos números
  formattedValue = formattedValue.replace(/(-.*)-/g, '$1');

  // Remover sinais de negativo se houver apenas um zero
  if (formattedValue === '-') {
    formattedValue = '';
  }
  
    return formattedValue;
  };
  

  return (
    <div className="footer-container">
      <div className="hp-wrapper">
        <img src={hpOrb} alt="health orb" />
        <input 
          type="text" 
          id="hp-input" 
          onChange={(e) => handleHpInputChange(e.target.value)}
          onBlur={() => handleUpdateHp()}
          value={hpValue}
        />
      </div>
      <div className="fp-wrapper">
        <img src={fpOrb} alt="fatigue orb" />
        <input 
          type="text" 
          id="fp-input" 
          onChange={(e) => handleFpInputChange(e.target.value)}
          onBlur={() => handleUpdateFp()}
          value={fpValue} />
      </div>
    </div>
  )
}
