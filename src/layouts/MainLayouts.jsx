import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TopBar from '../components/TopBar';

const MainLayouts = () => {
    return (
        <div>
            <TopBar></TopBar>
            <Navbar></Navbar>
            <div className='min-h-[calc(100vh-117px)]'>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MainLayouts;