import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Task } from '../../interface/types';
import { RootState } from '../store';

export interface TaskState { // Make sure this is exported
  tasks: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  status: 'idle',
  error: null,
};

export const fetchTasks = createAsyncThunk<Task[], void, any>(
  'tasks/fetchTasks',
  async () => {
    const response = await axios.get('http://localhost:8080/tasks');
    return response.data;
  }
);

export const addTask = createAsyncThunk<Task, Task,any>(
  'tasks/addTask',
  async (task: Task) => {
    const response = await axios.post('http://localhost:8080/tasks', task);
    return response.data;
  }
);

export const updateTask = createAsyncThunk<Task, Task,any>(
  'tasks/updateTask',
  async (task: Task) => {
    const response = await axios.put(`http://localhost:8080/tasks/${task.id}`, task);
    return response.data;
  }
);

export const deleteTask = createAsyncThunk<number, number,any>(
  'tasks/deleteTask',
  async (taskId: number) => {
    await axios.delete(`http://localhost:8080/tasks/${taskId}`);
    return taskId;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        state.tasks[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      });
  }
});

export default taskSlice.reducer;
export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectTaskById = (state: RootState, taskId: number) => state.tasks.tasks.find(task => task.id === taskId);
