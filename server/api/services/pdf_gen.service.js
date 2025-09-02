const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const connectMySQLDB = require("../../config");

let db;
(async () => {
  db = await connectMySQLDB(); // ✅ Singleton DB connection
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
 * Generate Sales PDF
 */
const generateSalesPDF = async (saleId) => {
  const [saleRows] = await db.query("SELECT * FROM sales WHERE id = ?", [saleId]);
  const [itemRows] = await db.query("SELECT * FROM sale_items WHERE sale_id = ?", [saleId]);

  if (!saleRows.length) return null;

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

  return pdfBuffer;
};

/**
 * Generate Repair PDF
 */
const generateRepairPDF = async (repairId) => {
  const [repairRows] = await db.query("SELECT * FROM repairs WHERE id = ?", [repairId]);
  if (!repairRows.length) return null;

  const repair = repairRows[0];
  const [repairSaleRows] = await db.query("SELECT * FROM repair_sales WHERE repair_id = ?", [repairId]);
  const repairSale = repairSaleRows[0] || {};
  const [itemRows] = await db.query("SELECT * FROM repair_items WHERE repair_id = ?", [repairId]);

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

  return pdfBuffer;
};

module.exports = {
  generateSalesPDF,
  generateRepairPDF,
};
