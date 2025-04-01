import { appModel } from "../Models/AppModel";
import "../Styles/CodeBox.css";
import { useContext, useState, useRef } from "react";

const CodeField = () => {
  const { setInput, userInput } = useContext(appModel);
  const [lineNumber, setLines] = useState([""]);
  const lineNumContainer = useRef(null);
  const inputContainer = useRef(null);
  function countLines(text) {
    setLines(text.split("\n"));
  }
  const syncScroll = (e) => {
    if (lineNumContainer.current && inputContainer.current) {
      if (e.target === inputContainer.current) {
        lineNumContainer.current.scrollTop = e.target.scrollTop;
      } else {
        inputContainer.current.scrollTop = e.target.scrollTop;
      }
    }
  };
  return (
    <>
      <div className="InputContainer">
        <div
          className="InputBoxLeft"
          ref={lineNumContainer}
          onScroll={syncScroll}
        >
          {lineNumber.map((text, index) => {
            return <p className="InputLineNum">{index}</p>;
          })}
        </div>
        <div className="InputBox">
          <textarea
            onScroll={syncScroll}
            className="codeInput"
            wrap="off"
            ref={inputContainer}
            value={userInput}
            onChange={(e) => {
              setInput(e.target.value);
              countLines(e.target.value);
            }}
          />
        </div>
      </div>
    </>
  );
};
export default CodeField;
