# 🩻 BAGA.Net – Lung X-ray Diagnosis System

**Thesis Project**  
🎓 *Bachelor of Science in Computer Engineering – Batangas State University, 2025*  
📖 *Title: "Empowering Lung X-ray Evaluation and Diagnosis Through Federated Machine Learning"*

A full-stack web application for managing lung X-ray cases, integrating federated machine learning to support privacy-preserving diagnosis workflows between medical professionals.

---

## 🧑‍💻 Project Role

- I primarily led the development of the full-stack web system.  
- Focused on building the core frontend and backend features.  
- Applied JWT-based authentication for secure access control.  
- While improvements are still needed in responsiveness and security, the system supports collaborative clinical workflows and ML integration.

---

## 🔧 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Authentication**: JSON Web Tokens (JWT)  
- **Machine Learning**: Federated ML using FedML, YOLOv11, MobileNetV3, VGG16  
- **Deployment**: Vercel, AWS S3

---

## 🚀 Key Features

- 🩺 Upload and store X-ray images  
- 👥 Role-based access for Radtechs and Doctors  
- 📤 Assign and evaluate medical cases  
- 📝 Submit and view diagnostic results  
- 🔐 Secure login and protected routes with JWT  
- 🌐 Federated training for privacy-preserving ML

---

## 🧠 Research Highlights

- ⚠️ Visual similarities in lung diseases make diagnosis difficult  
- 🔒 Data privacy regulations prevent central data sharing  
- 🧠 Combined CNN models (YOLOv11, MobileNetV3, VGG16)  
- 🧼 Used image preprocessing (Middle Crop, CLAHE, GFB Filter)  
- 🌐 Implemented Federated Learning with 3 client nodes  
- 📊 **YOLOv11** achieved best accuracy in federated setting

---

## 🗂 Folder Structure

```
BAGA.Net/
├── client/         # React frontend
├── server/         # Express backend + FedML logic
├── public/         # Static files
├── .env            # Environment config
└── README.md
```

---

## 🛠️ Local Setup

### Requirements

- Node.js  
- npm  
- MongoDB

### Installation

```bash
git clone https://github.com/rasberriali/BAGA.Net.git
cd BAGA.Net
npm install
```

### Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Run the App

```bash
npm run dev
```

---

## 👩‍💻 Developer

**Alysa Juliana M. Emilio**  
🧩 *Primary developer of the BAGA.Net full-stack web system*  
📧 [alysaemilio@gmail.com](mailto:alysaemilio@gmail.com)  
🌐 [alysaemilio-com.vercel.app](https://alysaemilio-com.vercel.app)
