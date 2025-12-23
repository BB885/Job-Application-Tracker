import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportAnalyticsPdf({ counts, total }) {
  const statuses = ["Applied", "Interview", "Offer", "Rejected"];
  const timestamp = new Date();
  const tsStr = timestamp.toLocaleString();

  // Grab the chart as an image
  const chartEl = document.getElementById("analytics-chart");
  let chartImgData = null;

  if (chartEl) {
    const canvas = await html2canvas(chartEl, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });
    chartImgData = canvas.toDataURL("image/png");
  }

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Internship Tracker — Analytics Report", margin, 64);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(90);
  doc.text(`Generated: ${tsStr}`, margin, 84);

  // Summary row
  doc.setTextColor(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Total applications: ${total}`, margin, 114);

  // Chart placement
  let y = 140;
  if (chartImgData) {
    const chartSize = 140;
    doc.addImage(chartImgData, "PNG", margin, y, chartSize, chartSize);
  } else {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120);
    doc.text("(Chart unavailable)", margin, y + 20);
  }

  // Breakdown table (right side of chart)
  const tableX = margin + 170;
  const tableY = y + 10;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(20);
  doc.text("Breakdown", tableX, tableY);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(40);

  let rowY = tableY + 20;

  // Table header
  doc.setFont("helvetica", "bold");
  doc.text("Status", tableX, rowY);
  doc.text("Count", tableX + 160, rowY);
  doc.text("%", tableX + 220, rowY);
  doc.setFont("helvetica", "normal");

  rowY += 14;
  doc.setDrawColor(200);
  doc.line(tableX, rowY, pageW - margin, rowY);
  rowY += 18;

  statuses.forEach((s) => {
    const c = counts?.[s] || 0;
    const pct = total ? ((c / total) * 100).toFixed(1) : "0.0";

    doc.text(s, tableX, rowY);
    doc.text(String(c), tableX + 170, rowY, { align: "right" });
    doc.text(String(pct), tableX + 230, rowY, { align: "right" });

    rowY += 18;
  });

  // Footer note
  doc.setTextColor(120);
  doc.setFontSize(10);

  const fileName = `analytics_report_${timestamp.toISOString().replace(/[:.]/g, "-")}.pdf`;
  doc.save(fileName);
}
