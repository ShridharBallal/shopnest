# Deployment Instructions

⚠️ Before deploying, make sure to update the IP address in the following files:

1. `.env`  
2. `frontend/src/App.jsx`

---

### Deployment

```bash
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

### If you are redeploying or after making changes to the application:
### docker-compose down -v
### docker system prune -af
### ./deploy.sh
