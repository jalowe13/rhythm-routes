import "./App.css";
import React, { createContext, useContext, useState } from "react";
import MenuHeader from "./components/MenuHeader.tsx";
import ContentView from "./components/ContentView.tsx";
// Jacob Lowe

export enum View {
  Dashboard,
}

// Define the context type
interface ViewContextType {
  view: View;
  setView: (newView: View) => void;
}

// Create the context with explicit type
export const ViewContext = createContext<ViewContextType | undefined>(
  undefined,
);

// Custom hook for using context to ensure it's used within a provider
export const useView = () => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
};

const App: React.FC = () => {
  // Change Default Start View
  const [view, setView] = useState<View>(View.Dashboard);

  return (
    <ViewContext.Provider value={{ view, setView }}>
      <div>
        <MenuHeader /> {/* Removed setView prop */}
        <ContentView />
      </div>
    </ViewContext.Provider>
  );
};

export default App;
