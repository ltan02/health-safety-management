import { useState, useEffect, createContext, useContext } from "react";
import { auth } from "../firebase";
import useAxios from "../hooks/useAxios";

const AuthContext = createContext();
export function useAuthContext() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
    const { error, sendRequest } = useAxios();

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
        try {
            const firebaseResponse = await auth.signInWithEmailAndPassword(email, password);
            const token = await firebaseResponse.user.getIdToken();
            sessionStorage.setItem("token", token);

            const backendResponse = await sendRequest({
                url: `/users/${firebaseResponse.user.uid}`
            })

            sessionStorage.setItem("user", JSON.stringify(backendResponse));
            setUser(backendResponse);
        } catch (e) {
            console.error("SignIn error: ", e);
        }
    };

    const signUp = async (email, password, firstName, lastName, role) => {
        try {
            const firebaseResponse = await auth.createUserWithEmailAndPassword(email, password)
            const backendResponse = await sendRequest({
                url: "/auth/register",
                method: "POST",
                body: { id: firebaseResponse.user.uid, email, firstName, lastName, role },
            });

            if (error) {
                console.error("Failed to register user to firebase. " + error);
            }

            sessionStorage.setItem("token", firebaseResponse.getIdToken());
            sessionStorage.setItem("user", JSON.stringify(backendResponse));
            setUser(backendResponse);
        } catch (e) {
            console.error("SignUp error: ", e);
        }
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
