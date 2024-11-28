import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllseries } from '../../inventories/components/services/remote/get/GetAllServis';
// Thunk para obtener almacenes de forma asíncrona
export const fetchSeries = createAsyncThunk(
  'series/fetchSeries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllseries();
      // console.log('Serires REDX obtenidos:', response);
      return response;  // Retorna los datos de almacenes
    } catch (error) {
      return rejectWithValue(error.message);  // Maneja el error
    }
  }
);

const seriesSlice = createSlice({
  name: 'series',
  initialState: {
    data: [],         // Almacena la lista de almacenes
    loading: false,   // Estado de carga
    error: null,      // Almacena el mensaje de error si ocurre
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeries.pending, (state) => {
        state.loading = true;
        state.error = null;
        //// console.log('<<REDUX-REDUCER>>:<<fetchAlmacenes.pending>>', state);
      })
      .addCase(fetchSeries.fulfilled, (state, action) => {
        //// console.log('<<REDUX-REDUCER>>:<<fetchAlmacenes.fulfilled>>', action.payload);
        state.loading = false;
        state.data = action.payload;  // Almacena los datos de almacenes
      })
      .addCase(fetchSeries.rejected, (state, action) => {
        //// console.log('<<REDUX-REDUCER>>:<<fetchAlmacenes.rejected>>', action.payload);
        state.loading = false;
        state.error = action.payload;  // Almacena el error
      });
  },
});

export default seriesSlice.reducer;
