import React, { useEffect } from 'react';
import { RouterProvider } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlmacenes } from './ecommerce/redux2/slices/almacenesSlice';
import { fetchNegocios } from './ecommerce/redux2/slices/negociosSlice';
import { fetchSeries } from './ecommerce/redux2/slices/seriesSlice';
import { fetchMovimiento } from './ecommerce/redux2/slices/movimientosSlice';
import { fetchInfoad } from './ecommerce/redux2/slices/infoadSlice';

import Footer from "./share/footer/components/Footer";
import Router from "./navigation/NaviRoutesCommerce";

export default function AppAllModules() {

    const dispatch = useDispatch();

  useEffect(() => {
    // Despacha la acción para obtener los almacenes cuando el componente se monta
    dispatch(fetchAlmacenes());
    dispatch(fetchNegocios());
    dispatch(fetchSeries());
    dispatch(fetchMovimiento());
    dispatch(fetchInfoad());
  }, [dispatch]);

    return (
        <>
            <div id='div-app'>
                {/* <h1>Main App - All Modules</h1> */}
                <RouterProvider router={Router} />
                <div id='div-footer' style={{ color: '#c9c1d9' }}>
                    <Footer />
                </div>
            </div>
        </>
    );
}