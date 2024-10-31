
const API_URL = process.env.NEXT_PUBLIC_API_URL; 

const fetchWithToken = async (url: string, method: string = 'GET', body?: any) => {
  const token = localStorage.getItem('token'); 

  const response = await fetch(`${API_URL}/${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error('Error en la solicitud'); 
  }

  return response.json();
};

export const getTasks = async () => {
  return await fetchWithToken('tasks');
};

export const createTask = async (title: string) => {
  return await fetchWithToken('tasks', 'POST', { title });
};

export const deleteTask = async (taskId: string) => {
  return await fetchWithToken(`tasks/${taskId}`, 'DELETE');
};

export const updateTask = async (taskId: string, data: { title: string }) => {
  return await fetchWithToken(`tasks/${taskId}`, 'PUT', data);
};