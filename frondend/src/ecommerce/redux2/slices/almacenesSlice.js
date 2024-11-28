import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllAlmacenes } from '../../inventories/components/services/remote/get/GetAllAlmacenes';

// Thunk para obtener almacenes de forma asíncrona
export const fetchAlmacenes = createAsyncThunk(
  'almacenes/fetchAlmacenes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllAlmacenes();
      // console.log('Almacenes obtenidos:', response);
      return response;  // Retorna los datos de almacenes
    } catch (error) {
      return rejectWithValue(error.message);  // Maneja el error
    }
  }
);

const almacenesSlice = createSlice({
  name: 'almacenes',
  initialState: {
    data: [],         // Almacena la lista de almacenes
    loading: false,   // Estado de carga
    error: null,      // Almacena el mensaje de error si ocurre
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlmacenes.pending, (state) => {
        state.loading = true;
        state.error = null;
        // console.log('<<REDUX-REDUCER>>:<<fetchAlmacenes.pending>>', state);
      })
      .addCase(fetchAlmacenes.fulfilled, (state, action) => {
        // console.log('<<REDUX-REDUCER>>:<<fetchAlmacenes.fulfilled>>', action.payload);
        state.loading = false;
        state.data = action.payload;  // Almacena los datos de almacenes
      })
      .addCase(fetchAlmacenes.rejected, (state, action) => {
        // console.log('<<REDUX-REDUCER>>:<<fetchAlmacenes.rejected>>', action.payload);
        state.loading = false;
        state.error = action.payload;  // Almacena el error
      });
  },
});

export default almacenesSlice.reducer;
