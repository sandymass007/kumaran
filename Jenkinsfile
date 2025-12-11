pipeline {
    agent any

    environment {
        DOCKER_USER = "sandymass007"
        IMAGE_NAME = "kumaran"
        APP_HOST = "13.203.156.165"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t ${IMAGE_NAME}:latest .
                docker tag ${IMAGE_NAME}:latest ${DOCKER_USER}/${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DUSER', passwordVariable: 'DPASS')]) {
                    sh '''
                    echo "$DPASS" | docker login -u "$DUSER" --password-stdin
                    docker push ${DOCKER_USER}/${IMAGE_NAME}:latest
                    '''
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                sshagent(['app-ec2-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@${APP_HOST} '
                        docker pull ${DOCKER_USER}/${IMAGE_NAME}:latest &&
                        docker stop kumaran-app || true &&
                        docker rm kumaran-app || true &&
                        docker run -d -p 80:3000 --name kumaran-app ${DOCKER_USER}/${IMAGE_NAME}:latest
                    '
                    """
                }
            }
        }
    }

    post {
        always {
            sh "docker image prune -f || true"
        }
    }
}
