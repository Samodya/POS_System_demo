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
    SELECT st.*, p.name as product_name, pi.warranty, pi.conditions, p.itemmodel_id
    FROM sale_items st
    LEFT JOIN product_item pi ON pi.id = st.product_id
    LEFT JOIN products p ON p.id = pi.product_id
    WHERE st.sale_id = ?
  `,
    [saleId]
  );

  const templatePath = path.join(
    process.cwd(),
    "templates",
    "invoice-sale.html"
  );

  // Absolute path for logo
  const logoPath = path.join(
    process.cwd(),
    "templates",
    "MasterTechLogo/PNG/MasterTechLogoBT.png"
  );
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
          `<tr class="even:bg-gray-50"><td colspan="2" class="py-2 px-4 border-b text-sm">${
            i.itemmodel_id + " " + i.product_name
          }</td>
            <td class="py-2 px-4 border-b text-center text-xs">${
              i.warranty
            }</td>
            <td  class="py-2 px-4 border-b text-center text-xs">${
              i.quantity
            }</td>
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
  try {
    const formatDateTime = (d) => {
      if (!d) return { date: "", time: "" };
      const dt = new Date(d);
      const pad = (n) => String(n).padStart(2, "0");
      return {
        date: `${pad(dt.getDate())}-${pad(
          dt.getMonth() + 1
        )}-${dt.getFullYear()}`,
        time: `${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(
          dt.getSeconds()
        )}`,
      };
    };

    const logoPath = path.join(
      process.cwd(),
      "templates",
      "MasterTechLogo/PNG/MasterTechLogoBT.png"
    );
    if (!fs.existsSync(logoPath))
      throw new Error("Logo not found at " + logoPath);
    const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });
    const logoUrl = `data:image/png;base64,${logoBase64}`;

    // Fetch repair
    const [repairRows] = await db.query(
      `SELECT r.*, c.name AS customer_name, c.phone FROM repairs r
    LEFT JOIN customers c ON c.id = r.customer_id
    WHERE r.id = ?`,
      [repairId]
    );
    if (!repairRows.length) throw new Error("Repair not found");
    const repair = repairRows[0];

    // Fetch repair sale
    const [repairSaleRows] = await db.query(
      "SELECT invoiceid, total_amount, sale_date FROM repair_sales WHERE repair_id = ?",
      [repairId]
    );
    const repairSale = repairSaleRows[0] || {};

    // Fetch repair items
    const [itemRows] = await db.query(
      `SELECT rt.*, p.name AS part_name, pi.warranty, pi.conditions, p.itemmodel_id
      FROM repair_items rt
      LEFT JOIN product_item pi ON rt.product_id = pi.id
      LEFT JOIN products p ON p.id = pi.product_id
      WHERE rt.repair_id = ?
      `,
      [repairId]
    );

    const { date, time } = formatDateTime(
      repairSale.created_at || repair.received_date
    );

    // Render HTML
    const templatePath = path.join(
      process.cwd(),
      "templates",
      "invoice-repair.html"
    );
    if (!fs.existsSync(templatePath))
      throw new Error("Template file not found");
    const html = renderTemplate(templatePath, {
      logo_url: logoUrl, // match HTML template key
      invoice_id: repairSale.invoiceid || "N/A",
      repairId: repair.order_id,
      date,
      time,
      r_issue: repair.issue,
      fix: repair.repair_fix_note,
      customer: repair.customer_name || repair.customer_id || "Guest",
      device: repair.device,
      cost: repair.cost,
      issue: repair.issue,
      status: repair.status,
      total: Number(repairSale.total_amount || repair.cost || 0).toFixed(2),
      items: itemRows.length
        ? itemRows
            .map(
              (i) =>
                `<tr>
                <td>${i.itemmodel_id + " " + i.part_name || "Unknown Part"}</td>
                <td>${i.warranty || "Unknown Part"}</td>
                <td>${i.conditions || "Unknown Part"}</td>
                <td>${i.quantity}</td>
                <td>${Number(i.price).toFixed(2)}</td>
              </tr>`
            )
            .join("")
        : `<tr>
        <td colspan="6" class="text-center py-4 bg-gray-100 text-gray-500 font-medium">
          No spare parts used
        </td>
      </tr>`,
    });
    // Generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    return pdfBuffer;
  } catch (error) {
    throw error; // re-throw for caller to handle
  }
};

module.exports = {
  generateSalesPDF,
  generateRepairPDF,
};
