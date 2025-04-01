import { appModel } from "../Models/AppModel";
import "../Styles/OutputBox.css";
import { useContext, useState } from "react";
const OutputBox = () => {
  const { tokens, symTable, assembly } = useContext(appModel);
  const [buttonState, setButton] = useState(0);
  return (
    <>
      <div>
        <div className="Output-Header">
          <button
            className="Header-Btn"
            onClick={() => {
              setButton(0);
            }}
          >
            Tokens
          </button>
          <button
            className="Header-Btn"
            onClick={() => {
              setButton(1);
            }}
          >
            Symbol Table
          </button>
          <button
            className="Header-Btn"
            onClick={() => {
              setButton(2);
            }}
          >
            Assembly
          </button>
        </div>
        <div className="Output-Container">
          <pre>
            {buttonState === 0
              ? tokens
              : buttonState === 1
              ? symTable
              : assembly}
          </pre>
        </div>
      </div>
    </>
  );
};
export default OutputBox;
