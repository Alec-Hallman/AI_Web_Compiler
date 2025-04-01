import { useContext } from "react";
import "../Styles/ErrorBox.css";
import { appModel } from "../Models/AppModel";
const ErrorBox = () => {
  const { errorLog } = useContext(appModel);
  return (
    <>
      <div>
        <div className="Error-header">Errors</div>
        <div className="Error-container">
          <pre>{errorLog}</pre>
        </div>
      </div>
    </>
  );
};
export default ErrorBox;
