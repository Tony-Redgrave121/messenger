## Launching the project

```
npm install - Install dependencies
npm run dev - Launch the project in development mode
npm run preview - Preview the production build
```

----

## Scripts

- `npm run dev` - Start the dev server via Vite
- `npm run build` - Build the project
- `npm run preview` - Local preview of the build
- `npm run lint` - Check the code using ESLint
- `npm run prettier` - Format the code using Prettier

----

## Project architecture

The project was written in accordance with the Feature sliced design methodology

Link to documentation - [feature sliced design](https://feature-sliced.design/docs/get-started/tutorial)

----

## Linting

The project uses eslint to check typescript code, strictly control key architectural principles, and ensure accessibility

##### Running linters

- `npm run lint` - Checking ts files with a linter
- `npm run prettier` - Formatting the project

----

## Project configuration

The project contains a vite config: `vite.config.ts`

The builder is adapted to the main features of the application

Build:
- **[vite](client/vite.config.ts)**

----

## Working with data

Data interaction is carried out using the redux toolkit

Requests to the server are sent using [Axios](client/src/shared/api/axiosApi.ts)

----

## Routing

To work with routes in the project, we use
[React router DOM](https://reactrouter.com/en/main)

The router configuration is located in [client/src/app/providers/RouterProvider](client/src/app/providers/RouterProvider)

----

## Entities

- [Contact](client/src/entities/Contact)
- [Media](client/src/entities/Media)
- [Member](client/src/entities/Member)
- [Message](client/src/entities/Message)
- [Messenger](client/src/entities/Messenger)
- [Reaction](client/src/entities/Reaction)
- [User](client/src/entities/User)

## Features

- [CreateMessenger](client/src/features/CreateMessenger)
- [EditMessenger](client/src/features/EditMessenger)
- [Message](client/src/features/Message)
- [MessageSearch](client/src/features/MessageSearch)
- [MessengerInput](client/src/features/MessengerInput)
- [MessengerSearch](client/src/features/MessengerSearch)
- [Profile](client/src/features/Profile)
- [Slider](client/src/features/Slider)
- [UserContacts](client/src/features/UserContacts)
- [ChatList](client/src/features/ChatList)

## Widgets

- [AuthForm](client/src/widgets/AuthForm)
- [Header](client/src/widgets/Header)
- [LeftSidebar](client/src/widgets/LeftSidebar)
- [Main](client/src/widgets/Main)
- [Messenger](client/src/widgets/Messenger)
- [PageError](client/src/widgets/PageError)
- [PageLayout](client/src/widgets/PageLayout)
- [RightSidebar](client/src/widgets/RightSidebar)

## Pages

- [AuthPage](client/src/pages/AuthPage)
- [MessengerPage](client/src/pages/MessengerPage)
- [PostPage](client/src/pages/PostPage)

## Shared

- The project uses a custom UI library (client/src/shared/ui). All UI components are located in /client/src/shared/ui
- All assets are located in /client/src/shared/assets: [assets](client/src/shared/assets)
- All auxiliary development tools, such as hooks, contexts, wrappers, or testing helpers, are located in /client/src/shared/lib: [lib](client/src/shared/lib)
- The [config](client/src/shared/config) folder contains configuration files
