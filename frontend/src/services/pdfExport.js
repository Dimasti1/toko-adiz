import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Fungsi helper untuk format tanggal
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Fungsi helper untuk format angka
const formatCurrency = (amount) => {
  return `Rp ${parseInt(amount).toLocaleString('id-ID')}`;
};

export const exportToPDF = (transaksi, filters, totalPendapatan) => {
  try {
    console.log('Starting PDF export with data:', transaksi.length, 'transactions');
    
    // Create new PDF document - landscape untuk tabel
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Judul Laporan
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('LAPORAN TRANSAKSI TOKO ADIZ', pageWidth / 2, 15, { align: 'center' });

    // Hanya tampilkan tanggal cetak di kanan atas
    const tanggalCetak = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Dicetak pada: ${tanggalCetak}`, pageWidth - 14, 25, { align: 'right' });

    // Prepare data untuk tabel
    const tableData = transaksi.map((item, index) => {
      const id_transaksi = item.id_transaksi || 0;
      const tanggal = item.tanggal ? formatDate(item.tanggal) : '-';
      const nama_pembeli = item.nama_pembeli || '-';
      const nama_barang = item.nama_barang || '-';
      const jumlah = item.jumlah ? item.jumlah.toString() : '0';
      const total_harga = item.total_harga ? formatCurrency(item.total_harga) : 'Rp 0';

      return [
        (index + 1).toString(),
        tanggal,
        `TRX-${id_transaksi.toString().padStart(4, '0')}`,
        nama_pembeli,
        nama_barang,
        jumlah,
        total_harga
      ];
    });

    console.log('Table data prepared:', tableData.length, 'rows');

    // Konfigurasi tabel - multi-page
    const tableConfig = {
      startY: 35,
      head: [
        ['No', 'Tanggal', 'No. Transaksi', 'Pembeli', 'Barang', 'Jumlah', 'Total Harga']
      ],
      body: tableData,
      // TAMBAHKAN FOOTER UNTUK TOTAL PENDAPATAN
      foot: [
        [
          { 
            content: 'Total Pendapatan:', 
            colSpan: 5, 
            styles: { 
              halign: 'right', 
              fontStyle: 'bold',
              fillColor: [240, 240, 240]
            } 
          },
          { 
            content: formatCurrency(totalPendapatan), 
            colSpan: 2,
            styles: { 
              halign: 'right', 
              fontStyle: 'bold',
              fillColor: [240, 240, 240]
            } 
          }
        ]
      ],
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        valign: 'middle'
      },
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: 0,
        fontStyle: 'bold',
        valign: 'middle'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' }, // No
        1: { cellWidth: 22 }, // Tanggal
        2: { cellWidth: 25 }, // No. Transaksi
        3: { cellWidth: 35 }, // Pembeli
        4: { cellWidth: 40 }, // Barang
        5: { cellWidth: 18, halign: 'center' }, // Jumlah
        6: { cellWidth: 30, halign: 'right' }  // Total Harga
      },
      margin: { top: 35 },
      didDrawPage: (data) => {
        // Footer untuk setiap halaman
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(
          `Halaman ${data.pageNumber} dari ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        
        // Header berulang untuk setiap halaman (kecuali halaman pertama)
        // auto page break
        if (data.pageNumber > 1) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text('LAPORAN TRANSAKSI TOKO ADIZ', pageWidth / 2, 15, { align: 'center' });
          
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.text(`Halaman ${data.pageNumber}`, pageWidth - 14, 22, { align: 'right' });
        }
      }
    };

    // Generate tabel
    autoTable(doc, tableConfig);

    // Simpan PDF
    const fileName = `Laporan_Transaksi_${filters.startDate}_hingga_${filters.endDate}.pdf`;
    console.log('Saving PDF as:', fileName);
    doc.save(fileName);

    return true;
  } catch (error) {
    console.error('Error in exportToPDF:', error);
    throw error;
  }
};

// Fungsi alternatif yang lebih sederhana
export const exportSimplePDF = (transaksi, filters, totalPendapatan) => {
  try {
    console.log('Starting simple PDF export');
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('LAPORAN TRANSAKSI TOKO ADIZ', pageWidth / 2, 15, { align: 'center' });
    
    // Hanya tampilkan tanggal cetak
    const tanggalCetak = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Dicetak pada: ${tanggalCetak}`, pageWidth - 14, 25, { align: 'right' });
    
    let yPosition = 35;
    
    // Data transaksi
    transaksi.forEach((item, index) => {
      // Cek jika perlu halaman baru
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`Transaksi #${index + 1}:`, 14, yPosition);
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Tanggal: ${formatDate(item.tanggal)}`, 14, yPosition + 5);
      doc.text(`No. Transaksi: TRX-${item.id_transaksi.toString().padStart(4, '0')}`, 14, yPosition + 10);
      doc.text(`Pembeli: ${item.nama_pembeli}`, 14, yPosition + 15);
      doc.text(`Barang: ${item.nama_barang}`, 14, yPosition + 20);
      doc.text(`Jumlah: ${item.jumlah}`, 14, yPosition + 25);
      doc.text(`Total: ${formatCurrency(item.total_harga)}`, 14, yPosition + 30);
      
      yPosition += 40;
    });
    
    // Tambahkan total pendapatan di bagian bawah
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Pendapatan:', 14, yPosition + 10);
    doc.text(formatCurrency(totalPendapatan), 80, yPosition + 10);
    
    const fileName = `Laporan_Transaksi_${filters.startDate}_hingga_${filters.endDate}.pdf`;
    console.log('Saving simple PDF as:', fileName);
    doc.save(fileName);

    return true;
  } catch (error) {
    console.error('Error in exportSimplePDF:', error);
    throw error;
  }
};