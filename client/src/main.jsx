import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from './App';
// import CourseDescription from './Pages/CourseDescription.jsx';


createRoot(document.getElementById("root")).render(
  <StrictMode>
   {/* <CourseDescription/> */}
  

    <App /> 
  </StrictMode>
);
