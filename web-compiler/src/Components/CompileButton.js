import { useContext } from "react";
import { appModel } from "../Models/AppModel";
import OpenAI from "openai";
import "../Styles/Compile.css";

const CompileButton = () => {
  const { Compile, setErrors } = useContext(appModel);

  return (
    <>
      <button
        className="Compile-btn"
        onClick={() => {
          setErrors("");
          Compile();
        }}
      >
        Compile
      </button>
    </>
  );
};
export default CompileButton;
