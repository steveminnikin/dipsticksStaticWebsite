/**
 * Generate modern branded PDF guides for Dipsticks Engineering.
 * Uses the website's brand colours and clean typography.
 *
 * Brand colours:
 *   Primary:  #1B4965
 *   Primary Light: #2A6F97
 *   Accent:   #F97316
 *   Secondary (light blue): #CAE9FF
 *   Neutral-700: #4A4A5A
 *   Neutral-500: #6B7280
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '..', 'public', 'downloads');

// Brand colours
const C = {
  primary: '#1B4965',
  primaryLight: '#2A6F97',
  primaryDark: '#0F2D40',
  accent: '#F97316',
  accentDark: '#EA580C',
  secondary: '#CAE9FF',
  neutral900: '#1A1A2E',
  neutral700: '#4A4A5A',
  neutral500: '#6B7280',
  neutral300: '#D1D5DB',
  neutral200: '#E8E8ED',
  neutral100: '#F3F4F6',
  white: '#FFFFFF',
};

// ─── Shared helpers ──────────────────────────────────────────────

function addHeader(doc) {
  // Full-width primary colour header bar
  doc.save();
  doc.rect(0, 0, doc.page.width, 70).fill(C.primary);
  doc.fontSize(22).fill(C.white).font('Helvetica-Bold').text('Dipsticks', 50, 22, { continued: true });
  doc.font('Helvetica').fill(C.secondary).text(' Engineering', { continued: false });
  doc.restore();
  // Thin accent line below header
  doc.rect(0, 70, doc.page.width, 3).fill(C.accent);
  doc.y = 95;
}

function addFooter(doc) {
  const y = doc.page.height - 60;
  doc.save();
  doc.rect(0, y - 5, doc.page.width, 65).fill(C.primary);

  // Use manual centering to avoid doc.text() auto-pagination at page bottom
  const line1 = `© ${new Date().getFullYear()} Dipsticks Engineering Services Ltd  |  The Lodge, Wood Lane, Hinstock, Shropshire TF9 2TA`;
  const line2 = 'Tel: 0333 567 1654  |  enquiries@dipsticksengineering.co.uk  |  www.dipsticksengineering.co.uk';

  doc.fontSize(8).fill(C.secondary).font('Helvetica');
  const w1 = doc.widthOfString(line1);
  const w2 = doc.widthOfString(line2);
  doc.text(line1, (doc.page.width - w1) / 2, y + 8, { lineBreak: false, height: 10 });
  doc.text(line2, (doc.page.width - w2) / 2, y + 22, { lineBreak: false, height: 10 });
  doc.restore();
}

function sectionTitle(doc, text) {
  doc.moveDown(0.6);
  doc.fontSize(14).fill(C.primary).font('Helvetica-Bold').text(text);
  // Underline
  const lineY = doc.y + 2;
  doc.save();
  doc.moveTo(50, lineY).lineTo(200, lineY).lineWidth(2).strokeColor(C.accent).stroke();
  doc.restore();
  doc.moveDown(0.5);
}

function bodyText(doc, text) {
  doc.fontSize(10).fill(C.neutral700).font('Helvetica').text(text, { lineGap: 3 });
}

function bulletItem(doc, text, indent = 50) {
  const x = indent;
  const y = doc.y;
  // Draw a filled circle bullet
  doc.save();
  doc.circle(x + 4, y + 5, 3).fill(C.accent);
  doc.restore();
  doc.fontSize(10).fill(C.neutral700).font('Helvetica').text(text, x + 15, y, { lineGap: 2 });
}

function checkItem(doc, text, indent = 50) {
  const x = indent;
  const y = doc.y;
  // Draw a small checkbox with a checkmark path
  doc.save();
  doc.rect(x, y + 1, 10, 10).lineWidth(1).strokeColor(C.primary).stroke();
  // Draw checkmark as a path
  doc.moveTo(x + 2, y + 6.5).lineTo(x + 4.5, y + 9).lineTo(x + 8, y + 3.5)
    .lineWidth(1.5).strokeColor(C.accent).stroke();
  doc.restore();
  doc.fontSize(10).fill(C.neutral700).font('Helvetica').text(text, x + 18, y + 1, { lineGap: 2 });
}

function numberedStep(doc, num, title, x) {
  const y = doc.y;
  // Number circle
  doc.save();
  doc.circle(x + 12, y + 7, 12).fill(C.primary);
  doc.fontSize(11).fill(C.white).font('Helvetica-Bold').text(String(num), x + 5, y + 1, { width: 15, align: 'center', lineBreak: false });
  doc.restore();
  doc.fontSize(12).fill(C.neutral900).font('Helvetica-Bold').text(title, x + 32, y + 1, { width: doc.page.width - x - 82 });
}

// ─── PDF 1: Dipstick Usage Guide ─────────────────────────────────

function generateUsageGuide() {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(fs.createWriteStream(path.join(outputDir, 'DipsticksUsageGuide.pdf')));

  addHeader(doc);

  // Title
  doc.fontSize(20).fill(C.neutral900).font('Helvetica-Bold').text('Dipstick Usage Guide', { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(11).fill(C.neutral500).font('Helvetica').text(
    'Our calibrated dipsticks will give an accurate measurement of the volume of liquid\nin a storage tank when used in the correct manner.',
    { align: 'center' }
  );
  doc.moveDown(0.8);

  // Highlight box
  const boxY = doc.y;
  doc.save();
  doc.roundedRect(50, boxY, doc.page.width - 100, 45, 6).fill(C.secondary);
  doc.fontSize(10).fill(C.primary).font('Helvetica-Bold').text(
    'Important: Always wear gloves when handling dipsticks. Check for damage before use.',
    65, boxY + 14, { width: doc.page.width - 130 }
  );
  doc.restore();
  doc.y = boxY + 55;

  // Before Use
  sectionTitle(doc, 'Before Use');
  bodyText(doc, 'Check that the dipstick is safe to handle, i.e. it has no sharp edges, fractures or splinters.');
  doc.moveDown(0.3);
  bodyText(doc, 'It is recommended that gloves are worn when handling the dipstick. These will prevent the smell of fuel on the hands and negate any allergic reaction that your skin may have to the fuel.');
  doc.moveDown(0.3);
  bodyText(doc, 'Familiarise yourself with the volume units that the dipstick is marked in, i.e. litres, gallons etc., and with the number of volume units that the gap between the marked lines represent.');
  doc.moveDown(0.3);
  bodyText(doc, 'Above the last (highest) engraved line is a figure indicating the full capacity of the tank. Just above that will be an indication of the units being used, usually litres. Above that is our reference number and above that again is a marking of the tank\'s Safe Working Capacity (SWC) which is 97% of the full capacity.');
  doc.moveDown(0.3);
  bodyText(doc, 'Near this the dipstick may bear a tank maker\'s reference number, a tank number or an indication of the product in the tank. The tank you are dipping should bear a plate or engraving that corresponds to this.');

  // When Using
  sectionTitle(doc, 'When Using');
  bodyText(doc, 'Present the dipstick into the dipping tube. Do not drop the dipstick but lower it slowly. Dropping the dipstick into the tank will damage the tank and the dipstick.');
  doc.moveDown(0.3);
  bodyText(doc, 'Remove the dipstick until the interface between wet and dry areas is apparent. Note the reading, estimating the distance from the last wet engraved line to the one above it.');
  doc.moveDown(0.3);

  // Example box
  const exY = doc.y;
  doc.save();
  doc.roundedRect(50, exY, doc.page.width - 100, 52, 6).lineWidth(1).strokeColor(C.neutral300).stroke();
  doc.roundedRect(50, exY, doc.page.width - 100, 52, 6).fillOpacity(0.03).fill(C.primary);
  doc.fillOpacity(1);
  doc.fontSize(9).fill(C.primary).font('Helvetica-Bold').text('Example:', 65, exY + 8);
  doc.fontSize(9).fill(C.neutral700).font('Helvetica').text(
    'If the wet line is 800 litres, the dry line is 1,000 litres and you estimate the liquid level to be ¾ of the way between them, then the reading is 800 + ¾ of 200 = 950 litres.',
    65, exY + 22, { width: doc.page.width - 130 }
  );
  doc.restore();
  doc.y = exY + 62;

  bodyText(doc, 'Dry the dipstick in that area and check the accuracy of the reading by taking a second one.');
  doc.moveDown(0.3);

  // Delivery callout
  const delY = doc.y;
  doc.save();
  doc.roundedRect(50, delY, doc.page.width - 100, 35, 6).fill('#FEF3C7');
  doc.fontSize(9).fill(C.accentDark).font('Helvetica-Bold').text(
    'After a delivery: Allow 15 minutes after the delivery is completed before taking a reading to let the fuel level settle.',
    65, delY + 10, { width: doc.page.width - 130 }
  );
  doc.restore();
  doc.y = delY + 45;

  // After Use
  sectionTitle(doc, 'After Use');
  bodyText(doc, 'If you intend to keep the dipstick in the tank, lower the dipstick back into the tube and replace the cap.');
  doc.moveDown(0.3);
  bodyText(doc, 'If it is to be kept separately, remove it, wiping it with a cloth as you go, and store it in a place that will protect it from damage. Ideally lying flat and supported along its length.');

  addFooter(doc);
  doc.end();
  console.log('✓ DipsticksUsageGuide.pdf generated');
}

// ─── PDF 2: Dipstick Rubbing Guide ──────────────────────────────

function generateRubbingGuide() {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(fs.createWriteStream(path.join(outputDir, 'DipsticksRubbingGuide.pdf')));

  addHeader(doc);

  // Title
  doc.fontSize(20).fill(C.neutral900).font('Helvetica-Bold').text('Dipstick Rubbing Guide', { align: 'center' });
  doc.moveDown(0.2);
  doc.fontSize(10).fill(C.neutral500).font('Helvetica').text(
    'How to take a rubbing of an existing dipstick so we can manufacture a replacement.',
    { align: 'center' }
  );
  doc.moveDown(0.5);

  // You Will Need section (compact inline version)
  doc.moveDown(0.3);
  doc.fontSize(13).fill(C.primary).font('Helvetica-Bold').text('You Will Need');
  const ulY = doc.y + 2;
  doc.save();
  doc.moveTo(50, ulY).lineTo(200, ulY).lineWidth(2).strokeColor(C.accent).stroke();
  doc.restore();
  doc.moveDown(0.3);

  const items = [
    'Lint-free cloth',
    'Gloves',
    'Strip of paper the length of the dipstick (till roll is ideal)',
    'Pencil',
    'Tape',
  ];
  items.forEach((item) => {
    bulletItem(doc, item, 60);
    doc.moveDown(0.05);
  });
  doc.moveDown(0.2);

  // Preparation (compact section title)
  doc.moveDown(0.2);
  doc.fontSize(13).fill(C.primary).font('Helvetica-Bold').text('Preparation');
  const prepUlY = doc.y + 2;
  doc.save();
  doc.moveTo(50, prepUlY).lineTo(200, prepUlY).lineWidth(2).strokeColor(C.accent).stroke();
  doc.restore();
  doc.moveDown(0.25);

  bodyText(doc, 'Wearing gloves, assemble the dipsticks you want rubbings of in a safe area and examine them for damage. If damage is evident then take care when handling them.');
  doc.moveDown(0.15);
  bodyText(doc, 'Dry the dipsticks with the cloth and lay them side by side so that they can be examined to see if any are identical (all lines need to line up, not just equal volumes).');
  doc.moveDown(0.2);

  // Tip box (compact)
  const tipY = doc.y;
  doc.save();
  doc.roundedRect(50, tipY, doc.page.width - 100, 36, 6).fill(C.secondary);
  doc.fontSize(8.5).fill(C.primary).font('Helvetica-Bold').text('Tip: ', 65, tipY + 10, { continued: true });
  doc.font('Helvetica').text(
    'If there are identical dipsticks then only one rubbing need be taken. Just note on the rubbing that you require multiple dipsticks from this one rubbing.',
    { width: doc.page.width - 145 }
  );
  doc.restore();
  doc.y = tipY + 42;

  // Method (compact section title)
  doc.moveDown(0.2);
  doc.fontSize(13).fill(C.primary).font('Helvetica-Bold').text('Method');
  const methUlY = doc.y + 2;
  doc.save();
  doc.moveTo(50, methUlY).lineTo(200, methUlY).lineWidth(2).strokeColor(C.accent).stroke();
  doc.restore();
  doc.moveDown(0.25);

  bodyText(doc, 'The rubbing is done in the manner of taking a brass rubbing of a coin or plaque:');
  doc.moveDown(0.2);

  const steps = [
    'Tape the paper strip at the base of the dipstick.',
    'Pull the strip along the length of the dipstick and, with a light pull, stretch the paper and tape it to the top.',
    'Using the pencil, rub over the paper where the lines and numbers are.',
  ];
  steps.forEach((step, i) => {
    numberedStep(doc, i + 1, step, 55);
    doc.moveDown(0.35);
  });
  doc.moveDown(0.1);

  // Checklist
  doc.fontSize(10).fill(C.neutral900).font('Helvetica-Bold').text('Please make sure the following are clearly visible:');
  doc.moveDown(0.25);

  const checks = [
    'The base of the dipstick',
    'All the lines',
    'The first and last few sets of numbers',
    'The full volume number',
  ];
  checks.forEach((check) => {
    checkItem(doc, check, 60);
    doc.moveDown(0.05);
  });
  doc.moveDown(0.2);

  // Warning box (compact)
  const warnY = doc.y;
  doc.save();
  doc.roundedRect(50, warnY, doc.page.width - 100, 30, 6).fill('#FEF3C7');
  doc.fontSize(8.5).fill(C.accentDark).font('Helvetica-Bold').text(
    'If any of the above are not clearly visible, use the pencil to mark the line or show the number. If you can\'t see them then neither can we!',
    65, warnY + 8, { width: doc.page.width - 130 }
  );
  doc.restore();
  doc.y = warnY + 36;

  // Final note
  bodyText(doc, 'On the upper, blank part of the rubbing, write down:');
  doc.moveDown(0.1);
  bulletItem(doc, 'The overall length of the dipstick you require', 60);
  doc.moveDown(0.05);
  bulletItem(doc, 'The tank reference (if applicable)', 60);
  doc.moveDown(0.05);
  bulletItem(doc, 'The type of fuel the tank contains', 60);
  doc.moveDown(0.4);

  // CTA box (compact)
  const ctaY = doc.y;
  doc.save();
  doc.roundedRect(50, ctaY, doc.page.width - 100, 44, 6).lineWidth(1.5).strokeColor(C.accent).stroke();
  doc.fontSize(10).fill(C.neutral900).font('Helvetica-Bold').text('Ready to send your rubbing?', 65, ctaY + 8);
  doc.fontSize(8.5).fill(C.neutral700).font('Helvetica').text(
    'Post it to: Dipsticks Engineering, The Lodge, Wood Lane, Hinstock, Shropshire TF9 2TA — or request a quote online at www.dipsticksengineering.co.uk/request-a-quote/',
    65, ctaY + 22, { width: doc.page.width - 130 }
  );
  doc.restore();

  addFooter(doc);
  doc.end();
  console.log('✓ DipsticksRubbingGuide.pdf generated');
}

// ─── PDF 3: Tank Measurements Guidance Form ──────────────────────

function generateTankMeasurementsForm() {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.pipe(fs.createWriteStream(path.join(outputDir, 'DipsticksTankMeasurementsForm.pdf')));

  addHeader(doc);

  // Title
  doc.fontSize(20).fill(C.neutral900).font('Helvetica-Bold').text('Tank Measurements Guidance Form', { align: 'center' });
  doc.moveDown(0.3);
  doc.fontSize(11).fill(C.neutral500).font('Helvetica').text(
    'Use this guide to gather the measurements we need to manufacture your dipstick or calibration chart.',
    { align: 'center' }
  );
  doc.moveDown(0.6);

  // ── Step 1: Identify your tank ──
  numberedStep(doc, 1, 'Identify your tank type', 50);
  doc.moveDown(0.6);

  // Draw 4 tank shapes
  const tankY = doc.y;
  const tankW = 110;
  const gap = 15;
  const startX = 55;

  // Helper to draw a labelled tank type box
  function tankTypeBox(x, y, label, drawFn) {
    doc.save();
    doc.roundedRect(x, y, tankW, 90, 4).lineWidth(1).strokeColor(C.neutral300).stroke();
    drawFn(x, y);
    doc.fontSize(8).fill(C.neutral700).font('Helvetica-Bold').text(label, x, y + 72, { width: tankW, align: 'center' });
    doc.restore();
  }

  // Cylindrical Dished End - horizontal cylinder with dished ends
  tankTypeBox(startX, tankY, 'Cylindrical\nDished End', (x, y) => {
    doc.save();
    const cx = x + 20, cy = y + 38, w = 70, h = 30;
    doc.roundedRect(cx, cy - h/2, w, h, 14).lineWidth(1.5).strokeColor(C.primaryLight).stroke();
    // Small cap on top
    doc.rect(cx + w/2 - 5, cy - h/2 - 6, 10, 6).lineWidth(1).strokeColor(C.neutral500).stroke();
    doc.restore();
  });

  // Cylindrical Flat End
  tankTypeBox(startX + tankW + gap, tankY, 'Cylindrical\nFlat End', (x, y) => {
    doc.save();
    const cx = x + 15, cy = y + 38, w = 80, h = 28;
    doc.rect(cx, cy - h/2, w, h).lineWidth(1.5).strokeColor(C.primaryLight).stroke();
    // Cap
    doc.rect(cx + w/2 - 5, cy - h/2 - 6, 10, 6).lineWidth(1).strokeColor(C.neutral500).stroke();
    doc.restore();
  });

  // Rectangular
  tankTypeBox(startX + (tankW + gap) * 2, tankY, 'Rectangular', (x, y) => {
    doc.save();
    const cx = x + 15, cy = y + 32, w = 80, h = 35;
    doc.rect(cx, cy - h/2, w, h).lineWidth(1.5).strokeColor(C.primaryLight).stroke();
    // Cap
    doc.rect(cx + w/2 - 5, cy - h/2 - 6, 10, 6).lineWidth(1).strokeColor(C.neutral500).stroke();
    doc.restore();
  });

  // Vertical Cylindrical
  tankTypeBox(startX + (tankW + gap) * 3, tankY, 'Vertical\nCylindrical', (x, y) => {
    doc.save();
    const cx = x + 30, cy = y + 18, w = 50, h = 50;
    doc.roundedRect(cx, cy, w, h, 3).lineWidth(1.5).strokeColor(C.primaryLight).stroke();
    // Small cap
    doc.rect(cx + w/2 - 5, cy - 6, 10, 6).lineWidth(1).strokeColor(C.neutral500).stroke();
    doc.restore();
  });

  doc.y = tankY + 105;

  // ── Step 2: Measurements tables ──
  numberedStep(doc, 2, 'Record the measurements for your tank type', 50);
  doc.moveDown(0.6);
  doc.fontSize(9).fill(C.neutral500).font('Helvetica').text('All measurements in millimetres unless stated otherwise.', 50);
  doc.moveDown(0.5);

  // Draw measurement table
  function measurementTable(x, y, title, fields, width) {
    doc.save();
    const rowH = 22;
    const tableH = rowH * (fields.length + 1);

    // Header
    doc.roundedRect(x, y, width, rowH, 3).fill(C.primary);
    doc.fontSize(9).fill(C.white).font('Helvetica-Bold').text(title, x + 6, y + 6, { width: width - 12 });

    // Rows
    fields.forEach((field, i) => {
      const ry = y + rowH * (i + 1);
      doc.rect(x, ry, width, rowH).lineWidth(0.5).strokeColor(C.neutral300).stroke();
      if (i % 2 === 0) {
        doc.rect(x, ry, width, rowH).fillOpacity(0.03).fill(C.primary);
        doc.fillOpacity(1);
      }
      doc.fontSize(8.5).fill(C.neutral700).font('Helvetica').text(field, x + 6, ry + 6, { width: width * 0.55 });
      // Blank answer area (subtle dotted line)
      const lineX = x + width * 0.6;
      const lineEndX = x + width - 6;
      const lineY2 = ry + rowH - 6;
      doc.save();
      doc.moveTo(lineX, lineY2).lineTo(lineEndX, lineY2).lineWidth(0.5).dash(2, { space: 2 }).strokeColor(C.neutral300).stroke();
      doc.restore();
    });

    doc.restore();
    return y + tableH + 8;
  }

  const tblY = doc.y;
  const tblW = (doc.page.width - 100 - 15) / 2; // Two tables per row

  // Row 1: Cylindrical Dished End + Cylindrical Flat End
  measurementTable(50, tblY, 'Cylindrical Dished End', [
    'Internal Diameter',
    'Tangent to Tangent Length',
    'Overall Length',
    'Spherical Radius (if known)',
    'Knuckle Radius (if known)',
    'Tilt',
    'Dip Point',
  ], tblW);

  measurementTable(50 + tblW + 15, tblY, 'Cylindrical Flat End', [
    'Internal Diameter',
    'Length',
    'Tilt',
    'Dip Point',
  ], tblW);

  doc.y = tblY + 22 * 8 + 15; // After tallest table

  // Row 2: Rectangular + Vertical Cylindrical
  const tbl2Y = doc.y;
  measurementTable(50, tbl2Y, 'Rectangular', [
    'Length',
    'Width',
    'Height',
    'Tilt',
    'Dip Point',
  ], tblW);

  measurementTable(50 + tblW + 15, tbl2Y, 'Vertical Cylindrical', [
    'Internal Diameter',
    'Length / Height',
  ], tblW);

  doc.y = tbl2Y + 22 * 6 + 15;

  // ── Step 3: Tilt details ──
  numberedStep(doc, 3, 'If your tank is tilted, provide additional details', 50);
  doc.moveDown(0.5);

  const tiltY = doc.y;
  const tiltW = (doc.page.width - 100 - 15) / 2;

  // Tilt info box
  doc.save();
  doc.roundedRect(50, tiltY, doc.page.width - 100, 40, 4).fill(C.secondary);
  doc.fontSize(9).fill(C.primary).font('Helvetica').text(
    'If your tank is on a slope or tilt, we need to know the dip point position and the degree of tilt. This can be expressed as an angle (e.g. 2°) or as a height difference between the two ends (e.g. 50mm).',
    65, tiltY + 10, { width: doc.page.width - 130 }
  );
  doc.restore();
  doc.y = tiltY + 52;

  measurementTable(50, doc.y, 'If Tilted Tank', [
    'Point of Dip (from lowest end)',
    'Tilt (angular or height diff)',
  ], doc.page.width - 100);

  // ── Page 2 ──
  doc.addPage();
  addHeader(doc);

  // Step 4: Rod length
  numberedStep(doc, 4, 'Choose your dipstick length', 50);
  doc.moveDown(0.5);

  bodyText(doc, 'Specify the total rod length required. Our dipsticks can be manufactured up to 5 metres long.');
  doc.moveDown(0.4);

  // Rod length input box
  const rodY = doc.y;
  doc.save();
  doc.roundedRect(50, rodY, doc.page.width - 100, 45, 6).lineWidth(1.5).strokeColor(C.accent).stroke();
  doc.fontSize(10).fill(C.neutral900).font('Helvetica-Bold').text('Total Rod Length:', 65, rodY + 8);
  doc.moveTo(200, rodY + 32).lineTo(doc.page.width - 65, rodY + 32).lineWidth(0.5).dash(2, { space: 2 }).strokeColor(C.neutral300).stroke();
  doc.fontSize(8).fill(C.neutral500).font('Helvetica').text('(up to 5 metres)', 65, rodY + 28);
  doc.restore();
  doc.y = rodY + 60;

  // Step 5: Engraving text
  numberedStep(doc, 5, 'Additional engraving text', 50);
  doc.moveDown(0.5);

  bodyText(doc, 'Specify any additional information you would like engraved onto the dipstick, for example your order reference, tank ID or site name.');
  doc.moveDown(0.4);

  // Engraving text input area
  const engY = doc.y;
  doc.save();
  doc.roundedRect(50, engY, doc.page.width - 100, 70, 6).lineWidth(1).strokeColor(C.neutral300).stroke();
  doc.fontSize(8).fill(C.neutral500).font('Helvetica').text('Write engraving text here:', 65, engY + 8);
  // Dotted lines
  for (let i = 0; i < 2; i++) {
    const ly = engY + 35 + i * 20;
    doc.moveTo(65, ly).lineTo(doc.page.width - 65, ly).lineWidth(0.5).dash(2, { space: 2 }).strokeColor(C.neutral300).stroke();
  }
  doc.restore();
  doc.y = engY + 90;

  // Step 6: Quantity
  numberedStep(doc, 6, 'Quantity required', 50);
  doc.moveDown(0.5);

  const qtyY = doc.y;
  doc.save();
  doc.roundedRect(50, qtyY, doc.page.width - 100, 40, 6).lineWidth(1).strokeColor(C.neutral300).stroke();
  doc.fontSize(10).fill(C.neutral900).font('Helvetica-Bold').text('Number of dipsticks:', 65, qtyY + 12);
  doc.moveTo(240, qtyY + 28).lineTo(340, qtyY + 28).lineWidth(0.5).dash(2, { space: 2 }).strokeColor(C.neutral300).stroke();
  doc.restore();
  doc.y = qtyY + 55;

  // CTA box
  doc.moveDown(0.5);
  const cta2Y = doc.y;
  doc.save();
  doc.roundedRect(50, cta2Y, doc.page.width - 100, 65, 6).fill(C.primary);
  doc.fontSize(12).fill(C.white).font('Helvetica-Bold').text('Submit your measurements', 65, cta2Y + 12, { width: doc.page.width - 130 });
  doc.fontSize(9.5).fill(C.secondary).font('Helvetica').text(
    'You can submit this form online at www.dipsticksengineering.co.uk/request-a-quote/ or post it to us at: Dipsticks Engineering, The Lodge, Wood Lane, Hinstock, Shropshire TF9 2TA',
    65, cta2Y + 30, { width: doc.page.width - 130, lineGap: 2 }
  );
  doc.restore();

  addFooter(doc);
  doc.end();
  console.log('✓ DipsticksTankMeasurementsForm.pdf generated');
}

// ─── Run all ─────────────────────────────────────────────────────

generateUsageGuide();
generateRubbingGuide();
generateTankMeasurementsForm();
console.log('\nAll PDFs generated in public/downloads/');
