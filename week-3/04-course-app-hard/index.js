const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

const adminSecretKey = "as3cr3t";
const userSecretKey = "us3cr3t";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);

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
    res.sendStatus(401);
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
    res.sendStatus(401);
  }
};

mongoose.connect(
  "Insert your database url here",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Course-Selling-App",
  }
);

// Admin routes
app.post("/admin/signup", async (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (admin) {
    res.status(403).json({ message: "Admin already exist" });
  } else {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    const token = jwt.sign({ username, role: "Admin" }, adminSecretKey, {
      expiresIn: "1h",
    });
    res.status(201).json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", async (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: "Admin" }, adminSecretKey, {
      expiresIn: "1h",
    });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({
      message: "Admin not found or invalid username or password",
    });
  }
});

app.post("/admin/courses", authenticateAdminJwt, async (req, res) => {
  // logic to create a course
  const course = new Course(req.body);
  await course.save();
  res.json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", authenticateAdminJwt, async (req, res) => {
  // logic to edit a course
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
  });
  if (course) {
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authenticateAdminJwt, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find({});
  res.json({ Courses: courses });
});

// User routes
app.post("/users/signup", async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: "User already exist" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: "User" }, userSecretKey, {
      expiresIn: "1h",
    });
    res.status(201).json({ message: "User created successfully", token });
  }
});

app.post("/users/login", async (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, role: "User" }, userSecretKey, {
      expiresIn: "1h",
    });
    res.json({ message: "Logged in successfully", token });
  } else {
    res
      .status(403)
      .json({ message: "User not found or invalid username or password" });
  }
});

app.get("/users/courses", authenticateUserJwt, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({ published: true });
  res.json({ Courses: courses });
});

app.post("/users/courses/:courseId", authenticateUserJwt, async (req, res) => {
  // logic to purchase a course
  const course = await Course.findById(req.params.courseId);
  if (course) {
    const user = await User.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/users/purchasedCourses", authenticateUserJwt, async (req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({ username: req.user.username }).populate(
    "purchasedCourses"
  );
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(404).json("User not found");
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
