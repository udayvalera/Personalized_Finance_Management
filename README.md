# Personalized Finance Management System

A comprehensive full-stack application that combines personal finance management with AI-powered recommendations and social features. The system helps users manage their budgets, track expenses, and receive personalized financial advice.

## 🌟 Features

### 💰 Budget Planning
- Interactive budget planner with pie chart visualization
- AI-powered budget recommendations based on user input
- Customizable expense categories and subcategories
- Real-time budget tracking and updates

### 🤖 AI/ML Capabilities
- Smart budget allocation suggestions
- Receipt processing and categorization
- Financial stress score analysis
- Personalized financial recommendations

### 👥 Social Features
- User authentication system
- Crowdfunding capabilities
- Goal tracking and sharing
- Streak maintenance for financial habits

## 🛠 Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Chart.js for data visualization
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB database
- JWT authentication
- Email notification system
- Automated schedulers

### AI/ML Service
- Python
- Machine learning models for budget analysis
- Natural Language Processing for user input processing
- Financial recommendation engine

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/udayvalera/Personalized_Finance_Management.git
   cd Personalized_Finance_Management
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

4. **AI/ML Service Setup**
   ```bash
   cd ai-ml
   pip install -r requirements.txt
   ```
### Environment Variables

In each directory, set the values in `.env.example`, then rename the file to `.env` by removing `.example`.

## 🚀 Running the Application

The application can be started using any of the following scripts:

### Frontend
```bash
cd frontend && npm run dev
```

### Backend
```powershell
cd backend && node app.js
```

### Using Command Prompt (Windows)
```cmd
cd ai-ml && python app.py
```

These scripts will:
1. Create necessary log directories
2. Install dependencies for all components
3. Start the backend server
4. Launch the AI/ML service
5. Start the frontend development server
6. Collect logs in the `logs` directory

## 📁 Project Structure

```
├── frontend/           # React TypeScript frontend
├── backend/            # Node.js Express backend
└── ai-ml/              # Python AI/ML service
```

## 🔧 Configuration

### Frontend
- Environment variables in `frontend/src/.env`
- Vite configuration in `frontend/vite.config.ts`
- TypeScript configuration in `frontend/tsconfig.json`

### Backend
- Database configuration in `backend/config/database.js`
- Environment variables in `backend/.env`
- Route configurations in `backend/routes/`

### AI/ML Service
- Model configurations in `ai-ml/config/settings.py`
- Environment variables in `ai-ml/.env`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Chart.js for data visualization
- TailwindCSS for the UI framework
- MongoDB for database solutions
- Python community for AI/ML tools
