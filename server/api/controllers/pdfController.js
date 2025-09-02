import { generateSalesPDF, generateRepairPDF } from "../services/pdfService.js";

export const downloadSalePDF = async (req, res) => {
  try {
    const { id } = req.params;
    await generateSalesPDF(id, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate sales PDF" });
  }
};

export const downloadRepairPDF = async (req, res) => {
  try {
    const { id } = req.params;
    await generateRepairPDF(id, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate repair PDF" });
  }
};
