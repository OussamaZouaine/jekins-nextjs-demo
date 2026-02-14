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

        stage('Setup bun') {
            steps {
                sh 'curl -fsSL https://bun.sh/install | bash'
            }
        }

        stage('Install dependencies') {
            environment {
                PATH = "${env.HOME}/.bun/bin:${env.PATH}"
            }
            steps {
                sh 'bun install --frozen-lockfile'
            }
        }

        stage('Lint') {
            environment {
                PATH = "${env.HOME}/.bun/bin:${env.PATH}"
            }
            steps {
                sh 'bun run lint'
            }
        }

        stage('Build') {
            environment {
                PATH = "${env.HOME}/.bun/bin:${env.PATH}"
            }
            steps {
                sh 'bun run build'
            }
        }

        stage('docker build') {
            steps {
                sh 'docker build -t jenkins-next-demo .'
            }
        }

        stage('Deploy to Vercel') {
            when {
                branch 'main'
            }
            environment {
                PATH = "${env.HOME}/.bun/bin:${env.PATH}"
            }
            steps {
                withCredentials([string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN')]) {
                    sh '''
                        bunx vercel pull --yes --environment=production --token=$VERCEL_TOKEN
                        bunx vercel deploy --prod --token=$VERCEL_TOKEN
                    '''
                }
            }
        }


        // stage('Test') {
        //     when {
        //         expression { fileExists('package.json') }
        //     }
        //     environment {
        //         PATH = "${env.HOME}/.bun/bin:${env.PATH}"
        //     }
        //     steps {
        //         sh 'bun test || true'
        //     }
        // }
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
