import { appModel } from "../Models/AppModel";
import "../Styles/OutputBox.css";
import { useContext, useState } from "react";
import CompileButton from "./CompileButton";
import CopyButton from "./CopyButton";
const OutputBox = () => {
  const { tokens, symTable, assembly, info } = useContext(appModel);
  const [buttonState, setButton] = useState(4);
  return (
    <>
      <div>
        <div className="Output-Header">
          <button
            className="Header-Btn"
            onClick={() => {
              setButton(3);
            }}
          >
            Info
          </button>
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
            Symbols
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
          {buttonState === 2 ? <CopyButton></CopyButton> : <></>}

          <pre>
            {buttonState === 0
              ? tokens
              : buttonState === 1
              ? symTable
              : buttonState === 2
              ? assembly
              : info}
          </pre>
          {buttonState === 3 ? (
            <div className="link-box">
              <a
                href="https://cpulator.01xz.net/?sys=arm-de1soc&d_audio=48000"
                target="_blank"
                rel="noopener noreferrer"
              >
                CPUlator
              </a>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};
export default OutputBox;
