const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const connectMySQLDB = require("../../config");

let db;
(async () => {
  db = await connectMySQLDB();
})();

// Render HTML template
const renderTemplate = (templatePath, data) => {
  let template = fs.readFileSync(templatePath, "utf-8");
  for (const key in data) {
    let value = data[key];
    if (value === null || value === undefined) value = "";
    else value = value.toString();
    template = template.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), value);
  }
  return template;
};

// Format date & time
const formatDateTime = (d) => {
  if (!d) return { date: "", time: "" };
  const dt = new Date(d);

  const day = String(dt.getDate()).padStart(2, "0");
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const year = dt.getFullYear();

  const hours = String(dt.getHours()).padStart(2, "0");
  const minutes = String(dt.getMinutes()).padStart(2, "0");
  const seconds = String(dt.getSeconds()).padStart(2, "0");

  return {
    date: `${day}-${month}-${year}`,
    time: `${hours}:${minutes}:${seconds}`,
  };
};

// Generate Sales PDF
const generateSalesPDF = async (saleId) => {
  const [saleRows] = await db.query(
    `
    SELECT s.*, c.name AS customer_name, c.phone
    FROM sales s
    LEFT JOIN customers c ON c.id = s.customer_id
    WHERE s.id = ?
  `,
    [saleId]
  );

  if (!saleRows.length) return null;
  const sale = saleRows[0];

  const [itemRows] = await db.query(
    `
    SELECT st.*, p.name as product_name, p.warranty, p.conditions, p.itemmodel_id
    FROM sale_items st
    LEFT JOIN products p ON p.id = st.product_id
    WHERE sale_id = ?
  `,
    [saleId]
  );

  const templatePath = path.join(process.cwd(), "templates", "invoice-sale.html");

  // Absolute path for logo
  const logoPath = path.join(process.cwd(), "templates", "MasterTechLogo/PNG/MasterTechLogoBT.png");
  const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });
  const logoUrl = `data:image/png;base64,${logoBase64}`;

  const { date, time } = formatDateTime(sale.sale_date || sale.created_at);

  // Debug logs
  console.log("Formatted Date:", date, "Time:", time);

  const html = renderTemplate(templatePath, {
    logo_url: logoUrl,
    invoice_id: sale.invoiceid,
    date,
    time,
    customer: sale.customer_name || "Guest",
    total: sale.total_amount,
    
    items: itemRows
      .map(
        (i) =>
          `<tr class="even:bg-gray-50"><td colspan="2" class="py-2 px-4 border-b text-sm">${i.product_name}</td>
            <td class="py-2 px-4 border-b text-center text-xs">${i.warranty}</td>
            <td  class="py-2 px-4 border-b text-center text-xs">${i.quantity}</td>
            <td class="py-2 px-4 border-b text-xs">Rs.${i.price}</td>
            <td class="py-2 px-4 border-b text-xs">Rs.${i.totalprice}</td>    
          </tr>`
      )
      .join(""),
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return pdfBuffer;
};

// Generate Repair PDF
const generateRepairPDF = async (repairId) => {
  const [repairRows] = await db.query(`SELECT * FROM repairs WHERE id = ?`, [repairId]);
  if (!repairRows.length) return null;

  const repair = repairRows[0];

  const [repairSaleRows] = await db.query(
    "SELECT * FROM repair_sales WHERE repair_id = ?",
    [repairId]
  );
  const repairSale = repairSaleRows[0] || {};

  const [itemRows] = await db.query("SELECT * FROM repair_items WHERE repair_id = ?", [
    repairId,
  ]);

  const templatePath = path.join(process.cwd(), "templates", "invoice-repair.html");

  const { date, time } = formatDateTime(repairSale.created_at || repair.received_date);

  // Debug logs
  console.log("Repair Date:", date, "Time:", time);

  const html = renderTemplate(templatePath, {
    invoice_id: repairSale.id || repair.id,
    date,
    time,
    customer: repair.customer_name || repair.customer_id || "Guest",
    device: repair.device,
    issue: repair.issue,
    status: repair.status,
    total: repairSale.total_amount || repair.cost || 0,
    items: itemRows.length
      ? itemRows
          .map(
            (i) =>
              `<tr class="even:bg-gray-50"><td class="py-2 px-4 border-b">${i.part_name}</td><td class="py-2 px-4 border-b">${i.quantity}</td><td class="py-2 px-4 border-b">${i.price}</td></tr>`
          )
          .join("")
      : `<tr><td colspan="3" class="py-2 px-4 border-b">No spare parts used</td></tr>`,
  });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return pdfBuffer;
};

module.exports = {
  generateSalesPDF,
  generateRepairPDF,
};
