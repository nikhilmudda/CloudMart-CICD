
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        AWS_REGION = 'ap-southeast-2'
        ECR_REPOSITORY = 'cloudmart-dev'
        ECR_REGISTRY = '352329340838.dkr.ecr.ap-southeast-2.amazonaws.com'
        S3_BUCKET = 'cloudmart-cicd-artifacts-352329340838-ap-southeast-2'
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
                    sh 'node --check server.js'
                    sh 'node --check public/app.js'
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
                    docker build \
                      -t cloudmart:${BUILD_NUMBER}-${GIT_SHORT} \
                      -t cloudmart:${BUILD_NUMBER} \
                      app
                '''
            }
        }

        stage('Verify Docker Image') {
            steps {
                sh 'docker image inspect cloudmart:${BUILD_NUMBER}-${GIT_SHORT}'
            }
        }

        stage('Verify AWS Identity') {
            steps {
                sh 'aws sts get-caller-identity'
            }
        }

        stage('Push Image to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region "$AWS_REGION" |
                      docker login --username AWS --password-stdin "$ECR_REGISTRY"

                    docker tag \
                      cloudmart:${BUILD_NUMBER}-${GIT_SHORT} \
                      "$ECR_REGISTRY/$ECR_REPOSITORY:${BUILD_NUMBER}-${GIT_SHORT}"

                    docker push \
                      "$ECR_REGISTRY/$ECR_REPOSITORY:${BUILD_NUMBER}-${GIT_SHORT}"
                '''
            }
        }


        stage('Archive Build Metadata to S3') {
            steps {
                sh '''
                    set -eu
                    mkdir -p build-output

                    cat > build-output/build-metadata.json <<EOF
{
  "project": "CloudMart-CICD",
  "buildNumber": "${BUILD_NUMBER}",
  "gitCommit": "${GIT_COMMIT}",
  "gitShort": "${GIT_SHORT}",
  "image": "${ECR_REGISTRY}/${ECR_REPOSITORY}:${BUILD_NUMBER}-${GIT_SHORT}",
  "region": "${AWS_REGION}",
  "status": "SUCCESS"
}
EOF

                    cat build-output/build-metadata.json

                    aws s3 cp build-output/build-metadata.json \
                      "s3://${S3_BUCKET}/builds/${BUILD_NUMBER}/build-metadata.json" \
                      --region "$AWS_REGION"
                '''
            }
        }
}
