import { createContext, useState, useContext, useEffect } from "react";
import { auth } from "../firebase";

const AuthContext = createContext();

export function useAuthContext() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const token = await user.getIdToken();
                sessionStorage.setItem("token", token);
                sessionStorage.setItem("user", JSON.stringify(user));
                setUser(user);
            } else {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        const res = await auth.signInWithEmailAndPassword(email, password);
        const token = await res.user.getIdToken();
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);
    };

    const signUp = async (email, password) => {
        const res = await auth.createUserWithEmailAndPassword(email, password);
        const token = await res.user.getIdToken();
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);
    };

    const signOut = async () => {
        await auth.signOut();
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setUser(null);
    };

    const isUserLoggedIn = () => {
        return !!sessionStorage.getItem("token");
    };

    const getUserRole = () => {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user && user.role) {
            return user.role;
        }
        return undefined;
    };

    const value = {
        user,
        token: sessionStorage.getItem("token"),
        signIn,
        signOut,
        signUp,
        isUserLoggedIn,
        getUserRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
