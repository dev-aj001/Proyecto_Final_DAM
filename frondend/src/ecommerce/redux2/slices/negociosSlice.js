import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllInventories } from '../../inventories/components/services/remote/get/GetAllInventories';

// Thunk para obtener almacenes de forma asíncrona
export const fetchNegocios = createAsyncThunk(
  'negocios/fetchNegocios',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllInventories();
      //console.log('Almacenes obtenidos:', response);
      return response;  // Retorna los datos de almacenes
    } catch (error) {
      return rejectWithValue(error.message);  // Maneja el error
    }
  }
);

const negociosSlice = createSlice({
  name: 'negocios',
  initialState: {
    data: [],         // Almacena la lista de almacenes
    loading: false,   // Estado de carga
    error: null,      // Almacena el mensaje de error si ocurre
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNegocios.pending, (state) => {
        state.loading = true;
        state.error = null;
        //console.log('<<REDUX-REDUCER>>:<<fetchAlmacenes.pending>>', state);
      })
      .addCase(fetchNegocios.fulfilled, (state, action) => {
        //console.log('<<REDUX-REDUCER>>:<<fetchAlmacenes.fulfilled>>', action.payload);
        state.loading = false;
        state.data = action.payload;  // Almacena los datos de almacenes
      })
      .addCase(fetchNegocios.rejected, (state, action) => {
        //console.log('<<REDUX-REDUCER>>:<<fetchAlmacenes.rejected>>', action.payload);
        state.loading = false;
        state.error = action.payload;  // Almacena el error
      });
  },
});

export default negociosSlice.reducer;
