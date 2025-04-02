import { useContext } from "react";
import "../Styles/Compile.css";
import { appModel } from "../Models/AppModel";
const CopyButton = () => {
  const { assembly, setHeader } = useContext(appModel);
  function CopyToClipboard() {
    navigator.clipboard
      .writeText(assembly)
      .then(() => {
        setHeader("Copied to Clipboard!");
      })
      .catch((err) => {
        setHeader("**error copying to clipboard**");
      });
  }
  return (
    <>
      <div className="Copy-Container">
        <button
          className="Copy-btn"
          onClick={() => {
            CopyToClipboard();
          }}
        >
          Copy
        </button>
      </div>
    </>
  );
};
export default CopyButton;
