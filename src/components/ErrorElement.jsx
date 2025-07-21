import React from 'react';
import { useNavigate } from 'react-router';
import Lottie from 'lottie-react';
import errorPage from "../assets/pageNotFound.json";

const ErrorElement = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="text-center p-6 rounded-2xl shadow-2xl bg-white max-w-lg w-full">
                <div className="w-72 mx-auto">
                    <Lottie animationData={errorPage} loop={true} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mt-4">Oops! Page Not Found</h1>
                <p className="text-gray-500 mt-2 text-lg">
                    The page you're looking for doesn't exist or was moved.
                </p>
                <button
                    onClick={handleGoHome}
                    className="mt-6 px-8 py-3 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md hover:scale-105 transition-transform"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
};

export default ErrorElement;
