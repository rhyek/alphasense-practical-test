# Description

Small home assigment I did over a weekend for a Finnish company with the purpose of demonstrating Node.js experience.

# Tech features

- Node.js
- TypeScript
- WebSockets
- Hexagonal Architecture, Clean Architecture, Dependency Injection, Repository Pattern
- Domain Events (not a production-ready implementation)
- In-Memory storage
- Monorepo, shared code between Frontend and Backend
- Functioning and simple React application as interface to the actual game

## Notes

- The project was not bootstrapped using any scaffolding tools (except for Create React App for the React app)
- The game is fully functional for multiple users per the assigment spec
- A PDF of the assignment is included in this repo
- 100% of requirements were implemented
- One of the requirements was to not use something like NestJS which I would normally use if allowed

# Setup

- have node
- install pnpm
- ```bash
  pnpm clean
  pnpm install
  pnpm dev
  ```
- go to `http://localhost:3000`
