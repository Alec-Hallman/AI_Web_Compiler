import { useContext } from "react";
import { appModel } from "../Models/AppModel";
import "../Styles/Compile.css";
const CompileButton = () => {
  const { Compile } = useContext(appModel);
  return (
    <>
      <button
        className="Compile-btn"
        onClick={() => {
          Compile();
        }}
      >
        Compile
      </button>
    </>
  );
};
export default CompileButton;
