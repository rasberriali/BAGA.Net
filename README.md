🩻 BAGA.Net
Thesis Project
🎓 Bachelor of Science in Computer Engineering – Batangas State University, 2025
Title: "Empowering Lung X-ray Evaluation and Diagnosis Through Federated Machine Learning"

📌 Project Overview
BAGA.Net is a full-stack web-based medical case management system developed for our undergraduate thesis. It supports secure X-ray image handling, role-based workflows for healthcare professionals, and integrates Federated Machine Learning to protect patient data privacy.

🔧 I primarily led the development of the full-stack web application, focusing on building a secure, and efficient system that interfaces with our machine learning model and supports collaborative clinical workflows.

🧠 Research Highlights
Diagnosing lung disease via chest X-rays is complex due to:

⚠️ Similar visual patterns across conditions

🔒 Restrictions around centralized patient data

To address these, our system:

Combines CNN architectures (YOLOv11, MobileNetV3, VGG16)

Applies federated learning across 3 decentralized clients

Utilizes image preprocessing techniques (Middle Crop, CLAHE, GFB Filter)

📊 Results:

YOLOv11 had the highest performance in a federated setting

MobileNetV3 showed improved accuracy post-aggregation

Federated learning enhanced model performance while ensuring data privacy

🛠 Tech Stack
Layer	Tools & Frameworks
🖼 Frontend	React (Vite), TailwindCSS
⚙️ Backend	Node.js, Express.js
🧠 ML Component	FedML, CNN models
🗃 Database	MongoDB
🔐 Authentication	JWT
☁️ Deployment	Vercel, AWS S3

✨ System Features
🩺 X-ray image upload and storage

👩‍⚕️ Role-based access for Radtechs and Doctors

📤 Case assignment and review workflow

📝 Diagnostic result submission and tracking

🔐 Secure authentication and authorization

🌐 Federated ML integration for decentralized model training

🚀 Getting Started
✅ Requirements
Node.js

npm

MongoDB

📦 Setup
bash
Copy
Edit
git clone https://github.com/rasberriali/BAGA.Net.git
cd BAGA.Net
npm install
🔧 Environment Variables
Create a .env file with:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
▶️ Run the Application
bash
Copy
Edit
npm run dev
🗂 Folder Structure
bash
Copy
Edit
BAGA.Net/
├── client/         # React frontend
├── server/         # Express backend + FedML logic
├── public/         # Static files
├── .env
└── README.md
🔮 Future Plans
🧾 Full case history and audit trail

📈 Admin dashboard for analytics

📬 Email alert system

🐳 Dockerized deployment with CI/CD

🔍 Improved ML explainability and performance

👩‍💻 Developer Role
Alysa Juliana M. Emilio
🧩 Primary developer of the BAGA.Net full-stack web system
📧 alysaemilio@gmail.com
🌐 alysaemilio-com.vercel.app
