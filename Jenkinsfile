pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        AWS_REGION      = 'ap-southeast-2'
        ECR_REPOSITORY  = 'cloudmart-dev'
        ARTIFACT_BUCKET = 'cloudmart-cicd-artifacts-352329340838-ap-southeast-2'
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

                    env.IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_SHORT}"
                }
            }
        }

        stage('Validate Application') {
            steps {
                dir('app') {
                    sh '''
                        set -eu
                        echo "Installing locked dependencies..."
                        npm ci

                        echo "Checking Node.js syntax..."
                        node --check server.js
                        node --check public/app.js

                        echo "Application validation passed."
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    set -eu
                    docker build \
                        -t cloudmart:${IMAGE_TAG} \
                        -t cloudmart:latest \
                        app/
                '''
            }
        }

        stage('Verify AWS Identity') {
            steps {
                sh '''
                    set -eu
                    aws sts get-caller-identity
                '''
            }
        }

        stage('Push Image to ECR') {
            steps {
                sh '''
                    set -eu

                    AWS_ACCOUNT_ID=$(aws sts get-caller-identity \
                        --query Account --output text)

                    ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                    ECR_URI="${ECR_REGISTRY}/${ECR_REPOSITORY}"

                    aws ecr get-login-password \
                        --region "${AWS_REGION}" \
                    | docker login \
                        --username AWS \
                        --password-stdin "${ECR_REGISTRY}"

                    docker tag "cloudmart:${IMAGE_TAG}" "${ECR_URI}:${IMAGE_TAG}"
                    docker tag "cloudmart:${IMAGE_TAG}" "${ECR_URI}:latest"

                    docker push "${ECR_URI}:${IMAGE_TAG}"
                    docker push "${ECR_URI}:latest"

                    echo "Pushed ${ECR_URI}:${IMAGE_TAG}"
                '''
            }
        }

        stage('Archive Build Metadata to S3') {
            steps {
                sh '''
                    set -eu

                    AWS_ACCOUNT_ID=$(aws sts get-caller-identity \
                        --query Account --output text)

                    ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"

                    printf '{\\n  "project": "CloudMart-CICD",\\n  "build_number": "%s",\\n  "git_commit": "%s",\\n  "image": "%s:%s",\\n  "region": "%s"\\n}\\n' \
                        "${BUILD_NUMBER}" \
                        "${GIT_SHORT}" \
                        "${ECR_URI}" \
                        "${IMAGE_TAG}" \
                        "${AWS_REGION}" > build-metadata.json

                    aws s3 cp build-metadata.json \
                        "s3://${ARTIFACT_BUCKET}/builds/${BUILD_NUMBER}/build-metadata.json" \
                        --region "${AWS_REGION}"
                '''
            }
        }
    }

    post {
        success {
            echo 'CloudMart CI pipeline completed successfully.'
        }

        failure {
            echo 'CloudMart CI pipeline failed. Review the stage logs.'
        }

        always {
            echo "Build ${BUILD_NUMBER} finished with status: ${currentBuild.currentResult}"
        }
    }
}
