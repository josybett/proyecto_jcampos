import puppeteer from "puppeteer"
import __dirname from "../utils.js"
import path from "path"
import fs from "fs"

// Directorio para guardar el ticket
const uploadDir = path.join(__dirname, 'uploads');

// -crear directorio si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

export const ticket = async (data) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let tableRows = '';
  data.products.forEach(product => {
      tableRows += `
          <tr>
              <td>${product.product.title}</td>
              <td>${product.quantity}</td>
              <td>$${product.product.price * product.quantity}</td>
          </tr>
      `;
  });
  await page.setContent(`
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { color: #333; }
          table, th, td {
            border: 1px solid black;
            border-collapse: collapse;
          }
          th, td {
            padding: 15px;
          }
        </style>
      </head>
      <body>
        <h1>Ticket ${data.code}</h1>
        <table>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
          ${tableRows}
        </table>
        <p>Total: ${data.amount}</p>
      </body>
    </html>
  `);

  const buffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
  });
  // Crear PDF
  const filename = 'compra.pdf';
  const pdfFilePath = path.join(uploadDir, filename);
  fs.writeFileSync(pdfFilePath, buffer);

  await browser.close();
  return {
    path: pdfFilePath,
    filename
  };
}