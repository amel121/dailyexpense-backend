const supabase = require('../config/supabase');

exports.getAll = async (req, res) => {
  try {
    const { bulan, tahun } = req.query;
    let query = supabase
      .from('budgets')
      .select('*, categories(nama_kategori)')
      .eq('id_user', req.user.id_user);
    if (bulan) query = query.eq('bulan', bulan);
    if (tahun) query = query.eq('tahun', tahun);
    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { id_kategori, nominal_budget, bulan, tahun } = req.body;
    const { data, error } = await supabase
      .from('budgets')
      .insert([{ id_user: req.user.id_user, id_kategori, nominal_budget, bulan, tahun }])
      .select().single();
    if (error) throw error;
    res.status(201).json({ success: true, message: 'Budget ditambahkan', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id_kategori, nominal_budget, bulan, tahun } = req.body;
    const { data, error } = await supabase
      .from('budgets')
      .update({ id_kategori, nominal_budget, bulan, tahun })
      .eq('id_budget', req.params.id)
      .eq('id_user', req.user.id_user)
      .select().single();
    if (error) throw error;
    res.json({ success: true, message: 'Budget diperbarui', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id_budget', req.params.id)
      .eq('id_user', req.user.id_user);
    if (error) throw error;
    res.json({ success: true, message: 'Budget dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};