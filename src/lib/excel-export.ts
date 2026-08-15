// src/lib/excel-export.ts
// Utilitas generator berkas Microsoft Excel (.xlsx) resmi QuickDine dengan styling korporat

import ExcelJS from "exceljs";

export interface ExcelColumnDefinition {
  header: string;
  key: string;
  width?: number;
  isCurrency?: boolean;
  align?: "left" | "center" | "right";
}

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

  worksheet.addRow([]); // Row 5 empty spacer
  worksheet.addRow([]); // Row 6 empty spacer

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

    // Formatting per cell
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

      // Currency Formatting for Gross, Fee, Net (Cols 5, 6, 7)
      if (colNumber === 5 || colNumber === 6 || colNumber === 7) {
        cell.numFmt = '"Rp "#,##0';
        cell.alignment = { vertical: "middle", horizontal: "right" };
      }

      // Center align for ID, Waktu, Metode, Status
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

  // Auto-fit column widths
  worksheet.columns = [
    { width: 16 }, // ID
    { width: 18 }, // Waktu
    { width: 22 }, // Customer
    { width: 20 }, // Metode
    { width: 22 }, // Gross
    { width: 18 }, // Fee
    { width: 24 }, // Net
    { width: 16 }, // Status
  ];

  // 6. Write Buffer & Trigger Browser Download
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
