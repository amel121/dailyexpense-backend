const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const generateToken = (user) => {
  return jwt.sign(
    { id_user: user.id_user, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register
exports.register = async (req, res) => {
  try {
    const { nama, email, username, password } = req.body;

    if (!nama || !email || !username || !password) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
    }

    // Cek email/username sudah ada
    const { data: existing } = await supabase
      .from('users')
      .select('id_user')
      .or(`email.eq.${email},username.eq.${username}`)
      .limit(1);

    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email atau username sudah digunakan' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([{ nama, email, username, password: hashedPassword }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    const token = generateToken(data);
    res.status(201).json({
      success: true,
      message: 'Register berhasil',
      token,
      user: {
        id_user: data.id_user,
        nama: data.nama,
        email: data.email,
        username: data.username
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' });
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .limit(1);

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    if (!users || users.length === 0) {
      return res.status(400).json({ success: false, message: 'Username tidak ditemukan' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Password salah' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: {
        id_user: user.id_user,
        nama: user.nama,
        email: user.email,
        username: user.username,
        foto: user.foto
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id_user, nama, email, username, foto, created_at')
      .eq('id_user', req.user.id_user)
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { nama, email } = req.body;
    const foto = req.file ? req.file.path : undefined;

    const updates = { nama, email };
    if (foto) updates.foto = foto;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id_user', req.user.id_user)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Profil diperbarui', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { password_lama, password_baru } = req.body;

    const { data: user } = await supabase
      .from('users')
      .select('password')
      .eq('id_user', req.user.id_user)
      .single();

    const isMatch = await bcrypt.compare(password_lama, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Password lama salah' });
    }

    const hashed = await bcrypt.hash(password_baru, 10);
    await supabase.from('users').update({ password: hashed }).eq('id_user', req.user.id_user);

    res.json({ success: true, message: 'Password berhasil diubah' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};