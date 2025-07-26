export const isAdmin = (req, res, next) => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Admin access only" });
    }
  };
  
  export const isUser = (req, res, next) => {
    if (req.user.role === "user") {
      next();
    } else {
      res.status(403).json({ message: "User access only" });
    }
  };
  