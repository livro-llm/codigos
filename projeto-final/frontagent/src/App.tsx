import { RouterProvider } from "react-router-dom";
import Routes from "@/Routes";
import { ThemeProvider } from "./contexts/ThemeProvider";
import "./assets/styles/globals.css";
import "./assets/styles/themes.css";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <RouterProvider router={Routes} />
    </ThemeProvider>
  );
}

export default App;
