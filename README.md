# Tiny Komal — Your Desktop Productivity Companion

A cute, animated desktop companion that helps you manage tasks, stay focused, and keep track of your day.

Tiny Komal is an Electron desktop productivity application built around a friendly animated avatar. It brings together a task list, reminders, daily progress tracking, a Pomodoro focus timer, and a compact desktop experience in a soft, playful interface.

Unlike a traditional productivity dashboard, Tiny Komal makes your companion the center of the experience—offering encouraging messages, task updates, and gentle reminders throughout your day.

**Project status:** Under active development. Features, desktop packaging, and platform support may evolve as the project progresses.

## Table of Contents
- [Overview](#overview)
- [Design Goals](#design-goals)
- [Features](#features)
- [Desktop Experience](#desktop-experience)
- [Tech Stack](#tech-stack)
- [Application Architecture](#application-architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Commands](#available-commands)
- [How to Use](#how-to-use)
- [Task and Reminder Workflow](#task-and-reminder-workflow)
- [Pomodoro Focus Timer](#pomodoro-focus-timer)
- [Settings and Customization](#settings-and-customization)
- [Electron Integration](#electron-integration)
- [Build and Packaging](#build-and-packaging)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Overview
Tiny Komal is designed for people who want a lightweight, visually engaging way to organize everyday work without relying on a cluttered productivity dashboard.

The application combines a React-based interface with Electron desktop capabilities. The main companion interface displays an animated avatar, contextual messages, a live clock, task management, and daily progress. Desktop-specific functionality includes a system tray menu and a separate floating overlay for reminder interactions.

The interface uses a soft pastel aesthetic with rounded components, subtle transitions, and a portrait-oriented companion panel.

### Design Goals
- **Companion-first experience**: Keep the animated avatar and its messages at the center of the application.
- **Simple task management**: Make adding, completing, removing, and snoozing tasks straightforward.
- **Gentle productivity support**: Use reminders, progress indicators, and focus sessions to support daily routines.
- **Desktop integration**: Provide tray access and an always-on-top companion overlay.
- **Modular architecture**: Keep UI components, application state, and Electron functionality separated for easier maintenance.

## Features

### 1. Animated Desktop Companion
Tiny Komal uses an animated avatar with different contextual states, including:
*Idle*, *Walking*, *Happy*, *Thinking*, *Reminder*, *Task completed*, *Sad*, *Sleeping*, and *Celebration*.

The companion can display contextual speech bubbles, such as:
- *"Good morning, Komal! ☀️"*
- *"You have 2 tasks left today."*
- *"Nice! One more done. 💚"*
- *"Need a break?"*
- *"It's getting late. Time to wind down. 🌙"*

The avatar system is designed to support replaceable visual assets and future animation enhancements.

### 2. Task Management
Organize daily work using the integrated todo list:
- Add tasks.
- Mark tasks as completed or pending.
- Remove individual tasks.
- Clear completed tasks.
- Associate reminder times with tasks.
- Snooze reminders.
- Track remaining and completed tasks.

### 3. Smart Reminder Experience
The application includes a reminder workflow that connects tasks with the companion's contextual messages:
- Detect tasks that are due.
- Display reminder prompts.
- Mark a task as completed directly from a reminder.
- Snooze a reminder using the configured snooze duration.
- Display the reminder experience through the desktop overlay when Electron integration is available.

### 4. Daily Progress and Statistics
Monitor daily activity using compact progress indicators and statistics:
- Completed task count.
- Remaining task count.
- Total task count and completion progress.
- Number of tasks with reminders.
- Age of the oldest pending task.

### 5. Pomodoro Focus Timer
Use the built-in Pomodoro timer to structure focused work sessions:
- Start and pause focus sessions.
- Track the remaining session time.
- Switch between focus and break phases.
- Skip the current phase.
- Track completed sessions.
- Connect focus activity with the companion's avatar state.

### 6. Compact Tray Mode
Switch to a smaller companion view when you want to keep the interface minimal. The compact view displays the companion's current state, message, and progress information, with an option to return to the expanded interface.

### 7. System Tray Integration
The Electron application creates a system tray icon with options to:
- Show Tiny Komal.
- Toggle the main window's visibility by clicking the tray icon.
- Quit the application.
Closing the main window hides it instead of immediately terminating the application, allowing the companion to remain accessible through the tray.

### 8. Floating Desktop Overlay
Tiny Komal includes a separate, initially hidden overlay window designed for reminder interactions.
The overlay is configured to be:
- Transparent and frameless.
- Always on top.
- Positioned near the lower-right corner of the primary display.
- Hidden from the taskbar.
- Connected to the React application through Electron IPC events.

The overlay can report task completion and snoozing actions back to the main window.

### 9. Personalization and Settings
The settings interface exposes reminder preferences, including snooze duration, and provides an option to clear completed tasks. The settings architecture can be extended with additional appearance, sound, scheduling, and companion preferences.

### 10. Lofi Music Player
The main interface includes a dedicated Lofi player component, providing a place for background listening alongside task management and focus sessions.

---

## Desktop Experience
Tiny Komal is designed for a desktop-first experience, with a responsive interface that can also be viewed during web development.

| Experience | Purpose |
|------------|---------|
| **Main window** | Full companion interface, task management, progress, settings, and focus tools |
| **Compact mode** | Smaller companion view with current state and daily progress |
| **Floating overlay** | Desktop-level reminder interactions |

The main interface uses a two-column layout with a portrait-oriented companion panel alongside the task list and progress information.

---

## Tech Stack
### Frontend
- **React 19** — Component-based user interface.
- **TypeScript** — Type safety and maintainable application code.
- **Vite 8** — Development server and build tooling.
- **TanStack Router** — File-based routing.
- **TanStack React Query** — Asynchronous state and query management.
- **Tailwind CSS 4** — Utility-first styling.
- **Radix UI** — Accessible UI primitives.
- **Lucide React** — Icon library.
- **Recharts** — Charting components available in the project dependencies.

### Desktop
- **Electron 43** — Desktop application runtime.
- **Electron IPC** — Communication between the main process and renderer.
- **Electron context bridge** — Controlled access to desktop functionality from the renderer.
- **vite-plugin-electron** — Integration between Vite and Electron during development and builds.

### Supporting Libraries and Tools
- **React Hook Form** & **Zod** — Form management and schema validation.
- **date-fns** — Date utilities.
- **ESLint** & **Prettier** — Code linting and formatting.
- **npm** — Dependency and script management.

---

## Application Architecture

Tiny Komal separates the desktop native capabilities (Electron Process) from the interface and business logic (React Renderer). This architecture emphasizes modularity and security.

```mermaid
flowchart TD
    subgraph Electron Main Process
        Main[Main Process - Window Management & OS Integration]
        Tray[System Tray]
        Overlay[Floating Overlay Window]
        
        Main <--> Tray
        Main <--> Overlay
    end

    subgraph Preload Bridge
        Preload[Context Bridge API]
    end

    subgraph React Renderer
        UI[UI Components]
        Hooks[State Hooks: useTasks, usePomodoro, useCompanion]
        Store[Local Storage / State Management]
        
        UI <--> Hooks
        Hooks <--> Store
    end

    Main <-->|IPC Channels| Preload
    Preload <-->|Secure Expose API| React Renderer
```

### 1. Electron Main Process
The main process acts as the application's backbone for OS integration, responsible for:
- Creating the **main application window**.
- Spawning and managing the **floating overlay window**.
- Managing the system tray and its context menu.
- Handling application lifecycle events.
- Receiving IPC messages from the renderer and relaying actions (e.g., forwarding overlay task actions to the main window).

### 2. Electron Preload (Context Bridge)
To adhere to modern security practices, renderer processes cannot access native Node.js APIs. The preload script exposes a strictly defined `electronAPI` through `contextBridge`. 
Exposed operations include:
- Showing and hiding the overlay.
- Restoring the main window.
- Reporting task completion and reminder snoozing.
- Listening for task actions originating from the overlay.

### 3. React Renderer & State Management
The renderer manages the entire user interface, orchestrating the companion state, tasks, and settings. It employs highly cohesive custom hooks:
- **`useClock.ts`**: High-precision timekeeping to drive reminders and daily resets.
- **`useTasks.ts`**: Manages CRUD for tasks, scheduling logic, and completion metrics.
- **`useCompanion.ts`**: Derives the avatar's state (idle, happy, thinking) and message context based on task loads, due dates, and Pomodoro phases.
- **`usePomodoro.ts`**: Independent timer state for work and break periods.
- **`useSettings.ts`**: Application preferences and UI configuration management.

---

## Project Structure

```text
komal-s-companion/
├── electron/
│   ├── main.ts            # Electron windows, tray, lifecycle and IPC
│   └── preload.ts         # Secure renderer-to-main API bridge
├── public/
│   └── favicon.ico        # Application/tray icon asset
├── src/
│   ├── components/
│   │   └── companion/     # Companion and productivity UI components
│   ├── hooks/
│   │   ├── useClock.ts
│   │   ├── useCompanion.ts
│   │   ├── usePomodoro.ts
│   │   ├── useSettings.ts
│   │   └── useTasks.ts
│   ├── lib/
│   │   └── companion/     # Companion-related utilities
│   ├── routes/
│   │   ├── __root.tsx     # Root application layout
│   │   └── index.tsx      # Main companion interface
│   ├── styles.css         # Global styling
│   └── server.ts          # Server-side rendering entry
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Prerequisites
Before running the application locally, install:
- **[Node.js](https://nodejs.org/)** — use a version compatible with the installed Vite and Electron dependencies.
- **npm** — included with Node.js.
- **[Git](https://git-scm.com/)** — to clone the repository.

Check your installed versions:
```sh
node --version
npm --version
git --version
```

---

## Getting Started

**1. Clone the Repository**
```sh
git clone https://github.com/Komalgiri/komal-s-companion.git
cd komal-s-companion
```

**2. Install Dependencies**
```sh
npm install
```

**3. Start Development**
```sh
npm run dev
```
This starts the configured Vite development workflow. The Vite configuration includes the Electron main and preload entry points, so desktop integration is configured in the project. For the dedicated desktop development script, run `npm run dev:desktop`.

**4. Open the Application**
Follow the local URL printed by Vite. Confirm that the Electron process launches correctly in your environment if you are testing the native desktop experience.

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development workflow |
| `npm run dev:desktop` | Start the desktop development workflow |
| `npm run build` | Build the configured Vite application |
| `npm run build:dev` | Build using development mode |
| `npm run build:desktop` | Build the Vite application and invoke Electron Builder |
| `npm run preview` | Preview the production web build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format files with Prettier |

---

## How to Use

### Manage Your Tasks
- Launch Tiny Komal.
- Add a task through the todo list.
- Set a reminder time when needed.
- Mark tasks as completed as you finish them.
- Snooze reminders when you need more time.
- Review the progress indicators to see how much work remains.

### Interact With the Companion
The avatar responds to application state, such as remaining tasks and focus activity. Its messages and visual states provide contextual feedback while you work.

### Use Compact Mode
Choose the minimize/compact-mode control in the companion panel to switch to the smaller view. Expand it again when you need the complete task interface.

### Access the App Through the Tray
When running as a desktop application, use the system tray icon to show or hide the main window. The tray menu also provides a quit option.

### Adjust Reminder Settings
Open settings to review available reminder preferences and configure the snooze duration supported by the current implementation.

---

## Task and Reminder Workflow
At a high level, the reminder workflow follows this sequence:
1. A task is created with an optional reminder.
2. The companion evaluates task and timing state.
3. When a task becomes due, the app displays a reminder.
4. The user completes, snoozes, or dismisses the reminder.
5. Completion and snoozing actions update the relevant task or companion state.

When desktop integration is active, the Electron overlay can surface the reminder interaction separately from the main window.

---

## Pomodoro Focus Timer
The Pomodoro timer is intended to help users alternate focused work and breaks.
The interface tracks the current phase, remaining time, running state, and session count. The companion also receives focus-state information, allowing its behavior to reflect whether the user is in a focus session.

---

## Settings and Customization
The codebase is organized to make it possible to extend the application with additional preferences.
Potential customization areas include:
- Reminder timing and snooze intervals.
- Avatar images and animation states.
- Companion messages.
- Interface appearance and color palette.
- Focus and break durations.
- Sound and notification preferences.
- Compact-mode behavior.

*Only preferences implemented in the current settings component should be considered available features.*

---

## Electron Integration

### Window Management
The application creates a main window and a separate overlay window. The main window is configured to hide when closed unless the user explicitly quits the application.

### IPC Communication
The main process uses IPC channels to handle overlay actions and restore the main window. The preload layer exposes the supported operations to the renderer.

### Security Defaults
The Electron windows are configured with:
- `nodeIntegration: false`
- `contextIsolation: true`

These settings help isolate the renderer from direct Node.js access. Continue using narrowly scoped preload APIs and validate any additional IPC messages when expanding desktop functionality.

### Platform Considerations
Electron behavior and packaging can differ across Windows, macOS, and Linux. Verify tray icons, window behavior, paths, installer configuration, and quit behavior on each platform you intend to support.

---

## Build and Packaging

**Build the Application**
```sh
npm run build
```

**Preview the Web Build**
```sh
npm run preview
```

**Build the Desktop Package**
```sh
npm run build:desktop
```
This runs the web build and then invokes Electron Builder. Before using it for distribution, confirm that Electron Builder is installed, its configuration is present, and the output paths match the current Electron/Vite build.

---

## Configuration
The current `package.json` does not declare application-specific environment variables.
Vite uses `VITE_DEV_SERVER_URL` in the Electron main process to determine whether to load the development server or the packaged application entry point.
In normal development, the Electron plugin is responsible for setting up the relevant development integration. Do not assume that the variable needs to be manually added to a `.env` file.

---

## Troubleshooting

- **Dependencies fail to install:** Check Node.js version and npm error output.
- **App does not launch as desktop window:** Confirm Electron is installed, check terminal for errors, verify main/preload entry points.
- **Packaged app opens to blank screen:** Inspect build output, verify paths for `loadFile()`, check static assets, inspect Electron logs.
- **Tray icon missing:** Check `public/favicon.ico` exists and is packaged correctly.
- **Reminders/overlay do not appear:** Check task reminder time, confirm IPC availability, inspect logs for IPC errors.
- **Desktop packaging fails:** Verify Electron Builder configuration.

---

## Security Considerations
- Keep Electron's Node.js integration disabled in renderer windows.
- Preserve context isolation.
- Expose only the IPC methods required by the interface.
- Validate IPC payloads before adding more privileged operations.
- Avoid loading untrusted remote content into privileged Electron windows.
- Keep secrets out of source control and renderer bundles.

---

## Roadmap
Ideas for future development include:
- Finalize cross-platform desktop packaging.
- Improve avatar animations and expand the companion's visual states.
- Add more reminder sounds and notification preferences.
- Expand customization for the companion's appearance.
- Improve focus-session customization and statistics.
- Add stronger task persistence and backup options, if needed.
- Improve accessibility and keyboard navigation.
- Add automated tests for task, reminder, and desktop workflows.
- Document verified Windows, macOS, and Linux release procedures.

---

## Contributing
Contributions, bug reports, and suggestions are welcome.
1. Fork the repository.
2. Create a feature branch.
3. Make a focused change.
4. Run the available lint and build commands.
5. Submit a pull request describing the change and its testing.

For bug reports, include your operating system, Node.js version, reproduction steps, and relevant console or terminal output.

---

## License
No license has been verified from the repository files reviewed for this README. Add a LICENSE file and update this section once the project's intended license has been chosen.

---

## Author
**Komal Giri**
- GitHub: [@Komalgiri](https://github.com/Komalgiri)
- Portfolio: [portfolio-komalgiri.onrender.com](https://portfolio-komalgiri.onrender.com/)
- LinkedIn: [Komal Giri](https://www.linkedin.com/in/komal-giri-52798a265/)

*Built to make everyday productivity feel a little more personal, encouraging, and fun.*
