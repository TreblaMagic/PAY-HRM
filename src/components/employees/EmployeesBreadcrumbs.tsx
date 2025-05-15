
import React from "react";
import { Link } from "react-router-dom";

export function EmployeesBreadcrumbs() {
  return (
    <div className="bg-white px-8 py-4 text-sm flex items-center space-x-2">
      <Link to="/" className="text-gray-500 hover:text-primary">Home</Link>
      <span className="text-gray-400">/</span>
      <span className="text-gray-700">Employees</span>
    </div>
  );
}
