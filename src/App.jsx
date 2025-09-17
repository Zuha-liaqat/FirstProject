import RouterView from "./router";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <RouterView/>
       <Toaster position="bottom-right" reverseOrder={false} />
    </Provider>
  );
}

export default App;
