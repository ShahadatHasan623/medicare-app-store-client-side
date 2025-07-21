import React from "react";
import medicareLogo from "../../assets/medicarelogo.png";
import { Link } from "react-router";

const MedicareLogo = () => {
  return (
    <Link to='/' className="p-1 flex items-center gap-2">
      <img className="h-10 w-10" src={medicareLogo} alt="" />
      <h1 className="text-3xl font-bold text-secondary poppins">Medicare</h1>
    </Link>
  );
};

export default MedicareLogo;
