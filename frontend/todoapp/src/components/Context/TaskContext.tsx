import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTasks, createTask, deleteTask, updateTask } from '../../helpers/task.helper'; // Importa tus funciones helper

interface TaskContextType {
  tasks: any[]; // Cambia 'any' por tu interfaz de tarea
  createNewTask: (title: string) => Promise<void>;
  deleteExistingTask: (taskId: string) => Promise<void>;
  editExistingTask: (taskId: string, newTitle: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<any[]>([]); // Cambia 'any' por tu interfaz de tarea

  const fetchTasks = async () => {
    const tasksData = await getTasks();
    setTasks(tasksData);
  };

  const createNewTask = async (title: string) => {
    const newTask = await createTask(title);
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const deleteExistingTask = async (taskId: string) => {
    await deleteTask(taskId);
    setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
  };

  const editExistingTask = async (taskId: string, newTitle: string) => {
    const updatedTask = await updateTask(taskId, { title: newTitle });
    setTasks((prevTasks) => prevTasks.map(task => (task.id === taskId ? updatedTask : task)));
  };

  useEffect(() => {
    fetchTasks(); // Cargar tareas al inicio
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, createNewTask, deleteExistingTask, editExistingTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};