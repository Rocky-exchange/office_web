pipeline {
  agent any

  environment {
    S3_BUCKET = 'rocky-office-web-test'
    REGION    = 'ap-northeast-1'
    REPO_URL  = 'https://github.com/Rocky-exchange/office_web.git'
    BRANCH    = 'dev'
    // 主页调后端(/v1/og-applications 等)同源走主域名 → nginx 代理到 api-gateway
    NEXT_PUBLIC_ROCKY_WALLET_API_BASE_URL = 'https://rockytest.xyz'
  }

  options {
    disableConcurrentBuilds(abortPrevious: true)
    timeout(time: 30, unit: 'MINUTES')
    ansiColor('xterm')
  }

  triggers { githubPush() }

  stages {
    stage('Checkout') {
      steps {
        git branch: "${BRANCH}", credentialsId: 'github-https', url: "${REPO_URL}"
      }
    }

    stage('Build') {
      steps {
        sh '''
          set -e
          cat > .env.production <<EOF
NEXT_PUBLIC_ROCKY_WALLET_API_BASE_URL=$NEXT_PUBLIC_ROCKY_WALLET_API_BASE_URL
EOF
          echo "===> npm ci"
          npm ci
          echo "===> next build (static export -> dist/)"
          npm run build
          [ -d dist ] || { echo "dist/ not produced"; exit 1; }
          echo "dist files: $(find dist -type f | wc -l)"
        '''
      }
    }

    stage('Upload to S3') {
      steps {
        sh '''
          set -e
          aws s3 sync dist/ "s3://$S3_BUCKET/" --delete --region "$REGION"
        '''
      }
    }
  }
}
