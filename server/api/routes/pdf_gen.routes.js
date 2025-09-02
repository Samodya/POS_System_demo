const express = require("express");
const router = express.Router();
const pdfController = require("../controllers/pdf_gen.controller");

// Sales invoice PDF
router.get("/sales/:id", pdfController.getSalesPDF);

// Repair bill PDF
router.get("/repairs/:id", pdfController.getRepairPDF);

module.exports = router;
