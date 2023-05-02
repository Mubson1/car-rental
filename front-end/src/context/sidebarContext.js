import { createContext, useState } from "react";

const contextDefaultValues = {
  sideBarToggled: false,
  setSideBarToggled: () => null,
};

export const SidebarContext = createContext(contextDefaultValues);

export const SidebarContextProvider = ({ children }) => {
  const [sideBarToggled, setSideBarToggled] = useState(false);

  return (
    <SidebarContext.Provider value={{ sideBarToggled, setSideBarToggled }}>
      {children}
    </SidebarContext.Provider>
  );
};
