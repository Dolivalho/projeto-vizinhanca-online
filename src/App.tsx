import { createBrowserRouter } from "react-router-dom"
import { Home } from "./pages/home"
import { Login } from "./pages/login"
import { Register } from "./pages/register"
import { Dashboard } from "./pages/dashboard"
import { New } from "./pages/dashboard/new"
import { ItemDetail } from "./pages/item"

import { Layout } from "./components/layout"
import { Private } from "./routes/Private"

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: '/',
        element: <Home/>
      },
      {
        path: '/item/:id',
        element: <ItemDetail/>
      },
      {
        path: '/dashboard',
        element: <Private> <Dashboard/> </Private>
      },
      {
        path: '/dashboard/new',
        element: <Private> <New/> </Private>
      }
    ]
  },
  //As rotas acima não receberão o element Layout das demais páginas, portanto estão fora do array children acima
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>
  }
])


export {router};
