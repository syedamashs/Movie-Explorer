import { createContext, useState, useEffect, useContext } from "react";
import { auth, provider } from "./firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
useEffect(() => onAuthStateChanged(auth, setUser), []);
const login = () => signInWithPopup(auth, provider);
const logout = () => signOut(auth);
return (
<AuthContext.Provider value={{ user, login, logout }}>
{children}
</AuthContext.Provider>
);
};