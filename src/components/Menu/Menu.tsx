import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Menu = () => {
  const [currentMenu, setCurrentMenu] = useState("attributes");
  const navigate = useNavigate();

  const handleCurrentMenu = (currentMenu: string) => {
    setCurrentMenu(currentMenu)
    navigate(currentMenu === "attributes" ? "/home" : currentMenu)
  }

  console.log(currentMenu);
  
  return (
    <div className="menu-container">
      <h4 
        className={`menu-item ${currentMenu === "attributes" && "selected"}`}
        onClick={() => handleCurrentMenu("attributes")}
      >
        Atributos
      </h4>
      <h4 
        className={`menu-item ${currentMenu === "perks" && "selected"}`}
        onClick={() => handleCurrentMenu("perks")}
      >
        Vantagens
      </h4>
      <h4 
        className={`menu-item ${currentMenu === "flaws" && "selected"}`}
        onClick={() => handleCurrentMenu("flaws")}
      >
        Desvantagens
      </h4>
      <h4 
        className={`menu-item ${currentMenu === "skills" && "selected"}`}
        onClick={() => handleCurrentMenu("skills")}
      >
        Perícias
      </h4>
      <h4 
        className={`menu-item ${currentMenu === "equips" && "selected"}`}
        onClick={() => handleCurrentMenu("equips")}
      >
        Equipamentos
      </h4>
    </div>
  )
}
