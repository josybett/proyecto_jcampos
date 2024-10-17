import puppeteer from "puppeteer"
import __dirname from "../utils.js"
import path from "path"
import fs from "fs"

// Specify the path to the upload directory
const uploadDir = path.join(__dirname, 'uploads');

// Create the upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

export const ticket = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Set the content of the page
  await page.setContent(`
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { color: #333; }
        </style>
      </head>
      <body>
        <h1>Hello, PDF!</h1>
        <p>This is a sample PDF generated with Puppeteer.</p>
      </body>
    </html>
  `);

  const buffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
  });
  // Construct the file path for the PDF
  const filename = 'generated.pdf';
  const pdfFilePath = path.join(uploadDir, filename);
  await fs.writeFileSync(pdfFilePath, buffer);

  await browser.close();
  return {
    path: pdfFilePath,
    filename
  };
}