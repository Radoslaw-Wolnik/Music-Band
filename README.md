# Music band website 
A comprehensive website for managing a music band's online presence, including event management, ticket sales, and merchandise.

## Features

- User authentication and authorization with different roles (Manager, Band Member, Patron, Fan)
- Event creation and management
- Venue management
- Ticket purchasing system
- Merchandise store
- Band member profiles and practice scheduling
- Exclusive content for patrons
- Responsive design using Tailwind CSS

## Tech Stack

- Framework: Next.js 14 with TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Authentication: NextAuth.js
- Styling: Tailwind CSS
- Logging: Winston
- Containerization: Docker

## Prerequisites

- Node.js (v14 or later)
- Docker and Docker Compose
- PostgreSQL (if running without Docker)

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/music-band-website.git
cd music-band-website
```
2. Install dependencies:
```
npm install
```
3. Set up environment variables:
Create a `.env` file in the root directory and add the following variables:
```
DATABASE_URL=postgresql://user:password@localhost:5432/music_band_db
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```
4. Run database migrations:
```
npx prisma migrate dev
```
5. Start the development server:
```
npm run dev
```

## Running with Docker

1. Build and start the containers:
```
docker-compose up -d --build
```
2. Run database migrations:
```
docker-compose exec web npx prisma migrate dev
```
The application should now be running at `http://localhost:3000`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.