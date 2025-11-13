const { generateKycPdf } = require('./pdfService');

console.log('========================================');
console.log('  PDF Generation Test - Long AI Summary');
console.log('========================================\n');

// Mock KYC data with a very long AI summary
const mockKycData = {
  _id: '64f9a8b7c1234567890abcde',
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  nid: '9876543210',
  occupation: 'Software Engineer',
  address: '123 Tech Street, Innovation District, Silicon Valley, CA 94025, United States of America',
  status: 'under_review',
  submittedAt: new Date('2024-01-15T10:30:00Z'),
  reviewedAt: new Date('2024-01-16T14:45:00Z'),
  reviewedBy: {
    name: 'Admin User'
  },
  reviewNotes: 'Additional verification required for international address. Documents appear authentic but need secondary validation.',
  aiSummary: `APPLICANT PROFILE ANALYSIS

The applicant, Jane Smith, has submitted a comprehensive KYC application demonstrating professional credentials in the technology sector. The provided documentation indicates a strong professional background with verifiable employment history.

IDENTITY VERIFICATION ASSESSMENT

The National Identification Number (NID: 9876543210) has been cross-referenced with available databases. The format and structure of the identification number conform to standard protocols. Preliminary checks suggest the identity documents are consistent with legitimate documentation patterns.

The email address (jane.smith@example.com) follows professional naming conventions and is associated with a verifiable domain. This suggests a legitimate digital presence and communication channel.

OCCUPATIONAL AND FINANCIAL PROFILE

The applicant's declared occupation as a Software Engineer is consistent with the residential address in Silicon Valley, a region known for its concentration of technology professionals. This correlation strengthens the credibility of the application.

The address provided (123 Tech Street, Innovation District, Silicon Valley, CA 94025) represents a known technology hub area. The specificity of the address, including district and postal code, indicates attention to detail in the application process.

RISK ASSESSMENT FACTORS

Several positive indicators have been identified:
1. Consistent and detailed personal information across all fields
2. Professional occupation in a verifiable industry sector
3. Residential address in a documented geographical area
4. Appropriate documentation format and completeness
5. Timely submission of required materials

BEHAVIORAL ANALYSIS

The application demonstrates characteristics of a genuine submission:
- All mandatory fields completed with appropriate detail
- Information provided shows logical consistency
- No obvious discrepancies or red flags in the initial review
- Professional communication style maintained throughout

DOCUMENT AUTHENTICITY INDICATORS

While a comprehensive forensic analysis requires specialized tools, initial assessment suggests:
- Document formatting follows standard conventions
- Information density is appropriate for genuine applications
- No obvious signs of template manipulation or data fabrication
- Textual content demonstrates natural language patterns

GEOGRAPHIC AND DEMOGRAPHIC CONSIDERATIONS

The Silicon Valley location is significant from a risk perspective:
- High concentration of legitimate professional activity
- Well-established verification infrastructure
- Lower statistical fraud rates for this demographic
- Strong correlation between occupation and location

RECOMMENDATION FRAMEWORK

Based on the comprehensive analysis of available data points, the application presents a LOW to MODERATE risk profile. The consistency of information, professional background, and geographic indicators all contribute to a favorable assessment.

However, the international address component necessitates additional verification steps as noted in the review comments. This is a standard procedural requirement rather than an indicator of elevated risk.

SUGGESTED NEXT STEPS

1. Conduct secondary verification of the provided address through independent channels
2. Cross-reference employment information with industry databases if accessible
3. Verify email domain authenticity and association with legitimate services
4. Consider requesting supplementary documentation for address verification
5. Schedule follow-up review after additional verification is complete

COMPLIANCE AND REGULATORY NOTES

The application meets baseline regulatory requirements for KYC submissions. All mandatory data points have been provided, and the information quality exceeds minimum standards. The application is suitable for progression to the next verification stage pending completion of supplementary checks.

FINAL SUMMARY

Jane Smith's KYC application represents a well-documented submission with strong positive indicators. While additional verification is recommended due to the international address component, the overall risk assessment remains favorable. The application is suitable for approval subject to successful completion of secondary verification procedures.`
};

console.log('Starting PDF generation test with long AI summary...\n');
console.log('Test Data:');
console.log(`- Name: ${mockKycData.name}`);
console.log(`- Status: ${mockKycData.status}`);
console.log(`- AI Summary Length: ${mockKycData.aiSummary.length} characters`);
console.log(`- AI Summary Paragraphs: ${mockKycData.aiSummary.split('\n\n').length}\n`);

console.log('Generating PDF...');

generateKycPdf(mockKycData)
  .then((filePath) => {
    console.log(`\n✓ PDF generated successfully!`);
    console.log(`✓ PDF saved at: ${filePath}`);
    console.log('\nYou can open this PDF file to verify:');
    console.log('1. Modern design with gradient header');
    console.log('2. Proper pagination of long AI summary');
    console.log('3. No orphaned lines on separate pages');
    console.log('4. Professional card-based layout');
    console.log('5. Page numbers and footers on all pages');
    console.log('\nTest completed successfully! 🎉');
  })
  .catch((error) => {
    console.error('\n✗ Error generating PDF:', error);
    process.exit(1);
  });
