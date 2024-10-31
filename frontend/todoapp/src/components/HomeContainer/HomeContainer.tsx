import { FaTasks, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import UserButton from '../UserButton/UserButton';

const HomeContainer = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 text-white relative">
      <div className="absolute top-5 right-5">
        <UserButton />
      </div>

      <h1 className="text-4xl font-bold mb-4">¡Bienvenido a Todo App!</h1>
      <p className="text-lg mb-8 text-center">
        Donde puedes realizar un seguimiento de tus tareas y mantenerte organizado.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full p-4">
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
          <FaTasks className="text-blue-600 text-4xl mb-4" />
          <h2 className="text-xl font-semibold">Gestiona tus tareas</h2>
          <p className="text-gray-700 text-center">
            Crea, edita y elimina tareas fácilmente con nuestra interfaz intuitiva.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
          <FaUserPlus className="text-blue-600 text-4xl mb-4" />
          <h2 className="text-xl font-semibold">Regístrate</h2>
          <p className="text-gray-700 text-center">
            Únete a nuestra comunidad y comienza a gestionar tus tareas hoy mismo.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
          <FaSignInAlt className="text-blue-600 text-4xl mb-4" />
          <h2 className="text-xl font-semibold">Inicia sesión</h2>
          <p className="text-gray-700 text-center">
            Accede a tu cuenta y mantén el control de tus tareas en un solo lugar.
          </p>
        </div>
      </div>
      
      <footer className="mt-12 text-gray-300">
        <p>© 2024 Todo App. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default HomeContainer;