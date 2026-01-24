import { css } from "@emotion/css";
import { HomePage } from "./home-page/HomePage";

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
      <HomePage />
    </div>
  );
}

export default App;
