import "./App.css";
import CodeField from "./Components/CodeBox";
import AppManager from "./Models/AppModel";
import OutputBox from "./Components/OutputBox";
import "./Styles/HomePage.css";
import ErrorBox from "./Components/ErrorBox";
import CompileButton from "./Components/CompileButton";
import AppHeader from "./Components/Header";

function App() {
  return (
    <>
      <AppManager>
        <AppHeader></AppHeader>
        <div className="app">
          <div className="InputOutput-Container">
            <CodeField></CodeField>
            <OutputBox></OutputBox>
          </div>
          <ErrorBox></ErrorBox>
          <CompileButton></CompileButton>
        </div>
      </AppManager>
    </>
  );
}

export default App;
