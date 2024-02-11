# Health and Safety SaaS Solution for PwC

## Introduction

This project is a comprehensive Health and Safety SaaS solution, developed specifically for PricewaterhouseCoopers (PwC). It aims to streamline health and safety incident management within organizations, leveraging advanced cloud technologies for data categorization and analysis to improve workplace safety.

## Tech Stack

- **Frontend:** JavaScript, React, Vite
- **Backend:** Java / Spring Boot
- **Database:** Firestore
- **Authentication:** Firebase Authentication
- **AI & Machine Learning:** Vertex AI
- **Deployment:** Cloud Run

## Getting Started

### Prerequisites

- Google Cloud Platform account
- Docker and Docker Compose
- Node.js or Java SDK

### Setup Instructions

1. **Clone the Repository**

```bash
git clone https://github.com/CPSC319-2023/Team-2-PWC-Team-ADC.git
cd Team-2-PWC-
```

2(a). **Local Development**

For local development, access the backend services locally for faster development cycles:

```bash
# Frontend
cd frontend && npm install && npm start

# Backend
cd backend && mvn install && mvn spring-boot:run
```

2(b). **Running with Docker**

```bash
docker-compose up -d --build
```

## Deployment
Deploy your services to Cloud Run following GCP documentation for staging/production.

## Contributing
Contributions are welcome! To contribute:

1. Fork the repository.
2. Create your feature branch (git checkout -b feature/YourFeature).
3. Commit your changes (git commit -am 'Add some YourFeature').
4. Push to the branch (git push origin feature/YourFeature).
5. Open a Pull Request.

## Team Members
- Lance Tan
- Manushree Singhania
- Ryota Koda
- Shivam Aggarwal
- Sidaarth Santhosh
- Weichong Zhao

## Support
For support, please open an issue in the repository or contact the project maintainers directly.

## License
This project is licensed under the BSD-2-Clause license - see the LICENSE file for details.