'use client';

import React, { useState } from 'react';
import { useAuth } from '../../components/Context/AuthContext';
import { useTasks } from '../../components/Context/TaskContext'; 
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Home = () => {
  const { user, logout } = useAuth();
  const { tasks, createNewTask, deleteExistingTask, editExistingTask } = useTasks(); // Usa el contexto de tareas
  const [isCreating, setIsCreating] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('El título es requerido'),
    }),
    onSubmit: async (values) => {
      await createNewTask(values.title); // Usa la función del contexto para crear una tarea
      formik.resetForm();
      setIsCreating(false);
      Swal.fire('Éxito', 'Tarea creada con éxito', 'success');
    },
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Bienvenido, {user}</h1>
      <button onClick={logout} className="mt-4 bg-red-500 text-white rounded p-2 hover:bg-red-600 transition duration-300">
        Cerrar Sesión
      </button>

      <h2 className="text-xl font-semibold mt-6">Tus Tareas:</h2>
      <ul className="list-disc ml-5">
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center">
            <span>{task.title}</span>
            <div>
              <button onClick={() => {
                const newTitle = prompt('Nuevo título:', task.title) || task.title;
                editExistingTask(task.id, newTitle); // Edita la tarea usando el contexto
              }} className="text-blue-500 mr-2">
                Editar
              </button>
              <button onClick={() => deleteExistingTask(task.id)} className="text-red-500">
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button onClick={() => setIsCreating(!isCreating)} className="mt-4 bg-green-500 text-white rounded p-2 hover:bg-green-600 transition duration-300">
        {isCreating ? 'Cancelar' : 'Crear Tarea'}
      </button>

      {isCreating && (
        <form onSubmit={formik.handleSubmit} className="mt-4 p-4 border border-gray-300 rounded-lg shadow-lg bg-white">
          <label className="block mb-2">Título de la Tarea:</label>
          <input
            type="text"
            {...formik.getFieldProps('title')}
            className={`border rounded w-full p-2 ${formik.touched.title && formik.errors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          {formik.touched.title && formik.errors.title && <p className="text-red-500">{formik.errors.title}</p>}
          <button type="submit" className="mt-2 w-full bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition duration-300">
            Crear
          </button>
        </form>
      )}
    </div>
  );
};

export default Home;