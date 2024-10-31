import { useAuth } from '../../components/Context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600">
      <h1 className="text-4xl font-bold text-white">
        {user ? `Bienvenido, ${user.email}!` : 'Bienvenido a nuestra aplicación!'}
      </h1>
    </div>
  );
};

export default Home;