'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useAuth } from '../Context/AuthContext';

const Login = () => {
  const { login, error } = useAuth();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Email inválido')
        .required('El email es requerido'),
      password: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es requerida'),
    }),
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Has iniciado sesión con éxito.',
          icon: 'success',
          confirmButtonText: 'Ir al Home',
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/'); 
          }
        });
      } catch (err) {
        console.error(err);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto mt-10 p-4 border border-gray-300 rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <label className="block mb-2">Email:</label>
        <input
          type="email"
          {...formik.getFieldProps('email')}
          className={`border rounded w-full p-2 ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'}`}
        />
        {formik.touched.email && formik.errors.email && <p className="text-red-500">{formik.errors.email}</p>}
      </div>
      <div className="mb-4">
        <label className="block mb-2">Contraseña:</label>
        <input
          type="password"
          {...formik.getFieldProps('password')}
          className={`border rounded w-full p-2 ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'}`}
        />
        {formik.touched.password && formik.errors.password && <p className="text-red-500">{formik.errors.password}</p>}
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition duration-300">
        Iniciar Sesión
      </button>
    </form>
  );
};

export default Login;