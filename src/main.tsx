import React from "react"
import ReactDOM from 'react-dom/client'
import { router } from "./App"
import './index.css'

import { RouterProvider } from "react-router-dom"
import AuthProvider from "./contexts/AuthContext"

import { register } from "swiper/element/bundle";

register();
import './swipercss.css';
//Abaixo é o import correto do swiper, porém como estava dando erro no build, optei por criar um arquivo css separado, fazer seu import lá e depois fazer o import desse arquivo css aqui.
// import 'swiper/css'; 
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';


import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      reverseOrder={false}
    />
    <AuthProvider>
      {/* Ao colocarmos o RouterProvider dentro do AuthProvider, conseguimos utilizar o AuthProvider em todas as rotas. Todas as rotas tem acesso ao RouterProvider */}
      <RouterProvider router={router} />{/* O RouterProvider é o children do nosso AuthProvider, ou seja, nossas rotas são as childrens do AuthProvider. */}
    </AuthProvider>
  </React.StrictMode>,
)
