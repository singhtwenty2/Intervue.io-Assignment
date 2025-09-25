# Live Polling System - Frontend

A modern React TypeScript application for real-time polling with live results and WebSocket integration.

## Features

- **Real-time Communication**: Socket.io integration for live updates
- **Teacher Interface**: Create polls, manage questions, view live results
- **Student Interface**: Join polls, answer questions, see results
- **Modern UI**: Tailwind CSS with responsive design
- **State Management**: Redux Toolkit with RTK Query
- **Type Safety**: Full TypeScript implementation

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone and install dependencies**:

```bash
git clone <repository-url>
cd live-polling-frontend
pnpm install
```

2. **Start development server**:

```bash
pnpm dev
```

3. **Build for production**:

```bash
pnpm build
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Button, Card, etc.)
│   ├── teacher/         # Teacher-specific components
│   └── student/         # Student-specific components
├── pages/               # Page components
├── store/               # Redux store configuration
│   ├── slices/          # Redux slices
│   └── api/             # RTK Query API definitions
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## API Integration

The frontend integrates with your Railway-deployed backend:

- Base URL: `https://intervueio-assignment-production.up.railway.app`
- WebSocket URL: Same as base URL
- All API endpoints from your Postman collection are supported

## Key Components

### Teacher Workflow

1. **Create Poll** - Set up a new polling session
2. **Add Questions** - Create multiple choice questions with time limits
3. **Manage Students** - View connected students, remove if needed
4. **Start Questions** - Launch questions and see live responses
5. **View Results** - Real-time result visualization

### Student Workflow

1. **Join Poll** - Enter name and poll ID
2. **Wait for Questions** - Connected status and waiting room
3. **Answer Questions** - Timed question answering interface
4. **View Results** - Confirmation and results display

## Socket Events

The frontend listens for these WebSocket events:

- `question-started` - New question begins
- `question-ended` - Question ends, show results
- `poll-results-updated` - Live result updates
- `student-joined/left` - Student connection changes
- `timer-update` - Time remaining updates
- `student-removed` - Handle being kicked from poll

## Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Build settings**:
    - Build Command: `pnpm build`
    - Output Directory: `dist`
3. **Deploy** - Automatic deployments on push

### Manual Deployment

1. **Build the project**:

```bash
pnpm build
```

2. **Deploy the `dist` folder** to your hosting provider

## Environment Variables

No environment variables needed - the backend URL is configured directly in the API configuration.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **Socket.io Client** - Real-time communication
- **React Router** - Navigation
- **Lucide React** - Icons

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript checks

### Code Style

- ESLint configuration included
- Prettier for code formatting
- TypeScript strict mode enabled
- Consistent component patterns

## Performance Optimizations

- Code splitting with React.lazy
- Memoized components where beneficial
- Optimized bundle size with Vite
- Socket connection management
- Efficient re-renders with Redux

## Testing Your Setup

1. **Start the frontend**: `pnpm dev`
2. **Create a poll** as teacher
3. **Join as student** in another browser/tab
4. **Test real-time features** - questions, answers, results
5. **Verify all API endpoints** work with your backend

## Troubleshooting

### Common Issues

**Socket connection fails:**

- Check if backend is running on Railway
- Verify URL in `useSocket.ts` and `pollApi.ts`

**API calls fail:**

- Confirm backend URL is correct
- Check network/CORS settings
- Verify backend endpoints match Postman collection

**Build errors:**

- Run `pnpm install` to ensure dependencies
- Check TypeScript errors with `pnpm type-check`

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## License

MIT License - see LICENSE file for details
