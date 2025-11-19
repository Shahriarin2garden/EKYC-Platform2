const scanner = require('sonarqube-scanner');

scanner(
  {
    serverUrl: 'http://localhost:9000',
    token: 'admin', // Will use admin/admin credentials
    options: {
      'sonar.projectKey': 'ekyc-platform',
      'sonar.projectName': 'EKYC Platform',
      'sonar.projectVersion': '1.0',
      'sonar.sources': 'backend/src,frontend/src',
      'sonar.tests': 'backend/src,frontend/src',
      'sonar.test.inclusions': '**/*.test.js,**/*.test.ts,**/*.test.tsx,**/*.spec.js,**/*.spec.ts,**/*.spec.tsx',
      'sonar.exclusions': '**/node_modules/**,**/build/**,**/dist/**,**/coverage/**,**/*.test.js,**/*.test.ts,**/*.test.tsx,**/*.spec.js,**/*.spec.ts,**/*.spec.tsx,**/pdfs/**,**/logs/**',
      'sonar.sourceEncoding': 'UTF-8',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info'
    }
  },
  (error) => {
    if (error) {
      console.error('❌ SonarQube analysis failed:', error);
      process.exit(1);
    }
    console.log('✅ SonarQube analysis completed successfully!');
    console.log('📊 View results at: http://localhost:9000/dashboard?id=ekyc-platform');
  }
);
