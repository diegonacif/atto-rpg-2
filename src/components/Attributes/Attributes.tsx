import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from "react-router-dom";
import { DocumentData, DocumentReference, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase-config';
import { AuthGoogleContext } from '../../contexts/AuthGoogleProvider';
import { useCollection } from 'react-firebase-hooks/firestore';
import { LoadingSquare } from '../LoadingSquare/LoadingSquare';
import { numberMask } from '../../utils/numberMask';

import '../../App.scss';
import { ToastifyContext } from '../../contexts/ToastifyProvider';

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
  const attributesSumRef = doc(attributesCollectionRef, 'attributes-sum');
  const [attributesSum, setAttributesSum] = useState(0);
  const [firestoreLoading, setFirestoreLoading] = useState(true);
  const [refreshAttributes, setRefreshAttributes] = useState(false);

const { notifySuccess, notifyError } = useContext(ToastifyContext); // Toastify Context


  // Firestore loading
  const [value, loading, error] = useCollection(attributesCollectionRef,
    { snapshotListenOptions: { includeMetadataChanges: true } }
  );
  useEffect(() => {
    setTimeout(() => {
      setFirestoreLoading(loading);
    }, 150);
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

  // Attributes Sum
  useEffect(() => {
    setAttributesSum(strCost + dexCost + intCost + hthCost + hpCost + willCost + perCost + fpCost)
  }, [strCost, dexCost, intCost, hthCost, hpCost, willCost, perCost, fpCost])

  // Save button condition
  const [saveButtonShow, setSaveButtonShow] = useState(false);
  const [originalStrength, setOriginalStrength] = useState("");
  const [originalDexterity, setOriginalDexterity] = useState("");
  const [originalIntelligence, setOriginalIntelligence] = useState("");
  const [originalHealth, setOriginalHealth] = useState("");
  const [originalHitpoints, setOriginalHitpoints] = useState("");
  const [originalWill, setOriginalWill] = useState("");
  const [originalPerception, setOriginalPerception] = useState("");
  const [originalFatiguePoints, setOriginalFatiguePoints] = useState("");

  useEffect(() => {
    if(
      originalStrength !== getValues("strength") ||
      originalDexterity !== getValues("dexterity") ||
      originalIntelligence !== getValues("intelligence") ||
      originalHealth !== getValues("health") ||
      originalHitpoints !== getValues("hitPoints") ||
      originalWill !== getValues("will") ||
      originalPerception !== getValues("perception") ||
      originalFatiguePoints !== getValues("fatiguePoints")
    ) {
      return setSaveButtonShow(true); 
    } else { return setSaveButtonShow(false); }
  }, [watch()])

  // Getting Attributes Data
  const getAttributeData = async (
      attributeRef: DocumentReference<DocumentData>,
      formRegister: any,
      setter: React.Dispatch<React.SetStateAction<string>>,
    ) => {
    const docSnap = await getDoc(attributeRef);
    if (docSnap.exists()) {
      const attributeData = docSnap.data() as { value: string };
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
      await setDoc(strengthRef, {value: getValues('strength')});
      await setDoc(dexterityRef, {value: getValues('dexterity')});
      await setDoc(intelligenceRef, {value: getValues('intelligence')});
      await setDoc(healthRef, {value: getValues('health')});
      await setDoc(hitPointsRef, {value: getValues('hitPoints')});
      await setDoc(willRef, {value: getValues('will')});
      await setDoc(perceptionRef, {value: getValues('perception')});
      await setDoc(fatiguePointsRef, {value: getValues('fatiguePoints')});
      await setDoc(attributesSumRef, {value: attributesSum}).then(() => notifySuccess("Atributo atualizado."));
      setRefreshAttributes(current => !current)
    } catch (error) {
      console.error("Erro ao atualizar registro: ", error);
      notifyError("Erro ao atualizar atributo.")
    }
  }

  const [isHexagonActive, setIsHexagonActive] = useState("");

  // Applying only numbers mask on inputs
  useEffect(() => {
    setValue('strength', numberMask(watch('strength')))
    setValue('dexterity', numberMask(watch('dexterity')))
    setValue('intelligence', numberMask(watch('intelligence')))
    setValue('health', numberMask(watch('health')))
    setValue('hitPoints', numberMask(watch('hitPoints')))
    setValue('will', numberMask(watch('will')))
    setValue('perception', numberMask(watch('perception')))
    setValue('fatiguePoints', numberMask(watch('fatiguePoints')))
  },[watch('strength'), watch('dexterity'), watch('intelligence'), watch('health'),
    watch('hitPoints'), watch('will'), watch('perception'), watch('fatiguePoints')])

  return (
    <div className="attributes-container">
      {
        firestoreLoading === true?
        <LoadingSquare /> :
        <>
          <div className="attributes-wrapper">
            <div className="attributes-primary">
              <div className="attribute-wrapper">
                <span>For</span>
                <div className={`hexagon ${isHexagonActive === "strength" ? "active" : ""}`}>
                  <input 
                    type="text" 
                    maxLength={4}
                    {...register("strength")}
                    name="strength"
                    onFocus={() => setIsHexagonActive("strength")}
                    onBlur={() => setIsHexagonActive("")}
                  /> 
                </div>
                <span className="attribute-cost">{strCost}</span>
              </div>
              <div className="attribute-wrapper">
                <span>Des</span>
                <div className={`hexagon ${isHexagonActive === "dexterity" ? "active" : ""}`}>
                  <input 
                    type="text"
                    {...register("dexterity")}
                    name="dexterity"
                    onFocus={() => setIsHexagonActive("dexterity")}
                    onBlur={() => setIsHexagonActive("")}
                  /> 
                </div>
                <span className="attribute-cost">{dexCost}</span>
              </div>
              <div className="attribute-wrapper">
                <span>Int</span>
                <div className={`hexagon ${isHexagonActive === "intelligence" ? "active" : ""}`}>
                  <input 
                    type="text" 
                    {...register("intelligence")}
                    onFocus={() => setIsHexagonActive("intelligence")}
                    onBlur={() => setIsHexagonActive("")}
                  /> 
                </div>
                <span className="attribute-cost">{intCost}</span>
              </div>
              <div className="attribute-wrapper">
                <span>Vit</span>
                <div className={`hexagon ${isHexagonActive === "health" ? "active" : ""}`}>
                  <input 
                    type="text" 
                    {...register("health")}
                    onFocus={() => setIsHexagonActive("health")}
                    onBlur={() => setIsHexagonActive("")}
                  /> 
                </div>
                <span className="attribute-cost">{hthCost}</span>
              </div>
            </div>
            <div className="attributes-secondary">
              <div className="attribute-wrapper">
                <span>PV</span>
                <div className={`hexagon ${isHexagonActive === "hitPoints" ? "active" : ""}`}>
                  <input 
                    type="text" 
                    {...register("hitPoints")}
                    onFocus={() => setIsHexagonActive("hitPoints")}
                    onBlur={() => setIsHexagonActive("")}
                  /> 
                </div>
                <span className="attribute-cost">{hpCost}</span>
              </div>
              <div className="attribute-wrapper">
                <span>Vont</span>
                <div className={`hexagon ${isHexagonActive === "will" ? "active" : ""}`}>
                  <input 
                    type="text" 
                    {...register("will")}
                    onFocus={() => setIsHexagonActive("will")}
                    onBlur={() => setIsHexagonActive("")}
                  /> 
                </div>
                <span className="attribute-cost">{willCost}</span>
              </div>
              <div className="attribute-wrapper">
                <span>Per</span>
                <div className={`hexagon ${isHexagonActive === "perception" ? "active" : ""}`}>
                  <input 
                    type="text" 
                    {...register("perception")}
                    onFocus={() => setIsHexagonActive("perception")}
                    onBlur={() => setIsHexagonActive("")}
                  /> 
                </div>
                <span className="attribute-cost">{perCost}</span>
              </div>
              <div className="attribute-wrapper">
                <span>PF</span>
                <div className={`hexagon ${isHexagonActive === "fatiguePoints" ? "active" : ""}`}>
                  <input 
                    type="text" 
                    {...register("fatiguePoints")}
                    onFocus={() => setIsHexagonActive("fatiguePoints")}
                    onBlur={() => setIsHexagonActive("")}
                  /> 
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
        </>
      }
    </div>
  )
}
