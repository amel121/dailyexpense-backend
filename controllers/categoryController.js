const supabase = require('../config/supabase');

exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id_user', req.user.id_user)
      .order('jenis');
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nama_kategori, jenis } = req.body;
    const { data, error } = await supabase
      .from('categories')
      .insert([{ id_user: req.user.id_user, nama_kategori, jenis }])
      .select().single();
    if (error) throw error;
    res.status(201).json({ success: true, message: 'Kategori ditambahkan', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nama_kategori, jenis } = req.body;
    const { data, error } = await supabase
      .from('categories')
      .update({ nama_kategori, jenis })
      .eq('id_kategori', req.params.id)
      .eq('id_user', req.user.id_user)
      .select().single();
    if (error) throw error;
    res.json({ success: true, message: 'Kategori diperbarui', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id_kategori', req.params.id)
      .eq('id_user', req.user.id_user);
    if (error) throw error;
    res.json({ success: true, message: 'Kategori dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};