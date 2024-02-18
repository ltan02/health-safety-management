import { createContext, useState, useContext, useEffect } from "react";
import { auth } from "../firebase";

const AuthContext = createContext();
export function useAuthContext() {
  const signIn = async (email, password) => {
    const user = await auth.signInWithEmailAndPassword(email, password);
    // const idToken = await user.user.getIdToken();
    // console.log(idToken);
    return user;
  };
  const signOut = async () => {
    await auth.signOut();
  };
  return [useContext(AuthContext), { signIn, signOut }];
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const value = {
    user,
  };

  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => {
      unsubscribed();
    };
  }, []);

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
}
