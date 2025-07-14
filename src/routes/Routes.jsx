import { createBrowserRouter } from "react-router";
import MainLayouts from "../layouts/MainLayouts";
import Home from "../pages/Home/Home";
import DashBoard from "../layouts/DashBoard";

export const router =createBrowserRouter([
    {
        path:'/',
        Component:MainLayouts,
        children:[
            {
                index:true,
                path:'/',
                Component:Home

            }
        ]
    },
    {
        path:"/dasboard",
        Component:DashBoard,
        children:[
            {
                
            }
        ]
    }
])