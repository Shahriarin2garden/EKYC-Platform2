const scanner = require('sonarqube-scanner').default;

scanner(
  {
    serverUrl: 'http://localhost:9000',
    login: 'admin',
    password: 'admin',
    options: {
      'sonar.projectKey': 'ekyc-platform',
      'sonar.projectName': 'EKYC Platform',
      'sonar.projectVersion': '1.0.0',
      'sonar.sources': 'backend/src,frontend/src',
      'sonar.exclusions': '**/node_modules/**,**/build/**,**/dist/**,**/coverage/**,**/*.test.*,**/*.spec.*,**/pdfs/**,**/logs/**',
      'sonar.sourceEncoding': 'UTF-8'
    }
  },
  () => {
    console.log('\n========================================');
    console.log('SonarQube Analysis Complete!');
    console.log('========================================');
    console.log('\nView results at:');
    console.log('http://localhost:9000/dashboard?id=ekyc-platform');
    console.log('\nDefault credentials:');
    console.log('  Username: admin');
    console.log('  Password: admin\n');
    process.exit(0);
  },
  (error) => {
    console.error('\nSonarQube analysis failed:', error);
    process.exit(1);
  }
);

console.log('\nStarting SonarQube Analysis...');
console.log('This may take 1-2 minutes...\n');
