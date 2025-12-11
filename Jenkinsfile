pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "sandymass007"
        IMAGE_NAME = "kumaran"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/sandymass007/kumaran.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${IMAGE_NAME}:latest .
                    docker tag ${IMAGE_NAME}:latest ${DOCKERHUB_USER}/${IMAGE_NAME}:latest
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-pass', variable: 'DPASS')]) {
                    sh """
                        echo "$DPASS" | docker login -u ${DOCKERHUB_USER} --password-stdin
                        docker push ${DOCKERHUB_USER}/${IMAGE_NAME}:latest
                    """
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                sshagent(['ubuntu']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@3.110.101.212 "
                            sudo docker pull sandymass007/kumaran:latest &&
                            sudo docker stop kumaran-app || true &&
                            sudo docker rm kumaran-app || true &&
                            sudo docker run -d -p 80:3000 --name kumaran-app sandymass007/kumaran:latest
                        "
                    """
                }
            }
        }
    }

    post {
        always {
            sh "docker image prune -f"
        }
    }
}

