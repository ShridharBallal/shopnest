Deployment Instructions

⚠️ Before deploying, make sure to update the IP address in the following files:

.env

frontend/src/App.jsx

Initial Setup
### apt update -y
### apt install docker.io -y
### apt install docker-compose -y
### sudo systemctl enable docker
### sudo systemctl start docker
### sudo systemctl status docker
### sudo usermod -aG docker $USER/ubuntu
### newgrp docker
### git clone <repo-url>
### ./deploy.sh

Redeploy / Update Application

Only use the following steps when you deploy for the second time, or if you make changes to the application.

### docker-compose down -v
### docker system prune -af
### ./deploy.sh
