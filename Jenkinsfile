pipeline {
    agent any // agent is the machine that will run the pipeline

    environment {
        NODE_ENV = 'production'
        PATH = "${env.HOME}/.bun/bin:${env.PATH}"
        IMAGE_NAME = 'jenkins-next-demo'
        IMAGE_TAG = '${BRANCH_NAME}-${GIT_COMMIT}'
    }

    stages {
        stage('Checkout') { // checkout the source code from the repository, this is a built-in step in Jenkins
            steps {
                checkout scm
            }
        }

        stage('Setup bun') { // setup bun, this is a custom step
            steps {
                sh 'curl -fsSL https://bun.sh/install | bash'
            }
        }

        stage('Install dependencies') { // install the dependencies, this is a custom step
            steps {
                sh 'bun install --frozen-lockfile'
            }
        }

        stage('Lint') { // lint the code, this is a custom step
            steps {
                sh 'bun run lint'
            }
        }

        stage('Build') { // build the code, this is a custom step
            steps {
                sh 'bun run build'
            }
        }

        stage('docker build') { // build the docker image, this is a custom step
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .'
            }
        }

        // stage('docker push') {
        //     steps {
        //         withCredentials([string(credentialsId: 'docker-hub-token', variable: 'DOCKER_HUB_TOKEN')]) {
        //             sh 'docker tag ${IMAGE_NAME}:${IMAGE_TAG} docker.io/${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}'
        //             sh 'docker push docker.io/${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}'
        //         }
        //     }
        // }

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
