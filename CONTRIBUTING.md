# Contributing to ForgeFlow

Thank you for your interest in contributing to **ForgeFlow**!

## Code of Conduct
Please maintain a respectful, constructive, and inclusive environment.

## Development Workflow
1. Fork and clone the repository.
2. Create a branch: `git checkout -b feature/your-feature-name`.
3. Set up the local development environment:
   ```bash
   python scripts/seed_demo_data.py
   npm install
   ```
4. Run automated tests before committing:
   ```bash
   # Backend tests
   python -m pytest backend/tests -v

   # Frontend tests
   npm test

   # Type checking and build
   npm run build
   ```
5. Submit a pull request with clear description and test coverage.
