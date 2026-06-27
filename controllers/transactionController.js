const supabase = require('../config/supabase');

// Get All
exports.getAll = async (req, res) => {
  try {
    const { search, jenis, id_kategori, id_wallet, start_date, end_date } = req.query;

    let query = supabase
      .from('transactions')
      .select('*, categories(nama_kategori, jenis), wallets(nama_wallet)')
      .eq('id_user', req.user.id_user)
      .order('tanggal', { ascending: false });

    if (jenis) query = query.eq('jenis', jenis);
    if (id_kategori) query = query.eq('id_kategori', id_kategori);
    if (id_wallet) query = query.eq('id_wallet', id_wallet);
    if (start_date) query = query.gte('tanggal', start_date);
    if (end_date) query = query.lte('tanggal', end_date);
    if (search) query = query.ilike('deskripsi', `%${search}%`);

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get One
exports.getOne = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, categories(nama_kategori), wallets(nama_wallet)')
      .eq('id_transaksi', req.params.id)
      .eq('id_user', req.user.id_user)
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create
exports.create = async (req, res) => {
  try {
    const { id_kategori, id_wallet, jenis, nominal, tanggal, deskripsi } = req.body;

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ id_user: req.user.id_user, id_kategori, id_wallet, jenis, nominal, tanggal, deskripsi }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, message: 'Transaksi ditambahkan', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update
exports.update = async (req, res) => {
  try {
    const { id_kategori, id_wallet, jenis, nominal, tanggal, deskripsi } = req.body;

    const { data, error } = await supabase
      .from('transactions')
      .update({ id_kategori, id_wallet, jenis, nominal, tanggal, deskripsi })
      .eq('id_transaksi', req.params.id)
      .eq('id_user', req.user.id_user)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Transaksi diperbarui', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete
exports.remove = async (req, res) => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id_transaksi', req.params.id)
      .eq('id_user', req.user.id_user);

    if (error) throw error;
    res.json({ success: true, message: 'Transaksi dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};