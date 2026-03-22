pipeline {
    agent any // agent is the machine that will run the pipeline

    environment {
        NODE_ENV = 'production'
        PATH = "${env.HOME}/.bun/bin:${env.PATH}"
        IMAGE_NAME = 'jenkins-next-demo'
        // Must match the "Name" under Manage Jenkins → Configure System → SonarQube servers
        SONARQUBE_INSTALLATION = 'sonar-qube'
        // Optional job/folder env: if Jenkins’ SonarQube "Server URL" is localhost but the agent
        // cannot reach it (e.g. SonarQube on host, Jenkins in Docker), set this to a reachable URL
        // such as http://host.docker.internal:9000 or http://<host-LAN-IP>:9000 — overrides SONAR_HOST_URL for the scanner only.
        // SONAR_HOST_URL_OVERRIDE = 'http://host.docker.internal:9000'
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

        // SonarQube Scanner plugin: server URL + token come from Jenkins (not repo credentials).
        // Set SONARQUBE_INSTALLATION above to the exact SonarQube server "Name" in Jenkins.
        // If the build runs in Docker, do not use http://localhost:9000 in Jenkins’ SonarQube URL —
        // use a host/service IP or host.docker.internal so the agent can reach SonarQube.
        // If Jenkins already has localhost saved, set job env SONAR_HOST_URL_OVERRIDE (see environment {} above).
        stage('SonarQube analysis') {
            steps {
                withSonarQubeEnv("${env.SONARQUBE_INSTALLATION}") {
                    // npm sonarqube-scanner defaults to http://127.0.0.1:9000 unless properties are set.
                    // Pass URL/token explicitly. SONAR_HOST_URL_OVERRIDE wins over Jenkins’ SONAR_HOST_URL.
                    sh '''
                        set -e
                        if [ -z "${SONAR_HOST_URL:-}" ]; then
                          echo "ERROR: SONAR_HOST_URL is empty. In Jenkins: Manage Jenkins → Configure System → SonarQube servers, set Server URL to an address this agent can reach."
                          exit 1
                        fi
                        EFFECTIVE_URL="${SONAR_HOST_URL_OVERRIDE:-$SONAR_HOST_URL}"
                        if [ -n "${SONAR_HOST_URL_OVERRIDE:-}" ]; then
                          echo "SonarQube: using SONAR_HOST_URL_OVERRIDE (agent cannot use Jenkins global URL as-is)"
                        fi
                        echo "SonarQube: server URL for scanner: ${EFFECTIVE_URL}"
                        case "$EFFECTIVE_URL" in
                          *127.0.0.1*|*localhost*)
                            echo "NOTE: URL is localhost. If the scan fails with ECONNREFUSED, SonarQube is not on this agent — fix Jenkins SonarQube Server URL or set SONAR_HOST_URL_OVERRIDE (e.g. http://host.docker.internal:9000 on Docker Desktop)."
                            ;;
                        esac
                        if [ -n "${SONAR_AUTH_TOKEN:-}" ]; then
                          bunx sonarqube-scanner \
                            -Dsonar.host.url="$EFFECTIVE_URL" \
                            -Dsonar.token="$SONAR_AUTH_TOKEN"
                        else
                          bunx sonarqube-scanner -Dsonar.host.url="$EFFECTIVE_URL"
                        fi
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
