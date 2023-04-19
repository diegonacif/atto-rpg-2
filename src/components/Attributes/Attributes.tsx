import '../../App.scss';

export const Attributes = () => {

  return (
    <div className="attributes-container">
      <h3 id="attributes-title">Atributos</h3>
      
      <div className="attributes-wrapper">
        <div className="attributes-primary">
          <div className="attribute-wrapper">
            <span>For</span>
            <div className="hexagon">
              <input type="number" /> 
            </div>
            <span>0</span>
          </div>
          <div className="attribute-wrapper">
            <span>Des</span>
            <div className="hexagon">
              <input type="number" /> 
            </div>
            <span>0</span>
          </div>
          <div className="attribute-wrapper">
            <span>Int</span>
            <div className="hexagon">
              <input type="number" /> 
            </div>
            <span>0</span>
          </div>
          <div className="attribute-wrapper">
            <span>Vit</span>
            <div className="hexagon">
              <input type="number" /> 
            </div>
            <span>0</span>
          </div>
        </div>
        <div className="attributes-secondary">
          <div className="attribute-wrapper">
            <span>PV</span>
            <div className="hexagon">
              <input type="number" /> 
            </div>
            <span>0</span>
          </div>
          <div className="attribute-wrapper">
            <span>Vont</span>
            <div className="hexagon">
              <input type="number" /> 
            </div>
            <span>0</span>
          </div>
          <div className="attribute-wrapper">
            <span>Per</span>
            <div className="hexagon">
              <input type="number" /> 
            </div>
            <span>0</span>
          </div>
          <div className="attribute-wrapper">
            <span>PF</span>
            <div className="hexagon">
              <input type="number" /> 
            </div>
            <span>0</span>
          </div>
        </div>
      </div>
    </div>
  )
}
