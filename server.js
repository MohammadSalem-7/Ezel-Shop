const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

// الاتصال بقاعدة البيانات MongoDB
mongoose.connect("mongodb://localhost:27017/t10store", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// نموذج المستخدم
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model("User", UserSchema);

// تسجيل المستخدم
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.json({ message: "تم التسجيل بنجاح" });
});

// تسجيل الدخول
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });
    }

    const token = jwt.sign({ id: user._id }, "SECRET_KEY", { expiresIn: "1h" });
    res.json({ token });
});

// تشغيل السيرفر
app.listen(5000, () => console.log("🚀 السيرفر يعمل على المنفذ 5000"));


