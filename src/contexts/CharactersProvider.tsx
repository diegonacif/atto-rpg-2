import { createContext, useEffect, useState, ReactNode } from "react";


interface CharactersContextProps {
  attributesSum: number;
  setAttributesSum: React.Dispatch<React.SetStateAction<number>>;
  perks: Array<{}>;
  setPerks: React.Dispatch<React.SetStateAction<Array<{}>>>;
}

export const CharactersContext = createContext<CharactersContextProps>({
  attributesSum: 0,
  setAttributesSum: () => {},
  perks: [],
  setPerks: () => {},
});

export const CharactersProvider = ({ children }: { children: ReactNode }) => {
  const [attributesSum, setAttributesSum] = useState(0);
  const [perks, setPerks] = useState([{}])

  // console.log(attributesSum);


  return (
    <CharactersContext.Provider value={{ 
      attributesSum, setAttributesSum,
      perks, setPerks
    }}>
      {children}
    </CharactersContext.Provider>
  )
}