import { useContext } from "react";
import { appModel } from "../Models/AppModel";
import "../Styles/header.css";
const AppHeader = () => {
  const { header } = useContext(appModel);
  return (
    <>
      <div className="header-container">
        <h1>{header}</h1>
      </div>
    </>
  );
};
export default AppHeader;
