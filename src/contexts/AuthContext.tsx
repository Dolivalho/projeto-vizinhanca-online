import { ReactNode, createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConnection";


interface AuthProviderProps {
    children: ReactNode;
}

type AuthContextData = {
    signed: boolean;
    loadingAuth: boolean;
    handleInfoUser({ name, email, uid }: userProps): void;
    user: userProps | null;
}

interface userProps {
    uid: string;
    name: string | null;
    email: string | null;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<userProps | null>(null); //signed: false
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {

        //O onAuthStateChanged vai monitorar se o usuario esta logado ou não, ele é nosso olheiro.
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                //tem user logado
                setUser({
                    uid: user.uid,
                    name: user?.displayName,
                    email: user?.email
                })
                setLoadingAuth(false);
            } else {
                //Não tem user logado
                setUser(null);
                setLoadingAuth(false);
            }
        })

        //Quando o componente for desmontado, ele vai desmontar o onAuthStateChanged. Ele vai desmontar nosso olheiro para que não fique gastando processamento e perder performance dentro do nosso componente.
        //Caso nosso componente desmonte, eu cancelo a verificação de autenticação.
        return () => {
            unsub();
        }

    }, [])


    function handleInfoUser({ name, email, uid }: userProps) {
        setUser({
            name,
            email,
            uid,
        })
    }


        return (
            <AuthContext.Provider
                value={{
                    signed: !!user, //Quando colocamos !! convertemos uma variável em booleano, se eu converter uma variável null para booleano ele retorna false 
                    loadingAuth, //Ele serve para nos indicar se estamos carregando ou nao o nosso AuthContext.
                    handleInfoUser,
                    user
                }}
            >
                {children}
            </AuthContext.Provider>
        )
    }

    export default AuthProvider;