# Chores Web

A household chore management app with flexible scheduling, point tracking, and multi-user support. Perfect for families, roommates, or any group managing shared responsibilities.

## What is Chores Web?

Chores Web is a modern web application designed to help households and groups organize, assign, and track chores. It supports multiple users, flexible scheduling (weekly, monthly, or interval-based), and a points-based reward system to motivate completion. Whether you're managing family chores or coordinating with roommates, Chores Web makes it easy.

**Ideal for:**
- Families with multiple household members
- Roommate groups sharing responsibilities
- Shared living spaces needing fair task distribution
- Teams wanting to track recurring tasks

## Tech Stack

### Frontend
- **React 18** – Modern UI framework
- **React Query (TanStack Query)** – Server state management and caching
- **Vite** – Lightning-fast build tool
- **Vitest + React Testing Library** – Testing framework

### Backend
- **FastAPI** – High-performance Python web framework
- **SQLAlchemy ORM** – Database abstraction layer
- **PostgreSQL** – Reliable relational database
- **APScheduler** – Background task scheduling
- **Pydantic** – Data validation and serialization

### DevOps
- **Docker & Docker Compose** – Containerization and orchestration
- **Nginx** – Reverse proxy and static file serving

## Features

- **Flexible Chore Scheduling** – Create chores with weekly, monthly, or interval-based schedules
- **Multiple Assignment Types** – Open (anyone can take), rotating (cycles through people), or fixed (specific person)
- **Point System** – Award points for completed chores and track progress toward goals
- **Multi-User Support** – Admin and regular user roles with permission-based access
- **Automatic Schedule Transitions** – Background scheduler automatically marks chores as due
- **Complete Audit Log** – Track all chore actions (who completed, when, why)
- **Custom Themes** – User-specific theme preferences (dark/light modes)
- **Data Export/Import** – Backup and restore your configuration
- **Mobile-Friendly UI** – Responsive design works on phones, tablets, and desktops

## Quick Start

Get Chores Web running locally in 5 minutes.

### Prerequisites
- Docker and Docker Compose installed
- Git

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/derekwinters/chores-web.git
   cd chores-web
   ```

2. **Start the application:**
   ```bash
   docker compose up -d
   ```

3. **Open in browser:**
   - **App:** http://localhost:3000
   - **API Docs:** http://localhost:8000/docs

4. **Create first user:**
   - App will prompt for first-time setup
   - Create an admin user with your credentials
   - Login and start creating chores

### Development Setup

For local development without Docker:

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173 for the frontend and http://localhost:8000/docs for API docs.

## Documentation

Full documentation is available in the [docs/](./docs/) directory:

- **[User Guide](./docs/USER_GUIDE.md)** – How to use the app (for end users)
- **[Architecture](./docs/ARCHITECTURE.md)** – System design and data flow
- **[API Reference](./docs/api/index.md)** – REST API endpoints and schemas
- **[Developer Guide](./docs/DEVELOPER.md)** – Development setup and workflow
- **[Deployment](./docs/DEPLOYMENT.md)** – Production deployment and operations

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Make your changes and test thoroughly
4. Commit with clear messages (`git commit -m "feat: describe your change"`)
5. Push to your fork and open a pull request

See [Architecture](./docs/ARCHITECTURE.md) for code organization and patterns.

## License

This project is licensed under the MIT License – see the LICENSE file for details.

## Support

- Review the [User Guide](./docs/USER_GUIDE.md) for common questions
- Check [Deployment](./docs/DEPLOYMENT.md) for operational issues
- Open an issue on GitHub for bugs or feature requests

## Project Status

Active development. Feedback and contributions welcome!
