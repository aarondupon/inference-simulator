# Project Design

This document provides an overview of the design for our current project, detailing the architecture, technologies employed, and the guiding design principles.

## Architecture

The project follows a client-server architecture, with a Vue.js 3 frontend serving as the client and a Node.js backend handling server-side operations. Communication between the client and server is achieved via RESTful APIs.

## Technologies Used

### Frontend

- **Vue.js 3**: The frontend framework for building interactive user interfaces.
- **Quasar Framework**: Used for UI components, styling, and overall design consistency.
- **Pinia**: State management library for managing application state.
- **TypeScript**: Provides static typing for enhanced code readability and maintainability.
- **css**: We prioritize using Quasar's helper classes whenever possible, and leverage SCSS when necessary for styling enhancements.

### Backend

- **Node.js**: Backend runtime environment for executing JavaScript code.
- **Express.js**: Web application framework for building robust APIs.
- This is only added to serve as a proof of concept in the current MVP. (It cannot be used for production.)

## Design Principles

This project follows a number of design principles for better organization and separation of concerns:

- **Components Directory:** Components are divided into subdirectories (such as sidebars) to group related components together. Each component is focused on a specific task or functionality.

- **Directives Directory:** Custom directives are placed in a separate directory for better organization. The provided `vTouchPinch.ts` directive is appropriately named and located.

- **Layouts Directory:** The `MainLayout.vue` file provides a standardized layout for the application, helping to maintain consistency across different pages.

- **Pages Directory:** Pages represent the different views or routes in the application. Each page component is responsible for rendering a specific route and contains related logic.

- **Router Directory:** Route definitions are stored in a separate directory (`routes.ts`) for better separation of concerns. Routes are properly defined and organized.

- **Service Directory:** A separate directory for services (`service`) contains logic for interacting with APIs.

- **Stores Directory:** The `stores` directory should contain pinia.js. Currently, it contains `capture.store.ts` and `project.store.ts`. All shared state or actions are stored in the corresponding store. If new domains are added, a new store should be created accordingly."

- **Types File:** Types File: The `types.ts` file contains all types that are shared across multiple components. (If the project grows, we can split it into files based on the domain of the types.)

## User Interface

### Layput

**Tree-width-Layout with top header:**
The main content in the center is where the action happens and can have an extra top navigation for more focused, context-aware actions.

- **Main conten** The main content is centered for focus.
- **Sidebar Left** The left sidebar holds primary actions and crucial navigation.
- **Sidebar Right** Secondary actions are placed in the right sidebar for easy access.
- **Top header:** Ideal for application-level navigation (e.g., displaying projects, capturing).

### Pages

- **Projects page:** Project grid with options to create, rmove and opening projects
- **Capture page:** A project landing page with a fake video stream. Users can capture frames, view a history, and navigate with arrows
- **Capture detail Page:** A page allowing users to examine a single frame in detail by zooming & panning, with the ability to add or remove tags in the sidebar

### Interaction

- **Mouse**: All actions should be possible with one click; no right-clicking.
- **Touch**: Touch devices should be fully supported, including touch interactions (e.g., zooming, dragging).
- **Buttons**: All buttons should have tooltips, preferably text-based if it's not a commonly well-known action.
- **Forms** Forms should display errors from the server.

## Future Improvements

- Implementing **Unit & Integration tests**.
- Adding i18n localization, moving all text to separate translation files.
- Implementing user authentication for project management.
- Implementing a far more polished UI design.
- Adding Cypress component tests.
