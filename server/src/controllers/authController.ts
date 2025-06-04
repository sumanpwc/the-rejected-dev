import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log("🛂 Login attempt:", { username, password });

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    console.log("✅ User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    
    console.log("🔐 Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    console.log("📦 JWT_SECRET:", process.env.JWT_SECRET);

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    console.log("🎟️ JWT generated:", token);

    return res.status(200).json({
      success: true,
      token,
      user: { username: user.username, role: user.role }
    });
  } catch (error) {
    console.error("🔥 Login error:", error);
    return res.status(500).json({ success: false, message: 'Login failed', error });
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  try {
    // Check if username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Username already exists' });
    }

    // Create new user
    const user = new User({ username, password, role });
    await user.save();

    res.status(201).json({ success: true, message: 'User registered successfully', user: { username, role } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error });
  }
};
