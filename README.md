# SecureVision - Intelligent Video Analysis Platform

SecureVision is an intelligent web-based platform for analyzing user-uploaded videos and automatically detecting suspicious objects such as weapons, drugs, or dead bodies. It is built with a modern microservices architecture and powered by deep learning (YOLO) models.

## 🔍 Features

- 🎥 Upload and analyze videos via an intuitive web UI
- ⚡ Real-time WebSocket updates on video processing
- 🧠 YOLO-based object detection for:
  - Guns
  - Knives
  - Other suspicious entities
- 📊 Downloadable JSON reports
- 🛡️ Admin dashboard with role-based access (RBAC)
- 🗂️ Full video archive and activity history
- 🔐 JWT authentication and audit logs

## 🖥️ Demo

👉 [Watch Demo Video](https://www.youtube.com/watch?v=-EVKurO7zvg)

## 🚀 Tech Stack

**Frontend:**

- React + Vite
- Tailwind CSS
- TypeScript
- Framer Motion & Lucide Icons

**Backend:**

- Node.js (NestJS or Express)
- PostgreSQL
- RabbitMQ
- JWT Auth
- WebSocket server

**AI/ML:**

- YOLOv11 (custom-trained)
- Python-based detection microservice
