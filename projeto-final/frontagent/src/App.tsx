import { ThemeProvider } from "./contexts/ThemeProvider";
import { RouterProvider } from "react-router-dom";
import Routes from "@/Routes";
import "./assets/styles/globals.css";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <RouterProvider router={Routes} />
    </ThemeProvider>
  );
}

export default App;
