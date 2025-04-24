import { ReactNode } from "react"

//Esse componente container será usado em volta dos itens que quero manter centralizado (conteudo da pagina)
export function Container({children}: { children: ReactNode }){
    return(
        <div className="w-full max-w-7xl px-4 mx-auto">
            {children}
        </div>
    )
}