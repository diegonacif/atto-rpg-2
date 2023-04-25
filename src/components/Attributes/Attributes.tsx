import { useForm } from 'react-hook-form';
import { useParams } from "react-router-dom";

import '../../App.scss';

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

  return (
    <div className="attributes-container">
      <div className="attributes-wrapper">
        <div className="attributes-primary">
          <div className="attribute-wrapper">
            <span>For</span>
            <div className="hexagon">
              <input type="number" {...register("strength")}/> 
            </div>
            <span className="attribute-cost">0</span>
          </div>
          <div className="attribute-wrapper">
            <span>Des</span>
            <div className="hexagon">
              <input type="number" {...register("dexterity")}/> 
            </div>
            <span className="attribute-cost">0</span>
          </div>
          <div className="attribute-wrapper">
            <span>Int</span>
            <div className="hexagon">
              <input type="number" {...register("intelligence")}/> 
            </div>
            <span className="attribute-cost">0</span>
          </div>
          <div className="attribute-wrapper">
            <span>Vit</span>
            <div className="hexagon">
              <input type="number" {...register("health")}/> 
            </div>
            <span className="attribute-cost">0</span>
          </div>
        </div>
        <div className="attributes-secondary">
          <div className="attribute-wrapper">
            <span>PV</span>
            <div className="hexagon">
              <input type="number" {...register("hitPoints")}/> 
            </div>
            <span className="attribute-cost">0</span>
          </div>
          <div className="attribute-wrapper">
            <span>Vont</span>
            <div className="hexagon">
              <input type="number" {...register("will")}/> 
            </div>
            <span className="attribute-cost">0</span>
          </div>
          <div className="attribute-wrapper">
            <span>Per</span>
            <div className="hexagon">
              <input type="number" {...register("perception")}/> 
            </div>
            <span className="attribute-cost">0</span>
          </div>
          <div className="attribute-wrapper">
            <span>PF</span>
            <div className="hexagon">
              <input type="number" {...register("fatiguePoints")}/> 
            </div>
            <span className="attribute-cost">0</span>
          </div>
        </div>
      </div>
    </div>
  )
}
