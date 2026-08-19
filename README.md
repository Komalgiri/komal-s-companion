# Komal's Companion

Build a cute desktop productivity companion called Tiny Komal — a small animated avatar that lives on the user's desktop and helps them manage tasks, reminders, and time.

Create the initial responsive web-app prototype with a 3:4 portrait-oriented companion panel and a clean, cute, modern aesthetic. Use a soft pastel palette with warm pink, cream, lavender, baby blue, and subtle dark accents. The design should feel like a polished personal productivity app rather than a generic SaaS dashboard.

The main experience should revolve around the avatar. Display a large transparent-background avatar area in the center, with the avatar able to switch between states such as idle, walking, happy, thinking, reminder, task done, sad, sleeping, and celebration. For now, use placeholder avatar assets with clearly separated image slots so real generated PNG assets can be added later.

Include:

A live digital clock

Today's date

Current task count

A simple Todo list

Add-task functionality

Task completion with Done / Not Done states

Reminder time for each task

Snooze functionality

Notification/speech bubbles from the avatar

Daily progress indicator

Small productivity statistics

Settings for reminder preferences

A compact desktop/tray-style mode

Smooth animations and transitions

Example avatar messages:

"Good morning, Komal! ☀️"

"You have 2 tasks left today."

"This task has been pending for 3 days 👀"

"Nice! One more done. 💚"

"Need a break?"

"It's getting late. Time to wind down. 🌙"

Use React + Vite + TypeScript + Tailwind CSS. Keep the architecture modular so the avatar system, task system, reminder scheduler, notifications, and UI can later be connected to an Electron desktop wrapper.

For the first version, use local/mock data and localStorage rather than requiring a backend. Create reusable components for Avatar, AvatarState, TodoList, TaskCard, Clock, ReminderPopup, SpeechBubble, ProgressCard, and Settings.

The UI should be minimal, playful, polished, and animation-friendly, with the avatar being the visual focus rather than a dashboard full of cards.

Make the code production-quality and structured so this can later become a real Windows desktop application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d6959ec0-1743-4fc0-b4eb-02ec722ec8c8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
