import React from "react";
import Navbar from "../components/Navbar";
import MayaAssistant from "../maya/MayaAssistant";

const Admin = () => {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <MayaAssistant />
      </div>
    </div>
  );
};

export default Admin;
