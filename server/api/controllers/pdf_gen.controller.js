const pdfService = require("../services/pdf_gen.service");

exports.getSalesPDF = async (req, res) => {
  try {
    const saleId = req.params.id;
    const userData = req.body;
    const pdfBuffer = await pdfService.generateSalesPDF(saleId, userData);

    if (!pdfBuffer) return res.status(404).json({ message: "Sale not found" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=sale-${saleId}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating sales PDF" });
  }
};

exports.getRepairPDF = async (req, res) => {
  try {
    const repairId = req.params.id;
    const pdfBuffer = await pdfService.generateRepairPDF(repairId);

    if (!pdfBuffer) return res.status(404).json({ message: "Repair not found" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=repair-${repairId}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating repair PDF" });
  }
};
