# Deployment Instructions

<img width="1917" height="1031" alt="Screenshot 2026-02-15 202616" src="https://github.com/user-attachments/assets/b6e878a6-b102-4f1f-830a-e330d87f32fd" />

⚠️ Before deploying, make sure to update the "MY_IP" to "Your_IP" address in the following files:

1. `.env`  
2. `frontend/src/App.jsx`

---

### Deployment

```bash
apt update -y
apt install docker.io -y
apt install docker-compose -y
sudo systemctl enable docker
sudo systemctl start docker
sudo systemctl status docker
sudo usermod -aG docker $USER/ubuntu
newgrp docker
git clone <repo-url>
./deploy.sh
```
###### Use this only when deploying the application for the first time.

### Only use these steps if you make changes to the application or want to redeploy.:
```bash
docker-compose down -v
docker system prune -af
./deploy.sh
```
###### This ensures all old containers, volumes, and unused Docker resources are cleaned before redeploying.
