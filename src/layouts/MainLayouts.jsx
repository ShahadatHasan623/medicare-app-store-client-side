import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';

const MainLayouts = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className='min-h-[calc(100vh-117px)] my-15'>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default MainLayouts;