import { configureStore } from '@reduxjs/toolkit';
import almacenesReducer from './slices/almacenesSlice'; // Importamos el reducer de almacenes
import negociosReducer from './slices/negociosSlice'; // Importamos el reducer de almacenes
import seriesReducer from './slices/seriesSlice'; // Importamos el reducer de almacenes
import movimientosReducer from './slices/movimientosSlice'; // Importamos el reducer de almacenes
import infoadReducer from './slices/infoadSlice'; // Importamos el reducer de almacenes


const store = configureStore({
  reducer: {
    almacenes: almacenesReducer,  // Registramos el reducer
    negocios: negociosReducer,
    series: seriesReducer,
    movimientos: movimientosReducer,
    infoad: infoadReducer,
    //ubicaciones: ubicacionesReducer,
  },
});

export default store;