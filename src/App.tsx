import { css } from "@emotion/css";
import { HomePage } from "./home-page/HomePage";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./login-page/LoginPage";

const styles = {
  app: css({
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
  }),
};

function App() {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path="*" element={<h1>404</h1>} />
        <Route path="login" element={<LoginPage />} />

        <Route path="manage" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
