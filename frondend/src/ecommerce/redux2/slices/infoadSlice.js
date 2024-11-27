import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllInfoad } from '../../inventories/components/services/remote/get/GetAllInfoad';// Thunk para obtener almacenes de forma asíncrona

export const fetchInfoad = createAsyncThunk(
  'infoad/fetchInfoad',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllInfoad();
      console.log('Serires REDX obtenidos:', response);
      return response;  // Retorna los datos de almacenes
    } catch (error) {
      return rejectWithValue(error.message);  // Maneja el error
    }
  }
);

const infoadSlice = createSlice({
  name: 'infoad',
  initialState: {
    data: [],         // Almacena la lista de almacenes
    loading: false,   // Estado de carga
    error: null,      // Almacena el mensaje de error si ocurre
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInfoad.pending, (state) => {
        state.loading = true;
        state.error = null;
        //console.log('<<REDUX-REDUCER>>:<<fetchAlmacenes.pending>>', state);
      })
      .addCase(fetchInfoad.fulfilled, (state, action) => {
        //console.log('<<REDUX-REDUCER>>:<<fetchAlmacenes.fulfilled>>', action.payload);
        state.loading = false;
        state.data = action.payload;  // Almacena los datos de almacenes
      })
      .addCase(fetchInfoad.rejected, (state, action) => {
        //console.log('<<REDUX-REDUCER>>:<<fetchAlmacenes.rejected>>', action.payload);
        state.loading = false;
        state.error = action.payload;  // Almacena el error
      });
  },
});

export default infoadSlice.reducer;
