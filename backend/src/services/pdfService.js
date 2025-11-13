const PDFDocument = require('pdfkit');
const fs = require('node:fs');
const path = require('node:path');

// Ensure the pdfs directory exists
const PDF_DIR = path.join(__dirname, '../../pdfs');
if (!fs.existsSync(PDF_DIR)) {
  fs.mkdirSync(PDF_DIR, { recursive: true });
}

/**
 * Generate a PDF document for a KYC application
 * @param {Object} kycData - The KYC data to include in the PDF
 * @returns {Promise<string>} - Path to the generated PDF file
 */
async function generateKycPdf(kycData) {
  return new Promise((resolve, reject) => {
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `kyc_${kycData._id}_${timestamp}.pdf`;
      const filePath = path.join(PDF_DIR, filename);

      // Create a PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      });

      // Pipe the PDF to a file
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Add header
      doc
        .fontSize(24)
        .fillColor('#2c3e50')
        .text('KYC Application Report', { align: 'center' })
        .moveDown(0.5);

      // Add a line separator
      doc
        .strokeColor('#3498db')
        .lineWidth(2)
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke()
        .moveDown(1);

      // Add application ID and submission date
      doc
        .fontSize(10)
        .fillColor('#7f8c8d')
        .text(`Application ID: ${kycData._id}`, { align: 'right' })
        .text(`Generated: ${new Date().toLocaleString()}`, { align: 'right' })
        .moveDown(1.5);

      // Add personal information section
      addSection(doc, 'Personal Information');
      
      addField(doc, 'Full Name', kycData.name || 'N/A');
      addField(doc, 'Email Address', kycData.email || 'N/A');
      addField(doc, 'National ID (NID)', kycData.nid || 'N/A');
      addField(doc, 'Occupation', kycData.occupation || 'N/A');
      addField(doc, 'Address', kycData.address || 'N/A', true);

      doc.moveDown(1);

      // Add application status section
      addSection(doc, 'Application Status');
      
      const statusColors = {
        pending: '#f39c12',
        approved: '#27ae60',
        rejected: '#e74c3c',
        under_review: '#3498db'
      };

      const statusColor = statusColors[kycData.status] || '#95a5a6';
      
      doc
        .fontSize(12)
        .fillColor('#2c3e50')
        .text('Status: ', { continued: true })
        .fillColor(statusColor)
        .text(kycData.status.toUpperCase().replace('_', ' '));

      addField(doc, 'Submitted At', new Date(kycData.submittedAt).toLocaleString());
      
      if (kycData.reviewedAt) {
        addField(doc, 'Reviewed At', new Date(kycData.reviewedAt).toLocaleString());
      }

      if (kycData.reviewedBy) {
        addField(doc, 'Reviewed By', kycData.reviewedBy.name || kycData.reviewedBy);
      }

      if (kycData.reviewNotes) {
        doc.moveDown(0.5);
        addField(doc, 'Review Notes', kycData.reviewNotes, true);
      }

      doc.moveDown(1);

      // Add AI summary section if available
      if (kycData.aiSummary) {
        addSection(doc, 'AI-Generated Summary');
        
        doc
          .fontSize(11)
          .fillColor('#34495e')
          .text(kycData.aiSummary, {
            align: 'justify',
            lineGap: 5
          });

        doc.moveDown(1);
      }

      // Add footer
      const bottomY = doc.page.height - 70;
      doc
        .fontSize(8)
        .fillColor('#95a5a6')
        .text(
          'This is an auto-generated document. For verification, please contact the system administrator.',
          50,
          bottomY,
          {
            align: 'center',
            width: 495
          }
        );

      // Add page border
      doc
        .rect(40, 40, doc.page.width - 80, doc.page.height - 80)
        .strokeColor('#bdc3c7')
        .lineWidth(1)
        .stroke();

      // Finalize the PDF
      doc.end();

      // Wait for the stream to finish
      stream.on('finish', () => {
        console.log(`PDF generated successfully: ${filename}`);
        resolve(filePath);
      });

      stream.on('error', (err) => {
        console.error('Error writing PDF:', err);
        reject(err);
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
}

/**
 * Add modern header with branding
 */
function addModernHeader(doc, kycData) {
  const startY = doc.y;
  
  // Header background with gradient effect
  doc
    .rect(40, 40, doc.page.width - 80, 100)
    .fill(COLORS.primary);
  
  // Lighter overlay for gradient effect
  doc
    .rect(40, 40, doc.page.width - 80, 50)
    .fillOpacity(0.3)
    .fill(COLORS.secondary)
    .fillOpacity(1);

  // Title
  doc
    .fontSize(28)
    .fillColor('#ffffff')
    .font('Helvetica-Bold')
    .text('KYC Application Report', 60, 65, { align: 'left' });

  // Subtitle
  doc
    .fontSize(11)
    .fillColor('#ffffff')
    .fillOpacity(0.9)
    .font('Helvetica')
    .text('Know Your Customer Verification Document', 60, 100, { align: 'left' })
    .fillOpacity(1);

  // Reset position
  doc.y = startY + 120;
}

/**
 * Add metadata card with application info
 */
function addMetadataCard(doc, kycData) {
  const cardY = doc.y;
  const cardHeight = 70;
  
  // Card background
  doc
    .roundedRect(60, cardY, doc.page.width - 120, cardHeight, 5)
    .fillAndStroke(COLORS.background, COLORS.lighter);

  // Application ID
  doc
    .fontSize(9)
    .fillColor(COLORS.medium)
    .font('Helvetica')
    .text('APPLICATION ID', 80, cardY + 15);
  
  doc
    .fontSize(11)
    .fillColor(COLORS.dark)
    .font('Helvetica-Bold')
    .text(kycData._id, 80, cardY + 30);

  // Generated date
  doc
    .fontSize(9)
    .fillColor(COLORS.medium)
    .font('Helvetica')
    .text('GENERATED ON', doc.page.width - 260, cardY + 15);
  
  doc
    .fontSize(11)
    .fillColor(COLORS.dark)
    .font('Helvetica-Bold')
    .text(new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }), doc.page.width - 260, cardY + 30);

  doc.y = cardY + cardHeight + 10;
}

/**
 * Add a modern section header
 */
function addModernSection(doc, title, icon) {
  const sectionY = doc.y;
  
  // Section header with accent line
  doc
    .rect(60, sectionY, 4, 20)
    .fill(COLORS.secondary);

  doc
    .fontSize(16)
    .fillColor(COLORS.dark)
    .font('Helvetica-Bold')
    .text(title, 75, sectionY + 2);

  doc.y = sectionY + 30;
}

/**
 * Add info card with fields
 */
function addInfoCard(doc, fields) {
  const cardY = doc.y;
  const cardPadding = 20;
  const fieldHeight = 35;
  let currentY = cardY + cardPadding;

  // Calculate card height
  const cardHeight = fields.length * fieldHeight + cardPadding * 2;

  // Card background
  doc
    .roundedRect(60, cardY, doc.page.width - 120, cardHeight, 5)
    .fillAndStroke(COLORS.background, COLORS.lighter);

  // Add fields
  for (const field of fields) {
    const xPos = 80;
    
    // Label
    doc
      .fontSize(9)
      .fillColor(COLORS.medium)
      .font('Helvetica')
      .text(field.label.toUpperCase(), xPos, currentY);

    // Value
    doc
      .fontSize(11)
      .fillColor(COLORS.dark)
      .font('Helvetica')
      .text(field.value, xPos, currentY + 12, {
        width: doc.page.width - 160,
        ellipsis: !field.fullWidth
      });

    currentY += fieldHeight;
  }

  doc.y = cardY + cardHeight + 10;
}

/**
 * Add status card with visual indicators
 */
function addStatusCard(doc, kycData) {
  const cardY = doc.y;
  const cardPadding = 20;
  const cardHeight = 120;

  const statusColors = {
    pending: COLORS.warning,
    approved: COLORS.success,
    rejected: COLORS.danger,
    under_review: COLORS.secondary
  };

  const statusColor = statusColors[kycData.status] || COLORS.medium;

  // Card background
  doc
    .roundedRect(60, cardY, doc.page.width - 120, cardHeight, 5)
    .fillAndStroke(COLORS.background, COLORS.lighter);

  // Status badge
  const badgeWidth = 120;
  const badgeHeight = 30;
  const badgeX = 80;
  const badgeY = cardY + cardPadding;

  doc
    .roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 15)
    .fill(statusColor);

  doc
    .fontSize(12)
    .fillColor('#ffffff')
    .font('Helvetica-Bold')
    .text(
      kycData.status.toUpperCase().replace('_', ' '),
      badgeX,
      badgeY + 8,
      { width: badgeWidth, align: 'center' }
    );

  // Timeline info
  let infoY = badgeY + badgeHeight + 15;

  doc
    .fontSize(9)
    .fillColor(COLORS.medium)
    .font('Helvetica')
    .text('SUBMITTED', 80, infoY);

  doc
    .fontSize(10)
    .fillColor(COLORS.dark)
    .font('Helvetica')
    .text(new Date(kycData.submittedAt).toLocaleString(), 80, infoY + 12);

  if (kycData.reviewedAt) {
    doc
      .fontSize(9)
      .fillColor(COLORS.medium)
      .font('Helvetica')
      .text('REVIEWED', doc.page.width / 2, infoY);

    doc
      .fontSize(10)
      .fillColor(COLORS.dark)
      .font('Helvetica')
      .text(new Date(kycData.reviewedAt).toLocaleString(), doc.page.width / 2, infoY + 12);
  }

  // Review notes if available
  if (kycData.reviewNotes) {
    infoY += 40;
    doc
      .fontSize(9)
      .fillColor(COLORS.medium)
      .font('Helvetica')
      .text('REVIEW NOTES', 80, infoY);

    doc
      .fontSize(10)
      .fillColor(COLORS.dark)
      .font('Helvetica')
      .text(kycData.reviewNotes, 80, infoY + 12, {
        width: doc.page.width - 160,
        lineGap: 3
      });
  }

  doc.y = cardY + cardHeight + 10;
}

/**
 * Add AI summary section with improved pagination
 */
function addAISummarySection(doc, aiSummary) {
  const pageHeight = doc.page.height;
  const bottomMargin = 100; // Space for footer
  const maxContentY = pageHeight - bottomMargin;

  // Check if we need a new page for the section header
  if (doc.y > maxContentY - 100) {
    doc.addPage();
  }

  addModernSection(doc, 'AI-Generated Analysis', 'ai');

  const cardY = doc.y;
  const cardPadding = 20;
  const leftMargin = 60;
  const rightMargin = 60;
  const cardWidth = doc.page.width - leftMargin - rightMargin;

  // Split text into paragraphs
  const paragraphs = aiSummary.split('\n').filter(p => p.trim());
  
  // Start the card
  let currentPageCardStart = cardY;
  let currentY = cardY + cardPadding;

  // Draw initial card background
  doc
    .roundedRect(leftMargin, cardY, cardWidth, 40, 5)
    .fillAndStroke(COLORS.background, COLORS.lighter);

  // AI icon/label
  doc
    .fontSize(10)
    .fillColor(COLORS.secondary)
    .font('Helvetica-Bold')
    .text('🤖 AI SUMMARY', leftMargin + cardPadding, currentY);

  currentY += 30;

  // Process each paragraph
  for (const paragraph of paragraphs) {
    const textOptions = {
      width: cardWidth - (cardPadding * 2),
      align: 'justify',
      lineGap: 4
    };

    // Calculate the height this paragraph would take
    const textHeight = doc.heightOfString(paragraph, textOptions);
    
    // Check if we need a new page
    if (currentY + textHeight + cardPadding > maxContentY) {
      // Close current card
      const currentCardHeight = currentY - currentPageCardStart + 10;
      doc
        .roundedRect(leftMargin, currentPageCardStart, cardWidth, currentCardHeight, 5)
        .fillAndStroke(COLORS.background, COLORS.lighter);

      // Add new page
      doc.addPage();
      
      // Reset position for new page
      currentPageCardStart = doc.y;
      currentY = doc.y + cardPadding;

      // Draw continuation indicator
      doc
        .fontSize(9)
        .fillColor(COLORS.medium)
        .font('Helvetica-Oblique')
        .text('(continued)', leftMargin + cardPadding, currentY);
      
      currentY += 25;
    }

    // Draw the paragraph
    doc
      .fontSize(10)
      .fillColor(COLORS.dark)
      .font('Helvetica')
      .text(paragraph, leftMargin + cardPadding, currentY, textOptions);

    currentY += textHeight + 10; // Add spacing between paragraphs
  }

  // Close the final card
  const finalCardHeight = currentY - currentPageCardStart + cardPadding;
  doc
    .roundedRect(leftMargin, currentPageCardStart, cardWidth, finalCardHeight, 5)
    .fillAndStroke(COLORS.background, COLORS.lighter);

  doc.y = currentY + 10;
}

/**
 * Add page footer with page numbers
 */
function addPageFooter(doc, pageNumber, totalPages) {
  const footerY = doc.page.height - 50;
  
  // Divider line
  doc
    .moveTo(60, footerY - 10)
    .lineTo(doc.page.width - 60, footerY - 10)
    .strokeColor(COLORS.lighter)
    .lineWidth(1)
    .stroke();

  // Footer text
  doc
    .fontSize(8)
    .fillColor(COLORS.medium)
    .font('Helvetica')
    .text(
      'This is an auto-generated KYC verification document. For inquiries, contact the system administrator.',
      60,
      footerY,
      {
        width: doc.page.width - 220,
        align: 'left'
      }
    );

  // Page number
  doc
    .fontSize(8)
    .fillColor(COLORS.medium)
    .font('Helvetica')
    .text(
      `Page ${pageNumber} of ${totalPages}`,
      doc.page.width - 160,
      footerY,
      {
        width: 100,
        align: 'right'
      }
    );
}

/**
 * Delete a PDF file
 */
async function deletePdf(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`PDF deleted: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting PDF:', error);
    throw error;
  }
}

/**
 * Check if a PDF file exists
 */
function pdfExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Get PDF directory path
 */
function getPdfDirectory() {
  return PDF_DIR;
}

module.exports = {
  generateKycPdf,
  deletePdf,
  pdfExists,
  getPdfDirectory
};
