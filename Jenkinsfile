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

                      "${ECR_REGISTRY}/${ECR_REPOSITORY}:${BUILD_NUMBER}-${GIT_SHORT}"


                    docker push \
                      "${ECR_REGISTRY}/${ECR_REPOSITORY}:${BUILD_NUMBER}"
                      "cloudmart:${BUILD_NUMBER}-${GIT_SHORT}" \
                      "${ECR_REGISTRY}/${ECR_REPOSITORY}:${BUILD_NUMBER}-${GIT_SHORT}"

                    docker tag \
                    const metadata = {
                      project: "CloudMart-CICD",
                      "cloudmart:${BUILD_NUMBER}" \

                    docker tag \
                      buildNumber: process.env.BUILD_NUMBER,

pipeline {
    agent any

                      gitCommit: process.env.GIT_COMMIT,
                      gitShort: process.env.GIT_SHORT,
                      image: `${process.env.ECR_REGISTRY}/${process.env.ECR_REPOSITORY}:${process.env.BUILD_NUMBER}-${process.env.GIT_SHORT}`,
    options {
                    docker login \
                      --username AWS \
                      --password-stdin "$ECR_REGISTRY"
                      region: process.env.AWS_REGION,
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
                      status: "SUCCESS"
        AWS_REGION    = 'ap-southeast-2'
        ECR_REPOSITORY = 'cloudmart-dev'
                    set -eu

                    aws ecr get-login-password \
                    };

                      --region "$AWS_REGION" |
        ECR_REGISTRY   = '352329340838.dkr.ecr.ap-southeast-2.amazonaws.com'
        S3_BUCKET      = 'cloudmart-cicd-artifacts-352329340838-ap-southeast-2'
    }

    stages {
        stage('Checkout') {
                    fs.writeFileSync(
                      "build-output/build-metadata.json",
                      JSON.stringify(metadata, null, 2) + "\\n"
            steps {
            steps {
                sh '''
                checkout scm

        stage('Push Image to ECR') {

                script {
                    env.GIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                    );
                    '
                        returnStdout: true
                    ).trim()

                    env.GIT_COMMIT = sh(
                        script: 'git rev-parse HEAD',
                '''
            }

        }
                        returnStdout: true
                      --region "$AWS_REGION"
                    ).trim()

                    cat build-output/build-metadata.json

                    aws s3 cp \
                    echo "Commit: ${env.GIT_COMMIT}"
                    echo "Short commit: ${env.GIT_SHORT}"
                }
            }
        }

            steps {
                      build-output/build-metadata.json \
                      "s3://${S3_BUCKET}/builds/${BUILD_NUMBER}/build-metadata.json" \
                      --region "$AWS_REGION"
                sh '''
                    set -eu
                    aws sts get-caller-identity \
        stage('Install Dependencies') {
                '''
                '''
            }
        }

            }
        }
    }

    post {
        stage('Verify AWS Identity') {
                    docker image inspect \
                      "cloudmart:${BUILD_NUMBER}-${GIT_SHORT}"
            steps {
                dir('app') {
                    sh 'npm ci'
                sh '''
                    set -eu
                }
            }
        stage('Verify Docker Image') {
            steps {
        }
        always {
            sh '''

        }

        stage('Code Validation') {
                '''
            }
            steps {
                dir('app') {
                    sh '''
                      -t "cloudmart:${BUILD_NUMBER}" \
                      ./app
                        set -eu
                        node --check server.js
                    docker build \
                      -t "cloudmart:${BUILD_NUMBER}-${GIT_SHORT}" \
        }
                docker logout "$ECR_REGISTRY" || true
            '''
                sh '''
                    set -eu


        stage('Build Docker Image') {
            steps {
                    sh 'npm test'
                }
            }
                        node --check public/app.js
                    '''

            archiveArtifacts(
                artifacts: 'build-output/*.json',
                }
                dir('app') {
            }

        stage('Unit Tests') {
            steps {

                allowEmptyArchive: true
            )

            deleteDir()

        }
    }
}
