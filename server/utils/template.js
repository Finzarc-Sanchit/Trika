// Email template renderer - reads HTML files and replaces placeholders
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function renderTemplate(templateName, data) {
  const filePath = path.join(__dirname, `../templates/${templateName}.html`);

  let html = fs.readFileSync(filePath, 'utf-8');

  // Replace all {{placeholders}} with actual values
  for (const key in data) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, data[key] || '');
  }

  return html;
}

export { renderTemplate };
export default { renderTemplate };
