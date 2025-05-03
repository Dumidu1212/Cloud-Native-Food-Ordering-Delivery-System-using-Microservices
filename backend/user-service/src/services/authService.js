import ApiError from '../utils/ApiError.js';
import User     from '../models/User.js';
import bcrypt   from 'bcryptjs';
import jwt      from 'jsonwebtoken';

const { hash, compare } = bcrypt;
const { sign }          = jwt;

export async function registerUser({ name, email, phone, password, role }) {
  // 1) uniqueness check
  const existing = await User.findOne({ $or: [{ email }, { phone }] });
  if (existing) {
    const field = existing.email === email ? 'Email' : 'Phone number';
    throw new ApiError(400, `${field} already in use`);
  }

  // 2) hash & save
  const pwHash = await hash(password, 10);
  const user   = new User({
    name, email, phone,
    password: pwHash,
    role,
    status: role === 'customer' ? 'Active' : 'Pending'
  });
  await user.save();
  return user;
}

export async function loginUser({ email, password }) {
  console.log(`inside login user function`,email,password);
  console.log()
  const user = await User.findOne({ email });
  console.log("inside login user service")
  console.log(user);  
  if (!user) throw new ApiError(401, 'Invalid email or password');

  // 2) compare
  if (!(await compare(password, user.password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // 3) ensure active
  if (user.status !== 'Active') {
    throw new ApiError(403, `Your account is ${user.status}`);
  }

  // 4) sign
  const token = sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  return {
    token,
    userId: user._id,
    name:   user.name,
    role:   user.role,
    email:  user.email
  };
}

export async function getUserById(id) {
  const user = await User.findById(id).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
}

export const protect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Missing or invalid Authorization header');
  }
  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    throw new ApiError(401, 'Invalid or expired token');
  }
};