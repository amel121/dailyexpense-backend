const supabase = require('../config/supabase');

exports.getReport = async (req, res) => {
  try {
    const { periode, bulan, tahun, minggu } = req.query;
    const id_user = req.user.id_user;

    let start, end;
    const now = new Date();

    if (periode === 'harian') {
      const tgl = req.query.tanggal || now.toISOString().split('T')[0];
      start = tgl; end = tgl;
    } else if (periode === 'mingguan') {
      const day = now.getDay();
      const startWeek = new Date(now);
      startWeek.setDate(now.getDate() - day);
      const endWeek = new Date(startWeek);
      endWeek.setDate(startWeek.getDate() + 6);
      start = startWeek.toISOString().split('T')[0];
      end = endWeek.toISOString().split('T')[0];
    } else if (periode === 'bulanan') {
      const b = bulan || now.getMonth() + 1;
      const t = tahun || now.getFullYear();
      start = `${t}-${String(b).padStart(2,'0')}-01`;
      end = new Date(t, b, 0).toISOString().split('T')[0];
    } else if (periode === 'tahunan') {
      const t = tahun || now.getFullYear();
      start = `${t}-01-01`;
      end = `${t}-12-31`;
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*, categories(nama_kategori), wallets(nama_wallet)')
      .eq('id_user', id_user)
      .gte('tanggal', start)
      .lte('tanggal', end)
      .order('tanggal', { ascending: false });

    if (error) throw error;

    const pemasukan = data.filter(t => t.jenis === 'pemasukan').reduce((s, t) => s + Number(t.nominal), 0);
    const pengeluaran = data.filter(t => t.jenis === 'pengeluaran').reduce((s, t) => s + Number(t.nominal), 0);

    res.json({
      success: true,
      data: {
        transaksi: data,
        ringkasan: { pemasukan, pengeluaran, saldo: pemasukan - pengeluaran, total: data.length }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};