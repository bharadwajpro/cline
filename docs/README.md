# Cline Documentation

Welcome to the Cline documentation! This documentation provides a comprehensive guide to understanding and working with Cline, an AI-powered coding assistant that integrates seamlessly with VS Code.

## Table of Contents

### 1. Architecture
- [Overview](architecture/OVERVIEW.md) - Core architecture and system design
- [Core Classes](architecture/CORE_CLASSES.md) - Detailed explanation of Cline and ClineProvider classes
- [Providers](architecture/PROVIDERS.md) - AI provider integration and API handling
- [WebUI](architecture/WEBUI.md) - Web interface implementation and features

### 2. Getting Started
- [New Coders Guide](getting-started-new-coders/README.md) - Guide for developers new to coding
- [Installing Dev Essentials](getting-started-new-coders/installing-dev-essentials.md) - Setting up development tools

### 3. Features
- [Tools Guide](tools/cline-tools-guide.md) - Available tools and their usage
- [MCP (Model Context Protocol)](mcp/README.md) - Extending Cline with custom tools
- [Customization](cline-customization/clineignore.md) - Customizing Cline behavior

### 4. Development
- [Contributing](../CONTRIBUTING.md) - Guide for contributing to Cline
- [Code of Conduct](../CODE_OF_CONDUCT.md) - Community guidelines
- [Feature Development](feature-development/README.md) - Guide for developing new features
- [Adding a Provider](feature-development/ADD_PROVIDER.md) - Step-by-step guide for adding new AI providers

## Core Concepts

### 1. Extension Architecture

Cline is built as a VS Code extension with three main components:
- Core Extension (TypeScript)
- WebUI (React)
- Provider System (AI Integration)

### 2. Key Features

1. **AI-Powered Assistance**
   - Code generation and editing
   - Project analysis and understanding
   - Natural language interaction
   - Image-based development

2. **Tool System**
   - File operations
   - Terminal commands
   - Code search and analysis
   - Browser automation

3. **Security**
   - File access control
   - Command approval system
   - Secure API handling
   - Data privacy

### 3. Provider System

Cline supports multiple AI providers:
- Claude 3.7 Sonnet (Primary)
- OpenRouter Integration
- Custom Provider Support

## Quick Links

- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev)
- [GitHub Repository](https://github.com/cline/cline)
- [Issue Tracker](https://github.com/cline/cline/issues)
- [Feature Requests](https://github.com/cline/cline/discussions/categories/feature-requests)

## Support

- [Discord Community](https://discord.gg/cline)
- [Reddit Community](https://www.reddit.com/r/cline/)
- [Documentation Website](https://docs.cline.bot)

## Contributing

We welcome contributions to Cline! Please see our [Contributing Guide](../CONTRIBUTING.md) for details on:
- Setting up the development environment
- Making code changes
- Submitting pull requests
- Code review process

## License

Cline is licensed under the [LICENSE](../LICENSE) file in the root directory.

## Security

For security concerns, please see our [Security Policy](../SECURITY.md) and report any issues through the appropriate channels.

## Acknowledgments

Cline is made possible by:
- Claude 3.7 Sonnet by Anthropic
- VS Code Extension API
- React and TypeScript
- Open source community

## Version History

For a detailed list of changes and updates, please see our [Changelog](../CHANGELOG.md).
