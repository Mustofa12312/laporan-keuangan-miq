import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { formatRupiah, formatDate } from './format'
import { CATEGORIES } from '../constants'

// ====== EXPORT PDF ======
export const exportToPDF = (transactions, rekap, orgName = 'Kursus MIQ se-Madura') => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // Header
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('LAPORAN KEUANGAN', 105, 20, { align: 'center' })
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(orgName, 105, 28, { align: 'center' })
  doc.text(`Dicetak: ${formatDate(new Date())}`, 105, 34, { align: 'center' })

  doc.line(14, 38, 196, 38)

  // Rekap summary
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Rekapitulasi Pengeluaran', 14, 46)

  const rekapRows = CATEGORIES.map(cat => [
    cat.label,
    formatRupiah(rekap[cat.id] || 0),
  ])
  rekapRows.push(['GRAND TOTAL', formatRupiah(rekap.grandTotal || 0)])

  doc.autoTable({
    startY: 50,
    head: [['Kategori', 'Subtotal']],
    body: rekapRows,
    styles: { fontSize: 10, font: 'helvetica' },
    headStyles: { fillColor: [22, 163, 74], textColor: 255 },
    columnStyles: { 1: { halign: 'right' } },
    foot: [],
  })

  // Transactions per category
  CATEGORIES.forEach(cat => {
    const rows = transactions.filter(t => t.kategori === cat.id)
    if (rows.length === 0) return

    doc.addPage()
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text(cat.label, 14, 20)

    doc.autoTable({
      startY: 25,
      head: [['Tgl', 'Uraian', 'Vol', 'Satuan', 'Harga Sat.', 'Jumlah', 'No. Nota']],
      body: rows.map(r => [
        formatDate(r.tanggal, { day: '2-digit', month: '2-digit', year: '2-digit' }),
        r.uraian,
        r.volume,
        r.satuan,
        formatRupiah(r.harga),
        formatRupiah(r.jumlah),
        r.nomorNota || '-',
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 163, 74], textColor: 255 },
      columnStyles: {
        4: { halign: 'right' },
        5: { halign: 'right', fontStyle: 'bold' },
      },
    })

    const sub = rows.reduce((s, r) => s + (r.jumlah || 0), 0)
    const y = doc.lastAutoTable.finalY + 5
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(`Subtotal ${cat.label}: ${formatRupiah(sub)}`, 196, y, { align: 'right' })
  })

  doc.save(`Laporan_Keuangan_MIQ_${new Date().toISOString().split('T')[0]}.pdf`)
}

// ====== EXPORT EXCEL ======
export const exportToExcel = (transactions, rekap, orgName = 'Kursus MIQ se-Madura') => {
  const wb = XLSX.utils.book_new()

  // Sheet Rekap
  const rekapData = [
    ['LAPORAN KEUANGAN', orgName],
    [],
    ['Kategori', 'Subtotal'],
    ...CATEGORIES.map(cat => [cat.label, rekap[cat.id] || 0]),
    [],
    ['GRAND TOTAL', rekap.grandTotal || 0],
  ]
  const wsRekap = XLSX.utils.aoa_to_sheet(rekapData)
  XLSX.utils.book_append_sheet(wb, wsRekap, 'Rekap')

  // Sheet per kategori
  CATEGORIES.forEach(cat => {
    const rows = transactions.filter(t => t.kategori === cat.id)
    const data = [
      [cat.label],
      ['Tanggal', 'Uraian', 'Volume', 'Satuan', 'Harga Satuan', 'Jumlah', 'No. Nota', 'Catatan'],
      ...rows.map(r => [
        r.tanggal, r.uraian, r.volume, r.satuan, r.harga, r.jumlah, r.nomorNota || '', r.catatan || ''
      ]),
      [],
      ['', '', '', '', 'Subtotal', rows.reduce((s, r) => s + (r.jumlah || 0), 0), '', ''],
    ]
    const ws = XLSX.utils.aoa_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, cat.label.substring(0, 31))
  })

  XLSX.writeFile(wb, `Laporan_Keuangan_MIQ_${new Date().toISOString().split('T')[0]}.xlsx`)
}

// ====== PRINT ======
export const printReport = () => {
  window.print()
}
