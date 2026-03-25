pipeline {
    agent any // agent is the machine that will run the pipeline

    environment {
        NODE_ENV = 'production'
        PATH = "${env.HOME}/.bun/bin:${env.PATH}"
        IMAGE_NAME = 'jenkins-next-demo'
        SONARQUBE_INSTALLATION = 'sonar-qube'
        BACKEND_URL = 'http://backend:3010'
    }

    stages {
        stage('Checkout') { // checkout the source code from the repository, this is a built-in step in Jenkins
            steps {
                checkout scm
                script {
                    if (!env.BRANCH_NAME?.trim()) {
                        def raw = sh(script: '''
                            branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
                            if [ -z "$branch" ] || [ "$branch" = "HEAD" ]; then
                              branch=$(git name-rev --name-only HEAD 2>/dev/null | sed "s|remotes/origin/||;s|^origin/||" | cut -d"^" -f1)
                            fi
                            echo "${branch:-unknown}"
                        ''', returnStdout: true).trim()
                        env.BRANCH_NAME = raw
                    }
                }
            }
        }

        stage('Setup bun') { // setup bun, this is a custom step
            steps {
                echo "Setting up bun..."
                sh 'curl -fsSL https://bun.sh/install | bash'
            }
        }

        stage('Install dependencies') { // install the dependencies, this is a custom step
            steps {
                echo "Installing dependencies..."
                sh 'bun install --frozen-lockfile'
            }
        }

        stage('Lint') { // lint the code, this is a custom step
            steps {
                echo "Linting the code..."
                sh 'bun run lint'
            }
        }

        
        stage('SonarQube analysis') {
            steps {
                withSonarQubeEnv("${env.SONARQUBE_INSTALLATION}") {
                    sh '''
                        set -e
                        if [ -z "${SONAR_HOST_URL:-}" ]; then
                          echo "ERROR: SONAR_HOST_URL is empty. In Jenkins: Manage Jenkins → Configure System → SonarQube servers, set Server URL to an address this agent can reach (not localhost if SonarQube runs elsewhere or Jenkins is in Docker)."
                          exit 1
                        fi
                        bunx sonarqube-scanner \
                          -Dsonar.host.url="$SONAR_HOST_URL" \
                          -Dsonar.token="${SONAR_AUTH_TOKEN:-}"
                    '''
                }
            }
        }

        stage('Build') { // build the code, this is a custom step
            steps {
                echo "Building the code..."
                sh 'bun run build'
            }
        }

        stage('docker build') { // build the docker image, this is a custom step
            steps {
                script {
                    def branch = (env.BRANCH_NAME ?: 'unknown').replaceAll('/', '-')
                    def commit = (env.GIT_COMMIT ?: 'nocommit').take(7)
                    env.IMAGE_TAG = "${branch}-${commit}"
                    echo "Building the docker image..."
                    sh "docker build -t ${env.IMAGE_NAME}:${env.IMAGE_TAG} ."
                }
            }
        }

        stage('docker push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-login', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    echo 'Logging in to Docker Hub ...'
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    echo "Tagging the docker image..."
                    sh "docker tag ${env.IMAGE_NAME}:${env.IMAGE_TAG} docker.io/\$DOCKER_USERNAME/${env.IMAGE_NAME}:${env.IMAGE_TAG}"
                    echo "Pushing the docker image to Docker Hub..."
                    sh "docker push docker.io/\$DOCKER_USERNAME/${env.IMAGE_NAME}:${env.IMAGE_TAG}"
                    script {
                        // `latest` points at the newest image only for the default branch; other branches keep unique tags only.
                        def isLatestBranch = (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master')
                        if (isLatestBranch) {
                            echo "Tagging and pushing :latest (default branch only)..."
                            sh """
                                docker tag ${env.IMAGE_NAME}:${env.IMAGE_TAG} docker.io/\$DOCKER_USERNAME/${env.IMAGE_NAME}:latest
                                docker push docker.io/\$DOCKER_USERNAME/${env.IMAGE_NAME}:latest
                            """
                        } else {
                            echo "Skipping :latest (not main/master); image is ${env.IMAGE_NAME}:${env.IMAGE_TAG} only."
                        }
                    }
                }
            }
        }
        
        // stage('Deploy to Vercel') { // deploy the code to Vercel, this is a custom step
        //     when {
        //         branch 'main'
        //     }
        //     steps {
        //         withCredentials([string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN')]) {
        //             sh '''
        //                 bunx vercel pull --yes --environment=production --token=$VERCEL_TOKEN
        //                 bunx vercel deploy --prod --token=$VERCEL_TOKEN
        //             '''
        //         }
        //     }
        // }


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
        always {
            echo '🧹 cleaning up the workspace...'
            deleteDir()
        }
        success {
            echo '✅ Build successful'
            slackSend(
                color: 'good',
                message: "✅ *${env.JOB_NAME}* #${env.BUILD_NUMBER} succeeded\n<${env.BUILD_URL}|Open build> • Branch: ${env.BRANCH_NAME ?: 'N/A'} • Image: `${env.IMAGE_NAME}:${env.IMAGE_TAG ?: 'n/a'}`"
            )
        }
        failure {
            echo '❌ Build failed'
            slackSend(
                color: 'danger',
                message: "❌ *${env.JOB_NAME}* #${env.BUILD_NUMBER} failed\n<${env.BUILD_URL}|Open build> • Branch: ${env.BRANCH_NAME ?: 'N/A'}"
            )
        }
        unstable {
            slackSend(
                color: 'warning',
                message: "⚠️ *${env.JOB_NAME}* #${env.BUILD_NUMBER} is unstable\n<${env.BUILD_URL}|Open build>"
            )
        }
    }
}
