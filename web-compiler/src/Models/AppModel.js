import { createContext, useEffect, useState } from "react";

export const appModel = createContext(null);

const AppManager = ({ children }) => {
  const [userInput, setInput] = useState("Write Code here!");
  const [tokens, setTokens] = useState("Token Stream");
  const [symTable, setTable] = useState("Symbol Table");
  const [assembly, setAssembly] = useState("Assembly Output");
  function Compile() {
    console.log("Running compile function");
  }
  return (
    <appModel.Provider
      value={{ userInput, tokens, symTable, assembly, setInput, Compile }}
    >
      {children}
    </appModel.Provider>
  );
};
export default AppManager;
