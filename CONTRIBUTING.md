# Contributing to NourishBot AI Coach

First off, thank you for considering contributing to NourishBot AI Coach! It's people like you that make NourishBot such a great tool.

---

## 📑 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [How Can I Contribute?](#how-can-i-contribute)
4. [Styleguides](#styleguides)
5. [Pull Request Process](#pull-request-process)

---

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18.x LTS or newer
- [npm](https://www.npmjs.com/) 9.x or newer
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Local Setup
1. Fork the repository.
2. Clone your fork: `git clone https://github.com/your-username/nourishbot-ai-coach.git`
3. Install dependencies: `npm install`
4. Create a `.env` file: `cp .env.example .env`
5. Add your `GEMINI_API_KEY` to the `.env` file.
6. Start the development server: `npm run dev`

## How Can I Contribute?

### Reporting Bugs
- Use the GitHub Issue Tracker.
- Describe the bug and include steps to reproduce it.
- Mention your environment (OS, Browser version).

### Suggesting Enhancements
- Check the [CHANGELOG.MD](CHANGELOG.MD) "Planned" section to see if it's already on the roadmap.
- Open a new issue with the tag "enhancement".

### Your First Code Contribution
- Look for issues labeled "good first issue".
- Follow the branching strategy: `feature/your-feature-name` or `fix/your-fix-name`.

## Styleguides

### Git Commit Messages
- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
- Limit the first line to 72 characters or less.

### TypeScript / React Styleguide
- Use functional components and hooks.
- Use TypeScript for all new files.
- Follow the project's Prettier and ESLint configurations.
- Run `npm run lint` and `npm run format` before committing.

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the `README.md` and `Walkthrough.MD` with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
3. Update the `CHANGELOG.MD` with a summary of your changes under the `[Unreleased]` section.
4. The PR will be merged once it has the approval of at least one maintainer.

---

## Need Help?

If you have any questions, feel free to open an issue or contact the maintainers.

Happy coding! 🚀
