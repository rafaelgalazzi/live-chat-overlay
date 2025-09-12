# Twitch Chat Overlay

A lightweight, customizable overlay application that displays Twitch chat on top of your games or other applications. Perfect for streamers who want to monitor their chat while gaming with just one monitor.

![Project Preview](./public/preview.png)

## Features

- 🎮 **Always-On-Top Overlay**: Keeps Twitch chat visible above your games
- 🖥️ **Electron Desktop App**: Runs independently of your browser
- 🎨 **Customizable Appearance**: Adjust size, position, and transparency
- 🔧 **Easy Setup**: Connect with your Twitch channel in seconds
- ⚡ **Real-time Updates**: Messages appear instantly as they're sent

## Tech Stack

- **[Electron](https://www.electronjs.org/)** - Cross-platform desktop application framework
- **[React](https://reactjs.org/)** - Component-based UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Typed JavaScript for better development experience
- **[Vite](https://vitejs.dev/)** - Fast build tool and development server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework for styling

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/twitch-chat-overlay.git
   ```

2. Navigate to the project directory:
   ```bash
   cd twitch-chat-overlay
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

This will launch the Electron app in development mode with hot reloading.

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

To build the application for distribution:

```bash
npm run make
# or
yarn make
```

This will create distributable packages in the `dist` directory for your platform.

## Usage

1. Launch the application
2. Click on "Connect with Twitch" button
3. Authorize the application in your browser
4. Enter your Twitch channel name
5. Adjust the overlay position and settings as needed
6. Start gaming while keeping chat visible!

## Configuration

The application creates a configuration file at:

- **Windows**: `%APPDATA%\twitch-chat-overlay\config.json`
- **macOS**: `~/Library/Application Support/twitch-chat-overlay/config.json`
- **Linux**: `~/.config/twitch-chat-overlay/config.json`

You can manually edit this file to adjust settings like:
- Window position and size
- Transparency level
- Chat message limit
- Notification preferences

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the Twitch API for making this project possible
- Inspired by streamers who need better chat monitoring solutions
- Built with the amazing open-source tools listed in the tech stack

## Support

If you encounter any issues or have feature requests, please [open an issue](https://github.com/your-username/twitch-chat-overlay/issues) on GitHub.

---

Made with ❤️ for streamers everywhere