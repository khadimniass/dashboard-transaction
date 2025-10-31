import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Transaction, TransactionStatus, TransactionType } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor() {}

  /**
   * Export transactions to PDF
   */
  exportToPDF(transactions: Transaction[], filename: string = 'transactions.pdf'): void {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Liste des Transactions', 14, 20);

    // Add date
    doc.setFontSize(10);
    doc.text(`Date d'export: ${new Date().toLocaleDateString('fr-FR')}`, 14, 28);

    // Prepare data for table
    const tableData = transactions.map((t) => [
      t.id,
      new Date(t.date).toLocaleDateString('fr-FR'),
      t.customer.name,
      this.getTypeLabel(t.type),
      `${t.amount.toLocaleString('fr-FR')} ${t.currency}`,
      this.getStatusLabel(t.status),
      t.paymentMethod,
      t.reference,
    ]);

    // Add table
    autoTable(doc, {
      head: [
        [
          'ID',
          'Date',
          'Client',
          'Type',
          'Montant',
          'Statut',
          'Méthode',
          'Référence',
        ],
      ],
      body: tableData,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [63, 81, 181] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Save PDF
    doc.save(filename);
  }

  /**
   * Export transactions to Excel
   */
  exportToExcel(transactions: Transaction[], filename: string = 'transactions.xlsx'): void {
    // Prepare data
    const data = transactions.map((t) => ({
      ID: t.id,
      Date: new Date(t.date).toLocaleDateString('fr-FR'),
      'Heure': new Date(t.date).toLocaleTimeString('fr-FR'),
      'Client': t.customer.name,
      'Email': t.customer.email,
      'Type': this.getTypeLabel(t.type),
      'Montant': t.amount,
      'Devise': t.currency,
      'Statut': this.getStatusLabel(t.status),
      'Méthode de paiement': t.paymentMethod,
      'Description': t.description,
      'Référence': t.reference,
    }));

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Set column widths
    const columnWidths = [
      { wch: 12 }, // ID
      { wch: 12 }, // Date
      { wch: 10 }, // Heure
      { wch: 20 }, // Client
      { wch: 25 }, // Email
      { wch: 15 }, // Type
      { wch: 15 }, // Montant
      { wch: 8 },  // Devise
      { wch: 12 }, // Statut
      { wch: 18 }, // Méthode
      { wch: 35 }, // Description
      { wch: 15 }, // Référence
    ];
    ws['!cols'] = columnWidths;

    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

    // Save file
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, filename);
  }

  /**
   * Export transactions to CSV
   */
  exportToCSV(transactions: Transaction[], filename: string = 'transactions.csv'): void {
    // Prepare CSV header
    const headers = [
      'ID',
      'Date',
      'Heure',
      'Client',
      'Email',
      'Type',
      'Montant',
      'Devise',
      'Statut',
      'Méthode de paiement',
      'Description',
      'Référence',
    ];

    // Prepare CSV rows
    const rows = transactions.map((t) => [
      t.id,
      new Date(t.date).toLocaleDateString('fr-FR'),
      new Date(t.date).toLocaleTimeString('fr-FR'),
      t.customer.name,
      t.customer.email,
      this.getTypeLabel(t.type),
      t.amount,
      t.currency,
      this.getStatusLabel(t.status),
      t.paymentMethod,
      `"${t.description}"`, // Quote description to handle commas
      t.reference,
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n');

    // Add BOM for Excel to recognize UTF-8
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  }

  /**
   * Get human-readable status label
   */
  private getStatusLabel(status: TransactionStatus): string {
    const labels: { [key in TransactionStatus]: string } = {
      [TransactionStatus.COMPLETED]: 'Complétée',
      [TransactionStatus.PENDING]: 'En attente',
      [TransactionStatus.FAILED]: 'Échouée',
      [TransactionStatus.CANCELLED]: 'Annulée',
    };
    return labels[status];
  }

  /**
   * Get human-readable type label
   */
  private getTypeLabel(type: TransactionType): string {
    const labels: { [key in TransactionType]: string } = {
      [TransactionType.PAYMENT]: 'Paiement',
      [TransactionType.REFUND]: 'Remboursement',
      [TransactionType.TRANSFER]: 'Transfert',
      [TransactionType.WITHDRAWAL]: 'Retrait',
      [TransactionType.DEPOSIT]: 'Dépôt',
    };
    return labels[type];
  }
}
