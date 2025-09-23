import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { CellInput } from "jspdf-autotable";

interface ExportOptions<T> {
  title?: string;
  filename?: string;
  columns: string[];
  data: T[];
}

export const exportToPDF = <T>({
  title = "Exported Table",
  filename = "data.pdf",
  columns,
  data,
}: ExportOptions<T>) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(title, 14, 15);

  autoTable(doc, {
    startY: 20,
    head: [columns],
    body: data as CellInput[][],
    styles: { fontSize: 8 },
    headStyles: {
      fillColor: [34, 34, 34],
    },
    theme: "striped",
  });

  doc.save(filename);
};
