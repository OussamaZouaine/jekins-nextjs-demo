pipeline {
    agent any // agent is the machine that will run the pipeline

    environment {
        NODE_ENV = 'production'
        PATH = "${env.HOME}/.bun/bin:${env.PATH}"
        IMAGE_NAME = 'jenkins-next-demo'
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
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    echo 'Logging in to Docker Hub ...'
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    echo "Tagging the docker image..."
                    sh "docker tag ${env.IMAGE_NAME}:${env.IMAGE_TAG} docker.io/\$DOCKER_USERNAME/${env.IMAGE_NAME}:${env.IMAGE_TAG}"
                    echo "Pushing the docker image to Docker Hub..."
                    sh "docker push docker.io/\$DOCKER_USERNAME/${env.IMAGE_NAME}:${env.IMAGE_TAG}"
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
        success {
            echo '✅ Build successful'
        }
        failure {
            echo '❌ Build failed'
        }
    }
}
