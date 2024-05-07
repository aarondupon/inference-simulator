# Project Title

Vue3 Video Analysis is a web application designed for simulating an inference server for video analysis tasks. It provides users with the ability to create and manage projects, stream videos, capture frames, investigate captured frames, and tag frames for further analysis.

## Features:

- **Project Creation and Management:** Users can create new projects, view existing projects, and delete projects.
- **Video Stream:** Users can start and stop a video stream, either from a looped video file or a live webcam feed.
- **Frame Capture:** Users can capture frames from the video stream, with each frame being stored along with a timestamp.
- **Frame Investigation:** Captured frames are displayed as thumbnails, allowing users to click on them for a detailed view. Users can also add tags to frames for categorization.
- **Not so Clean UI Design:** The application features a clean and intuitive user interface, making it easy to navigate and use.
- **State Management:** Pinia is used for state management, ensuring efficient handling of application state.
- **Testing:** Cypress is utilized for end-to-end testing to ensure all features work as expected.
- **API server:** basic implementation in Node.js using Express.

## Future Enhancements:

See remarks.

## Structure

Be aware that only important source folders or files are displayed below.

```
├── App.vue
├── components
│   ├── CreateProjectDialog.vue
│   ├── ImageViewer.vue
│   ├── StreamRecorder.vue
│   └── sidebars
│       ├── CaptureList.vue
│       └── TagManager.vue
├── directives
│   └── vTouchPinch.ts
├── layouts
│   └── MainLayout.vue
├── pages
│   ├── 404.vue
│   ├── Capture.vue
│   ├── CaptureDetail.vue
│   └── Projects.vue
├── quasar.d.ts
├── router
│   └── routes.ts
├── service
│   ├── capture.ts
│   └── projects.ts
├── shims-vue.d.ts
├── stores
│   ├── capture.store.ts
│   ├── project.store.ts
└── types.ts

```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

- Node.js
- npm

### Installing

A step by step series of examples that tell you how to get a development environment running:

1. Clone the repository: `git clone https://github.com/aarondupon/inference-simulator.git` or open zip
2. Navigate into the project directory: `cd inference-simulator`
3. Install the dependencies: `npm install`

### Running the Application

To start the application, run the following command in your terminal:
This will start the api server (needed for project) and quasar concurent

```bash
npm run start
```

> ⚠️ **Warning:** The expres server must run on port `3000` if not change `API_URL` in quasar.config

### Running the End-to-End Tests

This project uses Cypress for end-to-end testing. The `test:e2e` script starts the application and opens the Cypress test runner.

To run the end-to-end tests, use the following command:

```bash
npm run test:e2e
```

or open cypress and run Spect > Project.cy.ts

```bash
npm run cy:open
```

> ⚠️ **Warning:** The expres server must run before testing. : `npm run start`

### Api

The express server will start on port `3000`.
The server will alway start if furn `npm start`
server.js

#### API Endpoints

The application provides the following API endpoints:

- **POST /api/tag/\*:** Add tags to an image
- **POST /api/upload/:** name: Upload an image
- **GET /api/project:** Get a list of all images in a project
- **GET /api/projects:** Get a list of all projects
- **POST /api/project:** Create a new project
- **DELETE /api/project/:name:** Delete a project
- **GET /api/tag/\*:** Get the tags of an image

#### Built With

Node.js
Express.js
piexifjs

## Notes

## Important Types and Usage

This project uses TypeScript for static type-checking. Here are the main types used in the project:

- **Project:** This type represents a project in the application. It has the following properties:

  - `id`: An optional number that represents the unique identifier of the project.
  - `name`: A string that represents the name of the project.
  - `timeupdated`: A `Date` or `string` that represents the last time the project was updated.
  - `timecreated`: A `Date` or `string` that represents the time the project was created.
  - `thumbnail`: An optional string that represents the URL of the project's thumbnail image.
  - `frames`: An optional array of `Frame` objects that represent the frames associated with the project.

- **Frame:** This interface represents a frame in the application. It has the following properties:
  - `id`: A number that represents the unique identifier of the frame.
  - `name`: A string that represents the name of the frame.
  - `tags`: An array of strings that represent the tags associated with the frame.
  - `image`: A string that represents the URL of the frame's image.
  - `thumbnail`: A string that represents the URL of the frame's thumbnail image.
  - `timecreated`: A `Date` or `string` that represents the time the frame was created.

These types are used throughout the application to ensure consistency and reliability when working with project and frame data. (types.ts)

### API

`GET /api/projects` is called on each page refresh. This should be optimized by loading only the requested projects!

```json
[
  {
    "id": 1,
    "name": "rettzr",
    "timecreated": "2024-05-07T12:38:01.898Z",
    "timeupdated": "2024-05-07T12:44:09.117Z",
    "path": "./public/uploads/rettzr",
    "frames": [
      {
        "id": 1,
        "name": "myImage-1715085484485.jpeg",
        "thumbnail": "/uploads/rettzr/myImage-1715085484485.jpeg",
        "image": "./public/uploads/rettzr/myImage-1715085484485.jpeg",
        "tags": [],
        "timecreated": "2024-05-07T12:38:04.485Z",
        "timeupdated": "2024-05-07T12:38:04.486Z"
      },
      {
        "id": 2,
        "name": "myImage-1715085849116.jpeg",
        "thumbnail": "/uploads/rettzr/myImage-1715085849116.jpeg",
        "image": "./public/uploads/rettzr/myImage-1715085849116.jpeg",
        "tags": ["tag 1", "tag 2"],
        "timecreated": "2024-05-07T12:44:09.117Z",
        "timeupdated": "2024-05-07T12:44:23.148Z"
      }
    ]
  }
]
```
