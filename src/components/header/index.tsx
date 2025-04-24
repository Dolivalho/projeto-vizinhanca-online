import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

//import logoImg from '../../assets/logo.svg'
import imgteste from '../../assets/images/logo_slogan.png'

import { Link } from 'react-router-dom'
import { FiUser, FiLogIn } from 'react-icons/fi'


export function Header() {
  const { signed, loadingAuth } = useContext(AuthContext);

  return (
    <div className="w-full flex items-center justify-center h-18 bg-white drop-shadow mb-4">
      <header className="flex w-full max-w-7xl items-center justify-between px-4 mx-auto">
        <Link to="/">
          <img
            src={imgteste}
            alt="Logo do site"
            className="w-90"
          />
        </Link>

        {!loadingAuth && signed && (
          <Link to="/dashboard">
            <div className="border-2 rounded-full p-1 border-gray-900">
              <FiUser size={22} color="#000" />
            </div>
          </Link>
        )}

        {!loadingAuth && !signed && (
          <Link to="/login">
            <div className="border-2 rounded-full p-1 border-gray-900">
              <FiLogIn size={22} color="#000" />
            </div>
          </Link>
        )}
      </header>
    </div>
  )
}