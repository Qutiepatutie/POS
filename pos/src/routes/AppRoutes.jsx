import { Routes, Route } from "react-router-dom";

import MainLayout from "../layout/MainLayout.jsx"

import Main from "../pages/Main.jsx";
import Orders from "../pages/Orders.jsx";
import Inventory from "../pages/Inventory.jsx";
import SalesLog from "../pages/SalesLog.jsx";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element = { <Main />}/>
                <Route path="/inventory" element = { <Inventory />} />
                <Route path ="/saleslog" element = {<SalesLog />} />
            </Route>

            <Route path="/orders" element = { <Orders />} />
        </Routes>
    )
}