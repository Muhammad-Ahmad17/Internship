# 🚀 ECS Fargate Deployment for Node.js (Learning + Minimal Cost)

---

## **Step 1: Containerize your Node.js App**

* Create a `Dockerfile` in your Node.js app:

```dockerfile
# Step 1: Use Node base image
FROM node:18-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and install deps
COPY package*.json ./
RUN npm install --only=production

# Step 4: Copy source code
COPY . .

# Step 5: Expose port
EXPOSE 3000

# Step 6: Run app
CMD ["node", "server.js"]
```

📌 Replace `server.js` with your app entry point.
📌 Run locally to test:

```bash
docker build -t my-node-app .
docker run -p 3000:3000 my-node-app
```

---

## **Step 2: Push Image to Amazon ECR**

Instead of Docker Hub, use **ECR (Elastic Container Registry)** for ECS.

1. **Create ECR Repo**:

   ```bash
   aws ecr create-repository --repository-name my-node-app
   ```

   This gives you an ECR URL like:

   ```
   <aws_account_id>.dkr.ecr.<region>.amazonaws.com/my-node-app
   ```

2. **Login to ECR**:

   ```bash
   aws ecr get-login-password --region <region> \
   | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
   ```

3. **Tag & Push Image**:

   ```bash
   docker tag my-node-app:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/my-node-app:latest
   docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/my-node-app:latest
   ```

---

## **Step 3: Create ECS Cluster**

Minimal setup:

```bash
aws ecs create-cluster --cluster-name my-learning-cluster
```

---

## **Step 4: Define Task Definition**

A **Task Definition** tells ECS how to run your container.

* Example `task-def.json`:

```json
{
  "family": "my-node-app-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "my-node-app",
      "image": "<aws_account_id>.dkr.ecr.<region>.amazonaws.com/my-node-app:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/my-node-app",
          "awslogs-region": "<region>",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

Register task:

```bash
aws ecs register-task-definition --cli-input-json file://task-def.json
```

---

## **Step 5: Run on Fargate**

Launch a **service**:

```bash
aws ecs create-service \
  --cluster my-learning-cluster \
  --service-name my-node-service \
  --task-definition my-node-app-task \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xyz],securityGroups=[sg-xyz],assignPublicIp=ENABLED}"
```

📌 Replace `subnet-xyz` and `sg-xyz` with your **VPC subnet** and **security group** (allow port 3000 or 80).
📌 `desired-count 1` keeps cost minimal.

---

## **Step 6: View Logs in CloudWatch**

* Go to **CloudWatch → Logs → Log groups → /ecs/my-node-app**
* You’ll see logs from your container.

---

## **Step 7: Clean Up (Save Cost 💸)**

After testing:

```bash
aws ecs update-service --cluster my-learning-cluster --service my-node-service --desired-count 0
aws ecs delete-service --cluster my-learning-cluster --service my-node-service --force
aws ecs delete-cluster --cluster my-learning-cluster
aws ecr delete-repository --repository-name my-node-app --force
```

---

✅ With this flow:

* You **only pay for Fargate task runtime** (seconds-based).
* Logs go to **CloudWatch**.
* Perfect for **learning without long-term costs**.

---