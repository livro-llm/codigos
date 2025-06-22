import { ThemeProvider } from "./contexts/ThemeProvider";
import Home from "./pages/Home";
import "./assets/styles/globals.css";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <Home />
    </ThemeProvider>
  );
}

export default App;
