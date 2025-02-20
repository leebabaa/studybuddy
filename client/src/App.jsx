import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./HomePage";
import LandingPage from "./Pages/LandingPage";
import Courses from "./Pages/Courses";
import CourseContent from "./Pages/CourseContent"; 
import CourseDescription from "./Pages/CourseDescription";
import YourBuddy from './Pages/YourBuddy';


function App() {
  return (
    <Router>

      <Routes>
      <Route path="/" element={<Layout />}>
      <Route path="/yourbuddy" element={<YourBuddy />} />
      
      <Route path="/courses" element={<Courses />} />
      
      <Route path="/course/:courseName" element={<CourseDescription />} />
      <Route path="/course-content/:courseName" element={<CourseContent />} />
        
          <Route index element={<HomePage />} /> {/* Default route */}
          <Route path="landing" element={<LandingPage />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
