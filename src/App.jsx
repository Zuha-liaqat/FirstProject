import RouterView from "./router";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <RouterView/>
    </Provider>
  );
}

export default App;
