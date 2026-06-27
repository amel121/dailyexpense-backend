const supabase = require('../config/supabase');

exports.getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('id_user', req.user.id_user);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nama_wallet, saldo_awal } = req.body;
    const { data, error } = await supabase
      .from('wallets')
      .insert([{ id_user: req.user.id_user, nama_wallet, saldo_awal }])
      .select().single();
    if (error) throw error;
    res.status(201).json({ success: true, message: 'Wallet ditambahkan', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { nama_wallet, saldo_awal } = req.body;
    const { data, error } = await supabase
      .from('wallets')
      .update({ nama_wallet, saldo_awal })
      .eq('id_wallet', req.params.id)
      .eq('id_user', req.user.id_user)
      .select().single();
    if (error) throw error;
    res.json({ success: true, message: 'Wallet diperbarui', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { error } = await supabase
      .from('wallets')
      .delete()
      .eq('id_wallet', req.params.id)
      .eq('id_user', req.user.id_user);
    if (error) throw error;
    res.json({ success: true, message: 'Wallet dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};