# GoogleCall API

This is the backend API service for the GoogleCall application, built using a monorepo structure with multiple packages.

## Project Structure

The project is organized as a monorepo with the following packages:

- `packages/web`: Web server and API endpoints
- `packages/app`: Core application logic
- `packages/db`: Database interactions and models
- `packages/utils`: Shared utilities and helpers

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (v7 or higher for workspaces support)

## Installation

```bash
# Install dependencies for all packages
npm install
```

## Development

To run the development server with all packages:

```bash
npm run dev
```

This will concurrently start all packages in development mode.

## Available Scripts

- `npm start`: Start the production server
- `npm run build`: Build all packages
- `npm run dev`: Start development servers for all packages
- `npm test`: Run tests (when implemented)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Add your environment variables here
```

## Technology Stack

- TypeScript
- Node.js
- ESLint & Prettier for code formatting
- Workspaces for monorepo management
- Express.js

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

ISC
