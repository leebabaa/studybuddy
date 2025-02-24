
import jwt from 'jsonwebtoken'
// const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token
    
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Store user info in request
      console.log("Authenticated user:", req.user); // ✅ Debugging
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
  

export default authenticateUser;
