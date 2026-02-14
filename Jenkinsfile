pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        // Optional: tests
        stage('Test') {
            when {
                fileExists 'package.json'
            }
            steps {
                sh 'npm test -- --watch=false || true'
            }
        }
    }

    post {
        success {
            echo '✅ Build successful'
        }
        failure {
            echo '❌ Build failed'
        }
    }
}
