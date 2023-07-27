const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

const adminSecretKey = "as3cr3t";
const userSecretKey = "us3cr3t";

const generateAdminJwt = (admin) => {
  const payload = { username: admin.username };
  return jwt.sign(payload, adminSecretKey, { expiresIn: "1h" });
};

const generateUserJwt = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, userSecretKey, { expiresIn: "1h" });
};

const authenticateAdminJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, adminSecretKey, (err, user) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).send("Unauthorized");
  }
};

const authenticateUserJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, userSecretKey, (err, user) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(401).send("Unauthorized");
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  fs.readFile("admins.json", "utf-8", (err, data) => {
    if (err) throw err;
    const existingAdmin = JSON.parse(data).find(
      (a) => a.username === admin.username
    );
    if (existingAdmin) {
      res.status(403).json({ message: "Admin already exists" });
    } else {
      const newAdmin = JSON.parse(data);
      newAdmin.push(admin);
      fs.writeFile("admins.json", JSON.stringify(newAdmin), (err) => {
        if (err) throw err;
        const token = generateAdminJwt(newAdmin);
        res.status(201).json({ message: "Admin created successfully", token });
      });
    }
  });
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  fs.readFile("admins.json", "utf-8", (err, data) => {
    if (err) throw err;
    const admin = JSON.parse(data).find(
      (a) => a.username === username && a.password === password
    );
    if (admin) {
      const token = generateAdminJwt(admin);
      res.json({ message: "Logged in successfully", token });
    } else {
      res.status(403).json({ message: "Admin authentication failed" });
    }
  });
});

app.post("/admin/courses", authenticateAdminJwt, (req, res) => {
  // logic to create a course
  const course = req.body;
  fs.readFile("courses.json", "utf-8", (err, data) => {
    if (err) throw err;
    const newCourse = JSON.parse(data);
    course.id = newCourse.length + 1;
    newCourse.push(course);
    fs.writeFile("courses.json", JSON.stringify(newCourse), (err) => {
      if (err) throw err;
      res
        .status(201)
        .json({ message: "Course created successfully", courseId: course.id });
    });
  });
});

app.put("/admin/courses/:courseId", authenticateAdminJwt, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const updatedCourse = req.body;
  fs.readFile("courses.json", "utf-8", (err, data) => {
    if (err) throw err;
    const course = JSON.parse(data).find((c) => c.id === courseId);
    if (course) {
      const courses = JSON.parse(data);
      Object.assign(courses[courseId - 1], updatedCourse);
      fs.writeFile("courses.json", JSON.stringify(courses), (err) => {
        if (err) throw err;
        res.json({ message: "Course updated successfully" });
      });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  });
});

app.get("/admin/courses", authenticateAdminJwt, (req, res) => {
  // logic to get all courses
  fs.readFile("courses.json", "utf-8", (err, data) => {
    if (err) throw err;
    res.json({ courses: JSON.parse(data) });
  });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = req.body;
  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) throw err;
    const existingUser = JSON.parse(data).find(
      (u) => u.username === user.username
    );
    if (existingUser) {
      res.status(403).json({ message: "User already exists" });
    } else {
      const newUser = JSON.parse(data);
      newUser.push(user);
      fs.writeFile("users.json", JSON.stringify(newUser), (err) => {
        if (err) throw err;
        const token = generateUserJwt(newUser);
        res.status(201).json({ message: "User created successfully", token });
      });
    }
  });
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) throw err;
    const user = JSON.parse(data).find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      const token = generateUserJwt(user);
      res.json({ message: "Logged in successfully", token });
    } else {
      res.status(403).json({ message: "User authentication failed" });
    }
  });
});

app.get("/users/courses", authenticateUserJwt, (req, res) => {
  // logic to list all courses
  fs.readFile("courses.json", "utf-8", (err, data) => {
    if (err) throw err;
    const publishedCourses = JSON.parse(data).filter((c) => c.published);
    if (publishedCourses) {
      res.json({ courses: publishedCourses });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  });
});

app.post("/users/courses/:courseId", authenticateUserJwt, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);
  fs.readFile("courses.json", "utf-8", (err, data) => {
    if (err) throw err;
    const course = JSON.parse(data).find(
      (c) => c.id === courseId && c.published
    );
    if (course) {
      fs.readFile("users.json", "utf-8", (err, data) => {
        if (err) throw err;
        const userIndex = JSON.parse(data).findIndex(
          (u) => u.username === req.user.username
        );
        if (userIndex != -1) {
          const updatedUser = JSON.parse(data);
          if (!updatedUser[userIndex].purchasedCourses) {
            updatedUser[userIndex].purchasedCourses = [];
          }
          updatedUser[userIndex].purchasedCourses.push(course);
          fs.writeFile("users.json", JSON.stringify(updatedUser), (err) => {
            if (err) throw err;
            res.json({ message: "Course purchased successfully" });
          });
        } else {
          res.json({ message: "User does not exist" });
        }
      });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  });
});

app.get("/users/purchasedCourses", authenticateUserJwt, (req, res) => {
  // logic to view purchased courses
  fs.readFile("users.json", "utf-8", (err, data) => {
    const user = JSON.parse(data).find((u) => u.username === req.user.username);
    if (user && user.purchasedCourses) {
      res.json({ purchasedCourses: user.purchasedCourses });
    } else {
      res.status(404).json({ message: "No purchased courses" });
    }
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
