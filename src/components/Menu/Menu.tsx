import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Menu = () => {
  const [currentMenu, setCurrentMenu] = useState("attributes");
  const navigate = useNavigate();

  useEffect(() => {
    navigate(currentMenu === "attributes" ? "" : `${currentMenu}`)
  }, [currentMenu])
  
  return (
    <div className="menu-container">
      <h4 
        className={`menu-item ${currentMenu === "attributes" && "selected"}`}
        onClick={() => setCurrentMenu("attributes")}
      >
        Atributos
      </h4>
      <h4 
        className={`menu-item ${currentMenu === "perks" && "selected"}`}
        onClick={() => setCurrentMenu("perks")}
      >
        Vantagens
      </h4>
      <h4 
        className={`menu-item ${currentMenu === "flaws" && "selected"}`}
        onClick={() => setCurrentMenu("flaws")}
      >
        Desvantagens
      </h4>
      <h4 
        className={`menu-item ${currentMenu === "skills" && "selected"}`}
        onClick={() => setCurrentMenu("skills")}
      >
        Perícias
      </h4>
      <h4 
        className={`menu-item ${currentMenu === "equips" && "selected"}`}
        onClick={() => setCurrentMenu("equips")}
      >
        Equipamentos
      </h4>
    </div>
  )
}
