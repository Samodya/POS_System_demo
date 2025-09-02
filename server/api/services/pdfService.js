import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
const connectMySQLDB = require("../../config");

let db;
(async () => {
  db = await connectMySQLDB(); // ✅ get the singleton connection once
})();


/**
 * Render HTML template with data
 */
const renderTemplate = (templatePath, data) => {
  let template = fs.readFileSync(templatePath, "utf-8");
  for (const key in data) {
    template = template.replace(new RegExp(`{{${key}}}`, "g"), data[key] || "");
  }
  return template;
};

/**
 * Generate PDF for Sales (already exists in your case)
 */
export const generateSalesPDF = async (saleId, res) => {
  const [saleRows] = await db.query("SELECT * FROM sales WHERE id = ?", [saleId]);
  const [itemRows] = await db.query("SELECT * FROM sale_items WHERE sale_id = ?", [saleId]);

  const sale = saleRows[0];
  const templatePath = path.join(process.cwd(), "templates", "invoice-sale.html");

  const html = renderTemplate(templatePath, {
    invoice_id: sale.id,
    date: sale.created_at,
    customer: sale.customer_name,
    total: sale.total_amount,
    items: itemRows
      .map((i) => `<tr><td>${i.product_name}</td><td>${i.quantity}</td><td>${i.price}</td></tr>`)
      .join(""),
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=sale-${saleId}.pdf`);
  res.send(pdfBuffer);
};

/**
 * Generate PDF for Repair Bill
 */
export const generateRepairPDF = async (repairId, res) => {
  // Get main repair details
  const [repairRows] = await db.query("SELECT * FROM repairs WHERE id = ?", [repairId]);
  const repair = repairRows[0];

  // Get repair sales (invoice/payment details)
  const [repairSaleRows] = await db.query("SELECT * FROM repair_sales WHERE repair_id = ?", [repairId]);
  const repairSale = repairSaleRows[0] || {};

  // Get items used in repair
  const [itemRows] = await db.query("SELECT * FROM repair_items WHERE repair_id = ?", [repairId]);

  // Load template
  const templatePath = path.join(process.cwd(), "templates", "invoice-repair.html");

  const html = renderTemplate(templatePath, {
    invoice_id: repairSale.id || repair.id,
    date: repairSale.created_at || repair.received_date,
    customer: repair.customer_name || repair.customer_id,
    device: repair.device,
    issue: repair.issue,
    status: repair.status,
    total: repairSale.total_amount || repair.cost || 0,
    items: itemRows.length
      ? itemRows.map((i) => `<tr><td>${i.part_name}</td><td>${i.quantity}</td><td>${i.price}</td></tr>`).join("")
      : `<tr><td colspan="3">No spare parts used</td></tr>`,
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=repair-${repairId}.pdf`);
  res.send(pdfBuffer);
};
