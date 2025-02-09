import { createContext, useContext, useState, ReactNode } from "react";

// ✅ Define the type for the user context
interface UserContextType {
  userId: string | null;
  setUserId: (id: string) => void;
}

// ✅ Create the UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

// ✅ UserProvider Component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("user_id") || null
  );

  // Save user_id to localStorage whenever it changes
  const updateUser = (id: string) => {
    setUserId(id);
    localStorage.setItem("user_id", id);
  };

  return (
    <UserContext.Provider value={{ userId, setUserId: updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Hook to use the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};