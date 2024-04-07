import { useState, useEffect, createContext, useContext } from "react";
import { auth } from "../firebase";
import useAxios from "../hooks/useAxios";
import { set } from "lodash";

const AuthContext = createContext();
export function useAuthContext() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (e) {
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("token");
                return null;
            }
        }
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        return null;
    });
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [createdId, setCreatedId] = useState(null);
    const { error, sendRequest, loading } = useAxios();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const token = await user.getIdToken(true);
                    sessionStorage.setItem("token", token);
                    const backendResponse = await sendRequest({
                        url: `/users/${user.uid}`,
                    });
                    sessionStorage.setItem("user", JSON.stringify(backendResponse));
                    setUser(backendResponse);
                } catch (e) {
                    console.error("Fetching user error: ", e);
                }
            } else {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        const firebaseResponse = await auth.signInWithEmailAndPassword(email, password);
        const token = await firebaseResponse.user.getIdToken();
        sessionStorage.setItem("token", token);

        const backendResponse = await sendRequest({
            url: `/users/${firebaseResponse.user.uid}`,
        });

        sessionStorage.setItem("user", JSON.stringify(backendResponse));
        setUser(backendResponse);
    };

    const signUp = async (email, password, firstName, lastName, role) => {
        try {
            const firebaseResponse = await auth.createUserWithEmailAndPassword(email, password);
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

    const createAccount = async (email, password, firstName, lastName, role) => {
        try {
            setIsCreatingAccount(true);
            const firebaseResponse = await auth.createUserWithEmailAndPassword(email, password);
            setCreatedId(firebaseResponse.user.uid);
            const backendResponse = await sendRequest({
                url: "/auth/register",
                method: "POST",
                body: { id: firebaseResponse.user.uid, email, firstName, lastName, role },
            });

            if (error) {
                console.error("Failed to register user to firebase. " + error);
            }
            return backendResponse;
        } catch (e) {
            console.error("SignUp error: ", e);
        } finally {
            setIsCreatingAccount(false);
        }
    };

    const signOut = async () => {
        await auth.signOut();
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setUser(null);
    };

    const isUserLoggedIn = () => {
        return !!sessionStorage.getItem("token") && !!sessionStorage.getItem("user");
    };

    const value = {
        user,
        token: sessionStorage.getItem("token"),
        signIn,
        signOut,
        signUp,
        isUserLoggedIn,
        createAccount,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
