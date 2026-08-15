// src/lib/excel-export.ts
// Utilitas generator berkas Microsoft Excel (.xlsx) resmi QuickDine dengan styling korporat

import ExcelJS from "exceljs";

export interface ExportFinanceExcelParams {
  restaurantName: string;
  reportPeriod: string;
  totalGross: number;
  totalFee: number;
  totalNet: number;
  transactions: Array<{
    id: string;
    createdAt: string;
    customerName: string;
    paymentMethod: string;
    grossAmount: number;
    platformFee: number;
    netAmount: number;
    status: string;
  }>;
}

export interface ExportSuperAdminTenantsParams {
  reportPeriod: string;
  totalTenants: number;
  activeTenants: number;
  totalGMV: number;
  tenants: Array<{
    id: string;
    name: string;
    category: string;
    ownerName: string;
    phone: string;
    tableCount: number;
    totalGmv: number;
    bankAccount: string;
    status: string;
  }>;
}

export async function exportFinanceToExcel({
  restaurantName,
  reportPeriod,
  totalGross,
  totalFee,
  totalNet,
  transactions,
}: ExportFinanceExcelParams): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "QuickDine Platform";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Rekap Omset & Payout", {
    views: [{ showGridLines: true }],
  });

  // 1. Title Block
  worksheet.mergeCells("A1:H1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = `LAPORAN KEUANGAN & REKAP OMSET — ${restaurantName.toUpperCase()}`;
  titleCell.font = { name: "Calibri", size: 14, bold: true, color: { argb: "FF006948" } };
  titleCell.alignment = { vertical: "middle", horizontal: "left" };
  worksheet.getRow(1).height = 25;

  // Subtitle & Export Metadata
  worksheet.mergeCells("A2:H2");
  const subtitleCell = worksheet.getCell("A2");
  subtitleCell.value = `Periode: ${reportPeriod}  |  Diekspor pada: ${new Date().toLocaleString("id-ID")}`;
  subtitleCell.font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF555555" } };
  worksheet.getRow(2).height = 18;

  // 2. Summary KPI Block (Row 4-6)
  worksheet.getCell("A4").value = "RINGKASAN FINANSIAL:";
  worksheet.getCell("A4").font = { bold: true, size: 11 };

  const summaryHeaders = [
    { cell: "B4", label: "Total Omset Kotor", val: totalGross },
    { cell: "D4", label: "Total Potongan Fee", val: totalFee },
    { cell: "F4", label: "Saldo Bersih Siap Cair", val: totalNet },
  ];

  summaryHeaders.forEach(({ cell, label, val }) => {
    const c = worksheet.getCell(cell);
    c.value = `${label}: Rp ${val.toLocaleString("id-ID")}`;
    c.font = { bold: true, color: { argb: "FF131B2E" } };
  });

  worksheet.addRow([]); // Spacer
  worksheet.addRow([]); // Spacer

  // 3. Table Header (Row 7)
  const headerRow = worksheet.getRow(7);
  headerRow.values = [
    "No. Pesanan",
    "Waktu Transaksi",
    "Nama Customer",
    "Metode Pembayaran",
    "Omset Kotor (Gross)",
    "Potongan Fee",
    "Pendapatan Bersih (Net)",
    "Status Payout",
  ];
  headerRow.height = 24;

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF006948" }, // QuickDine Emerald
    };
    cell.font = {
      name: "Calibri",
      size: 11,
      bold: true,
      color: { argb: "FFFFFFFF" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin", color: { argb: "FF004D34" } },
      bottom: { style: "medium", color: { argb: "FF004D34" } },
      left: { style: "thin", color: { argb: "FF004D34" } },
      right: { style: "thin", color: { argb: "FF004D34" } },
    };
  });

  // 4. Data Rows
  transactions.forEach((tx, idx) => {
    const row = worksheet.addRow([
      tx.id,
      tx.createdAt,
      tx.customerName,
      tx.paymentMethod,
      tx.grossAmount,
      tx.platformFee,
      tx.netAmount,
      tx.status,
    ]);

    row.height = 20;

    const isEven = idx % 2 === 1;
    row.eachCell((cell, colNumber) => {
      cell.font = { name: "Calibri", size: 10 };
      cell.alignment = { vertical: "middle", horizontal: "left" };

      if (isEven) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8FAF9" },
        };
      }

      cell.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };

      if (colNumber === 5 || colNumber === 6 || colNumber === 7) {
        cell.numFmt = '"Rp "#,##0';
        cell.alignment = { vertical: "middle", horizontal: "right" };
      }

      if (colNumber === 1 || colNumber === 2 || colNumber === 4 || colNumber === 8) {
        cell.alignment = { vertical: "middle", horizontal: "center" };
      }
    });
  });

  // 5. Total Row
  const totalRow = worksheet.addRow([
    "TOTAL KESELURUHAN",
    "",
    "",
    "",
    totalGross,
    totalFee,
    totalNet,
    "",
  ]);

  worksheet.mergeCells(`A${totalRow.number}:D${totalRow.number}`);
  totalRow.height = 24;

  totalRow.eachCell((cell, colNumber) => {
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FF006948" } };
    cell.border = {
      top: { style: "medium", color: { argb: "FF006948" } },
      bottom: { style: "double", color: { argb: "FF006948" } },
    };
    if (colNumber >= 5 && colNumber <= 7) {
      cell.numFmt = '"Rp "#,##0';
      cell.alignment = { vertical: "middle", horizontal: "right" };
    }
  });

  worksheet.columns = [
    { width: 16 },
    { width: 18 },
    { width: 22 },
    { width: 20 },
    { width: 22 },
    { width: 18 },
    { width: 24 },
    { width: 16 },
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const fileNameDate = new Date().toISOString().slice(0, 10);
  link.download = `QuickDine_Rekap_Omset_${fileNameDate}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Generator Berkas Excel Rekapitulasi Seluruh Mitra Platform (Super Admin)
export async function exportSuperAdminTenantsToExcel({
  reportPeriod,
  totalTenants,
  activeTenants,
  totalGMV,
  tenants,
}: ExportSuperAdminTenantsParams): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "QuickDine Super Admin";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Master Direktori Mitra", {
    views: [{ showGridLines: true }],
  });

  // Title Block
  worksheet.mergeCells("A1:H1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "MASTER DIREKTORI MITRA RESTORAN — QUICKDINE PLATFORM";
  titleCell.font = { name: "Calibri", size: 14, bold: true, color: { argb: "FF006948" } };
  titleCell.alignment = { vertical: "middle", horizontal: "left" };
  worksheet.getRow(1).height = 25;

  worksheet.mergeCells("A2:H2");
  const subtitleCell = worksheet.getCell("A2");
  subtitleCell.value = `Periode: ${reportPeriod}  |  Total Mitra: ${totalTenants} (${activeTenants} Aktif)  |  Total GMV: Rp ${totalGMV.toLocaleString(
    "id-ID"
  )}`;
  subtitleCell.font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF555555" } };
  worksheet.getRow(2).height = 18;

  worksheet.addRow([]); // Spacer
  worksheet.addRow([]); // Spacer

  // Header Row
  const headerRow = worksheet.getRow(5);
  headerRow.values = [
    "ID Mitra",
    "Nama Restoran",
    "Kategori",
    "Nama Pemilik",
    "Nomor Kontak",
    "Jumlah Meja",
    "Total GMV Transaksi",
    "Rekening Bank Payout",
    "Status",
  ];
  headerRow.height = 24;

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF006948" },
    };
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin", color: { argb: "FF004D34" } },
      bottom: { style: "medium", color: { argb: "FF004D34" } },
      left: { style: "thin", color: { argb: "FF004D34" } },
      right: { style: "thin", color: { argb: "FF004D34" } },
    };
  });

  // Data Rows
  tenants.forEach((t, idx) => {
    const row = worksheet.addRow([
      t.id,
      t.name,
      t.category,
      t.ownerName,
      t.phone,
      t.tableCount,
      t.totalGmv,
      t.bankAccount,
      t.status,
    ]);

    row.height = 20;
    const isEven = idx % 2 === 1;
    row.eachCell((cell, colNumber) => {
      cell.font = { name: "Calibri", size: 10 };
      cell.alignment = { vertical: "middle", horizontal: "left" };

      if (isEven) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF8FAF9" },
        };
      }

      cell.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };

      if (colNumber === 7) {
        cell.numFmt = '"Rp "#,##0';
        cell.alignment = { vertical: "middle", horizontal: "right" };
      }

      if (colNumber === 1 || colNumber === 6 || colNumber === 9) {
        cell.alignment = { vertical: "middle", horizontal: "center" };
      }
    });
  });

  worksheet.columns = [
    { width: 14 },
    { width: 28 },
    { width: 18 },
    { width: 22 },
    { width: 18 },
    { width: 14 },
    { width: 24 },
    { width: 30 },
    { width: 16 },
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const fileNameDate = new Date().toISOString().slice(0, 10);
  link.download = `QuickDine_Master_Mitra_${fileNameDate}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
