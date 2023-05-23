import charImg from '../../assets/charIcons/faceless.png';

export const CharacterResume = () => {
  return (
    <div className="character-resume-container">
      <div className="text-wrapper">
        <span>Nome: Nome</span>
        <span>Sexo: Sexo</span>
      </div>
      <div className="image-wrapper">
        <img src={charImg} alt="character image" />
      </div>
      <div className="text-wrapper">
        <span>Idade: Idade</span>
        <span>Altura: Altura</span>
        <span>Peso: Peso</span>
      </div>
    </div>
  )
}
