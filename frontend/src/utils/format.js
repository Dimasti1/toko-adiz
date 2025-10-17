export const formatRupiah = (angka) => {
    if (!angka && angka !== 0) return 'Rp 0';
    
    const numberString = parseInt(angka, 10).toString();
    const sisa = numberString.length % 3;
    let rupiah = numberString.substr(0, sisa);
    const ribuan = numberString.substr(sisa).match(/\d{3}/g);
  
    if (ribuan) {
      const separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }
  
    return `Rp ${rupiah}`;
  };
  
  export const formatNumber = (angka) => {
    if (!angka && angka !== 0) return '0';
    return parseInt(angka, 10).toLocaleString('id-ID');
  };