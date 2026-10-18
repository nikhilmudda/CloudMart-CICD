pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        AWS_REGION     = 'ap-southeast-2'
        ECR_REPOSITORY = 'cloudmart-dev'
        ECR_REGISTRY   = '352329340838.dkr.ecr.ap-southeast-2.amazonaws.com'
        S3_BUCKET      = 'cloudmart-cicd-artifacts-352329340838-ap-southeast-2'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm

                script {
                    env.GIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()

                    env.GIT_COMMIT = sh(
                        script: 'git rev-parse HEAD',
                        returnStdout: true
                    ).trim()

                    echo "Building commit: ${env.GIT_SHORT}"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('app') {
                    sh 'npm ci'
                }
            }
        }

        stage('Code Validation') {
            steps {
                dir('app') {
                    sh '''
                        set -eu
                        node --check server.js
                        node --check public/app.js
                    '''
                }
            }
        }

        stage('Unit Tests') {
            steps {
                dir('app') {
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    set -eu

                    docker build \
                      -t "cloudmart:${BUILD_NUMBER}-${GIT_SHORT}" \
                      -t "cloudmart:${BUILD_NUMBER}" \
                      ./app
                '''
            }
        }

        stage('Verify Docker Image') {
            steps {
                sh '''
                    set -eu
                    docker image inspect \
                      "cloudmart:${BUILD_NUMBER}-${GIT_SHORT}"
                '''
            }
        }
        stage('Container Smoke Test') {
            steps {
                sh '''
                    set -eu

                    CONTAINER_NAME="cloudmart-smoke-${BUILD_NUMBER}"
                    IMAGE="cloudmart:${BUILD_NUMBER}-${GIT_SHORT}"

                    cleanup() {
                        docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
                    }

                    trap cleanup EXIT

                    docker run -d \
                      --name "$CONTAINER_NAME" \
                      -p 127.0.0.1:3001:3000 \
                      "$IMAGE"

                    attempt=0
                    until curl -fsS http://127.0.0.1:3001/api/health; do
                        attempt=$((attempt + 1))
                        if [ "$attempt" -ge 15 ]; then
                            echo "Health check failed."
                            docker logs "$CONTAINER_NAME"
                            exit 1
                        fi
                        sleep 2
                    done

                    curl -fsS http://127.0.0.1:3001/api/ready
                    curl -fsS http://127.0.0.1:3001/api/products

                    echo "Container smoke tests passed."
                '''
            }
        }

        stage('Verify AWS Identity') {
            steps {
                sh '''
                    set -eu
                    aws sts get-caller-identity \
                      --region "$AWS_REGION"
                '''
            }
        }

        stage('Push Image to ECR') {
            steps {
                sh '''
                    set -eu

                    aws ecr get-login-password \
                      --region "$AWS_REGION" |
                    docker login \
                      --username AWS \
                      --password-stdin "$ECR_REGISTRY"

                    docker tag \
                      "cloudmart:${BUILD_NUMBER}-${GIT_SHORT}" \
                      "${ECR_REGISTRY}/${ECR_REPOSITORY}:${BUILD_NUMBER}-${GIT_SHORT}"

                    docker tag \
                      "cloudmart:${BUILD_NUMBER}" \
                      "${ECR_REGISTRY}/${ECR_REPOSITORY}:${BUILD_NUMBER}"

                    docker push \
                      "${ECR_REGISTRY}/${ECR_REPOSITORY}:${BUILD_NUMBER}-${GIT_SHORT}"

                    docker push \
                      "${ECR_REGISTRY}/${ECR_REPOSITORY}:${BUILD_NUMBER}"
                '''
            }
        }

        stage('Archive Build Metadata to S3') {
            steps {
                sh '''
                    set -eu

                    mkdir -p build-output

                    node -e '
                    const fs = require("fs");

                    const metadata = {
                      project: "CloudMart-CICD",
                      buildNumber: process.env.BUILD_NUMBER,
                      gitCommit: process.env.GIT_COMMIT,
                      gitShort: process.env.GIT_SHORT,
                      image: `${process.env.ECR_REGISTRY}/${process.env.ECR_REPOSITORY}:${process.env.BUILD_NUMBER}-${process.env.GIT_SHORT}`,
                      region: process.env.AWS_REGION,
                      status: "SUCCESS"
                    };

                    fs.writeFileSync(
                      "build-output/build-metadata.json",
                      JSON.stringify(metadata, null, 2) + "\\n"
                    );
                    '

                    echo "Build metadata:"
                    cat build-output/build-metadata.json

                    echo "Uploading metadata to S3..."

                    aws s3 cp \
                      build-output/build-metadata.json \
                      "s3://${S3_BUCKET}/builds/${BUILD_NUMBER}/build-metadata.json" \
                      --region "$AWS_REGION"

                    echo "S3 metadata upload completed."
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout "$ECR_REGISTRY" || true'

            archiveArtifacts(
                artifacts: 'build-output/*.json',
                allowEmptyArchive: true
            )

            deleteDir()
        }
    }
}
