const { generateKycPdf } = require('./pdfService');
const path = require('path');

console.log('========================================');
console.log('  PDF Comprehensive Test Suite');
console.log('========================================\n');

// Test data for different scenarios
const testCases = [
  {
    name: 'Test 1: Approved Status (Minimal Data)',
    data: {
      _id: '507f1f77bcf86cd799439011',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      nid: '1111222233',
      occupation: 'Data Scientist',
      address: '456 AI Avenue, Tech City',
      status: 'approved',
      submittedAt: new Date('2024-11-10T09:00:00Z'),
      reviewedAt: new Date('2024-11-11T14:30:00Z'),
      reviewedBy: { name: 'Admin Smith' },
      aiSummary: 'The applicant has provided complete and verified documentation. All identity verification checks have passed successfully. Professional background is consistent with provided information.'
    }
  },
  {
    name: 'Test 2: Pending Status (Medium Data)',
    data: {
      _id: '507f191e810c19729de860ea',
      name: 'Bob Williams',
      email: 'bob.williams@company.com',
      nid: '9988776655',
      occupation: 'Marketing Manager',
      address: '789 Business Boulevard, Corporate District, Metropolitan City, ZIP 12345',
      status: 'pending',
      submittedAt: new Date('2024-11-12T08:15:00Z'),
      aiSummary: 'Application is under initial review. Documents have been submitted and are awaiting verification. The applicant has provided all required information including identity documents, proof of address, and occupational details. Preliminary assessment indicates no immediate red flags. Standard verification procedures will be completed within 24-48 hours.'
    }
  },
  {
    name: 'Test 3: Under Review (With Review Notes)',
    data: {
      _id: '507f1f77bcf86cd799439022',
      name: 'Carol Davis',
      email: 'carol.davis@freelancer.io',
      nid: '5544332211',
      occupation: 'Freelance Consultant',
      address: '321 Innovation Street, Startup Hub, Silicon Valley, CA 94025, USA',
      status: 'under_review',
      submittedAt: new Date('2024-11-08T11:20:00Z'),
      reviewedAt: new Date('2024-11-10T16:45:00Z'),
      reviewedBy: { name: 'Senior Reviewer Johnson' },
      reviewNotes: 'Additional verification required for international address. Freelance occupation requires supplementary income verification. Applicant has been contacted for additional documentation. Expected resolution within 3-5 business days.',
      aiSummary: 'Comprehensive analysis of the application reveals a complex profile requiring additional scrutiny. The applicant operates as a freelance consultant, which necessitates enhanced due diligence procedures. Identity documents appear authentic and match provided personal information. The international address component requires verification through independent channels. Professional credentials are being cross-referenced with industry databases. No adverse indicators detected at this stage. Recommendation: Continue with enhanced verification protocol.'
    }
  },
  {
    name: 'Test 4: Rejected Status',
    data: {
      _id: '507f1f77bcf86cd799439033',
      name: 'David Martinez',
      email: 'david.m@email.com',
      nid: '1234509876',
      occupation: 'Business Owner',
      address: '555 Commerce Street, Business Park',
      status: 'rejected',
      submittedAt: new Date('2024-11-05T10:00:00Z'),
      reviewedAt: new Date('2024-11-06T15:00:00Z'),
      reviewedBy: { name: 'Compliance Officer Brown' },
      reviewNotes: 'Application rejected due to incomplete documentation. Identity verification could not be completed with the provided information. Applicant may resubmit with complete documentation set.',
      aiSummary: 'Initial assessment indicates significant gaps in provided documentation. Identity verification procedures could not be completed due to insufficient documentation quality. The National ID verification returned inconclusive results requiring additional authentication steps that were not fulfilled within the required timeframe.'
    }
  }
];

// Run all tests
async function runAllTests() {
  console.log(`Running ${testCases.length} test cases...\n`);
  
  const results = [];
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Running: ${testCase.name}`);
    console.log(`${'='.repeat(60)}`);
    
    console.log('Data Summary:');
    console.log(`  - Name: ${testCase.data.name}`);
    console.log(`  - Status: ${testCase.data.status.toUpperCase()}`);
    console.log(`  - Email: ${testCase.data.email}`);
    console.log(`  - Has Review Notes: ${testCase.data.reviewNotes ? 'Yes' : 'No'}`);
    console.log(`  - AI Summary Length: ${testCase.data.aiSummary.length} characters`);
    
    try {
      console.log('\nGenerating PDF...');
      const pdfPath = await generateKycPdf(testCase.data);
      
      console.log(`✓ Success!`);
      console.log(`  File: ${path.basename(pdfPath)}`);
      
      results.push({
        test: testCase.name,
        status: 'SUCCESS',
        path: pdfPath
      });
    } catch (error) {
      console.error(`✗ Failed:`, error.message);
      results.push({
        test: testCase.name,
        status: 'FAILED',
        error: error.message
      });
    }
  }
  
  // Print summary
  console.log('\n\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  
  const successCount = results.filter(r => r.status === 'SUCCESS').length;
  const failCount = results.filter(r => r.status === 'FAILED').length;
  
  console.log(`\nTotal Tests: ${results.length}`);
  console.log(`✓ Passed: ${successCount}`);
  console.log(`✗ Failed: ${failCount}`);
  
  console.log('\nGenerated PDFs:');
  results.forEach(result => {
    if (result.status === 'SUCCESS') {
      console.log(`  ✓ ${path.basename(result.path)}`);
    }
  });
  
  if (failCount > 0) {
    console.log('\nFailed Tests:');
    results.forEach(result => {
      if (result.status === 'FAILED') {
        console.log(`  ✗ ${result.test}: ${result.error}`);
      }
    });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Visual Verification Checklist:');
  console.log('='.repeat(60));
  console.log('Please open the generated PDFs and verify:');
  console.log('  [ ] Modern gradient header (blue)');
  console.log('  [ ] Card-based layout with rounded corners');
  console.log('  [ ] Color-coded status badges:');
  console.log('      - Green for Approved');
  console.log('      - Amber for Pending');
  console.log('      - Blue for Under Review');
  console.log('      - Red for Rejected');
  console.log('  [ ] Proper typography and spacing');
  console.log('  [ ] AI summary properly paginated');
  console.log('  [ ] Page numbers on all pages');
  console.log('  [ ] Professional footer on all pages');
  console.log('  [ ] No orphaned lines (1-2 lines on last page)');
  console.log('\n✨ All PDFs saved in: backend/pdfs/\n');
  
  if (successCount === results.length) {
    console.log('🎉 All tests passed successfully!\n');
  } else {
    console.log('⚠️  Some tests failed. Please review the errors above.\n');
  }
}

// Execute tests
runAllTests().catch(error => {
  console.error('\n❌ Test suite failed:', error);
  process.exit(1);
});
