A simple and responsive trip-booking web application built using Node.js + Express + EJS, fully automated using Docker, Jenkins CI/CD, and AWS EC2 Deployment.

This project demonstrates modern DevOps practices, including containerization, CI/CD pipeline automation, cloud deployment, and reverse proxy configuration.

tech Stack
Frontend & Backend

Node.js

Express.js

EJS Templates

HTML/CSS

DevOps & Cloud

Docker

Docker Hub

Jenkins Pipeline

AWS EC2 (Ubuntu 22.04)

Nginx Reverse Proxy

Git & GitHub

 Local Setup Instructions
1. Clone the repository
git clone https://github.com/sandymass007/kumaran.git
cd kumaran

2. Install Node.js dependencies
npm install

3. Run the app locally
npm start


App runs at:
👉p://localhost:3000

🐳 docker Setup (Local)
Build Docker Image
docker build -t kumaran:latest .

Run Docker Container
docker run -d -p 3000:3000 kumaran:latest

☁️ EC2 Deployment Instructions
1. Install Docker
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable docker

2. Pull & Run Docker Image
docker pull sandymass007/kumaran:latest
docker run -d --name kumaran --restart always -p 3000:3000 sandymass007/kumaran:latest

3. Install & Configure Nginx
sudo apt install nginx -y


Edit config:

sudo nano /etc/nginx/sites-enabled/default


Paste:

server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}


Test:

sudo nginx -t


Restart:

sudo systemctl restart nginx
CI/CD Pipeline – Brief Explanation
This Jenkins pipeline automates the full process of pulling code from GitHub, building a Docker image, pushing it to Docker Hub, and deploying the updated container to an EC2 instance.

Agent Section
The line "agent any" tells Jenkins to run the pipeline on any available Jenkins node.

Environment Section
Environment variables are defined:
DOCKER_USER = your Docker Hub username (sandymass007)
EC2_IP = the public IP address of your EC2 server (3.110.101.212)

These values can be reused inside the pipeline.

Stage: Checkout Code
Jenkins downloads the latest source code from your GitHub repository:
https://github.com/sandymass007/kumaran.git

It always uses the main branch.

Stage: Build Docker Image
This part builds the Docker image based on your Dockerfile.
Command used:
docker build -t kumaran:latest .
Then the image is tagged so that it can be pushed to Docker Hub:
docker tag kumaran:latest sandymass007/kumaran:latest

Stage: Push to Docker Hub
Jenkins logs into Docker Hub using stored credentials (dockerhub-pass).
Then it pushes the image:
docker push sandymass007/kumaran:latest
Your new application image is now publicly available.

Stage: Deploy on EC2
Jenkins connects to the EC2 server using SSH (credentials id: ubuntu).
Once connected, it runs the following commands on the EC2 instance:

Pull the new image from Docker Hub

Stop old container if running

Remove old container

Start a new container on port 80

Commands executed on EC2:
docker pull sandymass007/kumaran:latest
docker stop kumaran-app || true
docker rm kumaran-app || true
docker run -d -p 80:3000 --name kumaran-app sandymass007/kumaran:latest

This makes the latest version of your project live on the EC2 instance.

Post Section
After the pipeline finishes, Jenkins cleans unused Docker images:
docker image prune -f

This keeps Jenkins clean and avoids storage issues.

Summary:
Checkout Code: pulls latest GitHub code
Build Docker Image: builds app container
Push to Docker Hub: uploads container for deployment
Deploy on EC2: runs updated app on EC2
Cleanup: removes unused images

This completes the CI/CD process for your Kumaran Holidays project.
