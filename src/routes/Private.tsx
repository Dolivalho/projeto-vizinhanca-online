//NESSE ARQUIVO É FEITO O NOSSO CONTROLE DE ROTAS PRIVADAS
import { ReactNode, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";


interface PrivateProps{
    children: ReactNode
}
export function Private({ children }: PrivateProps): any {
    const { signed, loadingAuth } = useContext(AuthContext);

    if(loadingAuth){
        return <p>Carregando...</p>
    }

    if(!signed){
        return <Navigate to="/login" />;
    }

    return children;
}




























