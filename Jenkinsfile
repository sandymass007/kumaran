pipeline {
    agent any

    environment {
        DOCKER_USER = 'sandymass007'
        EC2_IP = '3.110.101.212'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/sandymass007/kumaran.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t kumaran:latest .'
                sh 'docker tag kumaran:latest sandymass007/kumaran:latest'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-pass', usernameVariable: 'DUSER', passwordVariable: 'DPASS')]) {
                    sh '''
                        echo "$DPASS" | docker login -u "$DUSER" --password-stdin
                        docker push sandymass007/kumaran:latest
                    '''
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                sshagent(['ubuntu']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@3.110.101.212 "
                            docker pull sandymass007/kumaran:latest &&
                            docker stop kumaran-app || true &&
                            docker rm kumaran-app || true &&
                            docker run -d -p 80:3000 --name kumaran-app sandymass007/kumaran:latest
                        "
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f'
        }
    }
}
