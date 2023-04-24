import { createContext, useEffect, useState, ReactNode } from "react";


interface CharactersContextProps {
  attributes: Array<{}>;
  setAttributes: React.Dispatch<React.SetStateAction<Array<{}>>>;
  perks: Array<{}>;
  setPerks: React.Dispatch<React.SetStateAction<Array<{}>>>;
}

export const CharactersContext = createContext<CharactersContextProps>({
  attributes: [],
  setAttributes: () => {},
  perks: [],
  setPerks: () => {},
});

export const CharactersProvider = ({ children }: { children: ReactNode }) => {
  const [attributes, setAttributes] = useState([{}]);
  const [perks, setPerks] = useState([{}])


  return (
    <CharactersContext.Provider value={{ 
      attributes, setAttributes,
      perks, setPerks
    }}>
      {children}
    </CharactersContext.Provider>
  )
}