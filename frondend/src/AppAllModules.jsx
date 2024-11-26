import { RouterProvider } from "react-router-dom";
import Footer from "./share/footer/components/Footer";

//import  Router from "./navigation/NaviRoutesSecurity.jsx";
//import  Router from "./navigation/NaviRoutesEducation";
import  Router from "./navigation/NaviRoutesCommerce";

export default function AppAllModules() {
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