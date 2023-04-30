import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from "react-router-dom";
import { DocumentData, DocumentReference, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { useCollection } from 'react-firebase-hooks/firestore';

import '../../App.scss';
import { LoadingSquare } from '../LoadingSquare/LoadingSquare';

interface IFormData {
  strength: string,
  dexterity: string,
  intelligence: string,
  health: string,
  hitPoints: string,
  will: string,
  perception: string,
  fatiguePoints: string,
}

export const Attributes = () => {
  const { id } = useParams<{ id: string }>();
  const { userId } = useContext(AuthGoogleContext);
  const attributesCollectionRef = collection(db, "users", userId, "characters", id ? id : "", "attributes");
  const strengthRef = doc(attributesCollectionRef, 'strength');
  const dexterityRef = doc(attributesCollectionRef, 'dexterity');
  const intelligenceRef = doc(attributesCollectionRef, 'intelligence');
  const healthRef = doc(attributesCollectionRef, 'health');
  const hitPointsRef = doc(attributesCollectionRef, 'hit-points');
  const willRef = doc(attributesCollectionRef, 'will');
  const perceptionRef = doc(attributesCollectionRef, 'perception');
  const fatiguePointsRef = doc(attributesCollectionRef, 'fatigue-points');
  const [firestoreLoading, setFirestoreLoading] = useState(true);
  const [refreshAttributes, setRefreshAttributes] = useState(false);

  // Firestore loading
  const [value, loading, error] = useCollection(attributesCollectionRef,
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );
  useEffect(() => {
    setFirestoreLoading(loading);
  }, [loading])

  // const [attributes, setAttributes] = useState<{}>();
  
  // Hook Form Controller
  const {
    watch,
    register,
    setValue,
    getValues,
    trigger,
    formState: { errors, isValid }
  } = useForm<IFormData>({
    mode: "all",
    defaultValues: {
      strength: "10",
      dexterity: "10",
      intelligence: "10",
      health: "10",
      hitPoints: "10",
      will: "10",
      perception: "10",
      fatiguePoints: "10",
    }
  });

  // Primary Attributes Costs
  const [strCost, setStrCost] = useState(0);
  useEffect(() => {
    const strength = parseInt(getValues("strength"));
    if(isNaN(strength)) { return setStrCost(0) }
    setStrCost((strength - 10) * 10);
    setValue('strength', watch('strength') as string)
  }, [watch('strength')]);

  const [dexCost, setDexCost] = useState(0);
  useEffect(() => {
    const dexterity = parseInt(getValues("dexterity"));
    if(isNaN(dexterity)) { return setDexCost(0) }
    setDexCost((dexterity - 10) * 20);
    setValue('dexterity', watch('dexterity') as string)
  }, [watch('dexterity')]);

  const [intCost, setIntCost] = useState(0);
  useEffect(() => {
    const intelligence = parseInt(getValues("intelligence"));
    if(isNaN(intelligence)) { return setIntCost(0) }
    setIntCost((intelligence - 10) * 20);
    setValue('intelligence', watch('intelligence') as string)
  }, [watch('intelligence')]);

  const [hthCost, setHthCost] = useState(0);
  useEffect(() => {
    const health = parseInt(getValues("health"));
    if(isNaN(health)) { return setHthCost(0) }
    setHthCost((health - 10) * 10);
    setValue('health', watch('health') as string)
  }, [watch('health')]);

  // Secondary Attributes Costs
  const [hpCost, setHpCost] = useState(0);
  useEffect(() => {
    const hitPoints = parseInt(getValues("hitPoints"));
    const strength = parseInt(getValues("strength"));
    if(isNaN(hitPoints) || isNaN(strength)) { return setHpCost(0); }
    setHpCost((hitPoints - strength) * 2);
    setValue('hitPoints', watch('hitPoints'))
  }, [watch('hitPoints'), watch('strength')]);

  const [willCost, setWillCost] = useState(0);
  useEffect(() => {
    const will = parseInt(getValues("will"));
    const intelligence = parseInt(getValues("intelligence"));
    if(isNaN(will) || isNaN(intelligence)) { return setWillCost(0); }
    setWillCost((will - intelligence) * 5);
    setValue('will', watch('will'))
  }, [watch('will'), watch('intelligence')]);
  
  const [perCost, setPerCost] = useState(0);
  useEffect(() => {
    const perception = parseInt(getValues("perception"));
    const intelligence = parseInt(getValues("intelligence"));
    if(isNaN(perception) || isNaN(intelligence)) { return setPerCost(0); }
    setPerCost((perception - intelligence) * 5);
    setValue('perception', watch('perception'))
  }, [watch('perception'), watch('intelligence')]);
  
  const [fpCost, setFpCost] = useState(0);
  useEffect(() => {
    const fatiguePoints = parseInt(getValues("fatiguePoints"));
    const health = parseInt(getValues("health"));
    if(isNaN(fatiguePoints) || isNaN(health)) { return setFpCost(0); }
    setFpCost((fatiguePoints - health) * 3);
    setValue('fatiguePoints', watch('fatiguePoints'))
  }, [watch('fatiguePoints'), watch('health')]);

  // Save button condition
  const [saveButtonShow, setSaveButtonShow] = useState(false);
  const [originalStrength, setOriginalStrength] = useState(0);
  const [originalDexterity, setOriginalDexterity] = useState(0);
  const [originalIntelligence, setOriginalIntelligence] = useState(0);
  const [originalHealth, setOriginalHealth] = useState(0);
  const [originalHitpoints, setOriginalHitpoints] = useState(0);
  const [originalWill, setOriginalWill] = useState(0);
  const [originalPerception, setOriginalPerception] = useState(0);
  const [originalFatiguePoints, setOriginalFatiguePoints] = useState(0);

  useEffect(() => {
    if(
      originalStrength !== parseInt(getValues("strength")) ||
      originalDexterity !== parseInt(getValues("dexterity")) ||
      originalIntelligence !== parseInt(getValues("intelligence")) ||
      originalHealth !== parseInt(getValues("health")) ||
      originalHitpoints !== parseInt(getValues("hitPoints")) ||
      originalWill !== parseInt(getValues("will")) ||
      originalPerception !== parseInt(getValues("perception")) ||
      originalFatiguePoints !== parseInt(getValues("fatiguePoints"))
    ) { return setSaveButtonShow(true); } 
    else { return setSaveButtonShow(false); }
  }, [watch()])

  // Getting Attributes Data
  const getAttributeData = async (
      attributeRef: DocumentReference<DocumentData>,
      formRegister: any,
      setter: React.Dispatch<React.SetStateAction<number>>,
    ) => {
    const docSnap = await getDoc(attributeRef);
    if (docSnap.exists()) {
      const attributeData = docSnap.data() as { value: number };
      setValue(formRegister, attributeData.value);
      setter(attributeData.value)
    }
  }

  useEffect(() => {
    getAttributeData(strengthRef, 'strength', setOriginalStrength)
    getAttributeData(dexterityRef, 'dexterity', setOriginalDexterity)
    getAttributeData(intelligenceRef, 'intelligence', setOriginalIntelligence)
    getAttributeData(healthRef, 'health', setOriginalHealth)
    getAttributeData(hitPointsRef, 'hitPoints', setOriginalHitpoints)
    getAttributeData(willRef, 'will', setOriginalWill)
    getAttributeData(perceptionRef, 'perception', setOriginalPerception)
    getAttributeData(fatiguePointsRef, 'fatiguePoints', setOriginalFatiguePoints)
  }, [refreshAttributes])

  // Update attributes data
  const updateAttributesData = async () => {
    try{
      await setDoc(strengthRef, {value: parseInt(getValues('strength'))});
      await setDoc(dexterityRef, {value: parseInt(getValues('dexterity'))});
      await setDoc(intelligenceRef, {value: parseInt(getValues('intelligence'))});
      await setDoc(healthRef, {value: parseInt(getValues('health'))});
      await setDoc(hitPointsRef, {value: parseInt(getValues('hitPoints'))});
      await setDoc(willRef, {value: parseInt(getValues('will'))});
      await setDoc(perceptionRef, {value: parseInt(getValues('perception'))});
      await setDoc(fatiguePointsRef, {value: parseInt(getValues('fatiguePoints'))});
      setRefreshAttributes(current => !current)
    } catch (error) {
      console.error("Erro ao atualizar registro: ", error)
    }
  }

  return (
    <div className="attributes-container">
      {
        firestoreLoading ?
        <LoadingSquare /> :
        <div className="attributes-wrapper">
          <div className="attributes-primary">
            <div className="attribute-wrapper">
              <span>For</span>
              <div className="hexagon">
                <input type="number" {...register("strength")}/> 
              </div>
              <span className="attribute-cost">{strCost}</span>
            </div>
            <div className="attribute-wrapper">
              <span>Des</span>
              <div className="hexagon">
                <input type="number" {...register("dexterity")}/> 
              </div>
              <span className="attribute-cost">{dexCost}</span>
            </div>
            <div className="attribute-wrapper">
              <span>Int</span>
              <div className="hexagon">
                <input type="number" {...register("intelligence")}/> 
              </div>
              <span className="attribute-cost">{intCost}</span>
            </div>
            <div className="attribute-wrapper">
              <span>Vit</span>
              <div className="hexagon">
                <input type="number" {...register("health")}/> 
              </div>
              <span className="attribute-cost">{hthCost}</span>
            </div>
          </div>
          <div className="attributes-secondary">
            <div className="attribute-wrapper">
              <span>PV</span>
              <div className="hexagon">
                <input type="number" {...register("hitPoints")}/> 
              </div>
              <span className="attribute-cost">{hpCost}</span>
            </div>
            <div className="attribute-wrapper">
              <span>Vont</span>
              <div className="hexagon">
                <input type="number" {...register("will")}/> 
              </div>
              <span className="attribute-cost">{willCost}</span>
            </div>
            <div className="attribute-wrapper">
              <span>Per</span>
              <div className="hexagon">
                <input type="number" {...register("perception")}/> 
              </div>
              <span className="attribute-cost">{perCost}</span>
            </div>
            <div className="attribute-wrapper">
              <span>PF</span>
              <div className="hexagon">
                <input type="number" {...register("fatiguePoints")}/> 
              </div>
              <span className="attribute-cost">{fpCost}</span>
            </div>
          </div>
          {
            saveButtonShow &&
            <div className="save-button-wrapper">
              <button
                onClick={() => updateAttributesData()}
                style={{ 
                  margin: "2rem 0 0 1rem", 
                  padding: "0.25rem 0.5rem", 
                  backgroundColor: "#D1D5DB", 
                  borderRadius: "4px" 
                }} 
              >
                Save
              </button>
            </div>
          }
        </div>
      }
    </div>
  )
}
