# Angular Dependent Selects

A demonstration of cascading/dependent select dropdowns in Angular, featuring:

- Dependent dropdowns (fruit type affects available fruits)
- Multi-select functionality for fruits
- URL query parameter synchronization
- Form state management using ReactiveFormsModule
- API call simulation with async/await

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.6.

## Features

### Fruit Type Selection
- Single select dropdown
- Four categories: Sweet (id: 1), Sour (id: 2), Salty (id: 3), and Bitter (id: 4)
- Default selection: "Sour" (id: 2)
- Changes trigger fruit list update and clear fruit selection

### Fruit Selection
- Multi-select dropdown
- Dynamic options based on selected fruit type
- Default selection for "Sour": Lemon (id: 3) and Grapefruit (id: 4)
- Selection preserved in URL parameters
- Multiple fruits can be selected simultaneously
- Selection cleared when fruit type changes

### URL Integration
- State preserved in URL query parameters
- Format: `?type=2&fruits=3,4`
- Sharable URLs with preserved selections
- Automatic URL updates on selection changes

### API Integration
- Service-based architecture with AppService
- Simulated API methods with configurable delay (default: 500ms):
  - getFruitTypes(): Fetches all fruit type categories
  - getFruitsByType(typeId): Retrieves fruits filtered by type
  - saveItems(fruitType, selectedFruits): Saves current selection
- Configurable API delay via `API_DELAY_MS` constant in AppService
- API calls triggered on:
  - Initial load
  - Fruit type changes
  - Fruit selection changes
- Console logging of selections with detailed output

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Usage Example

1. On initial load:
   - "Sour" fruit type is automatically selected
   - "Lemon" and "Grapefruit" are pre-selected
   - URL updates to reflect default selections
2. Select a different fruit type:
   - Available fruits update automatically
   - Previous fruit selection is cleared
   - URL updates to show new type and empty selection
3. Select multiple fruits using Ctrl/Cmd + click:
   - Each selection triggers an API call
   - URL updates to reflect current selections
4. Share the URL to preserve your selections:
   - Opening the URL restores both fruit type and selections
   - Default values only apply when no URL parameters exist

Example URL: `http://localhost:4200/?type=2&fruits=3,4`
- `type=2` represents "Sour" category
- `fruits=3,4` represents "Lemon" and "Grapefruit"

## Implementation Details

The project uses:
- BehaviorSubject for state management
- ReactiveFormsModule for form handling
- Router for URL parameter management
- TypeScript interfaces for type safety
- Simulated API calls with Promise/async-await and configurable delays
- Service architecture with dependency injection
- Centralized API delay configuration for consistent simulation timing

## Additional Resources

For more information:
- [Angular Reactive Forms](https://angular.dev/guide/forms/reactive-forms)
- [Angular Services](https://angular.dev/guide/dependency-injection)
- [Angular Router](https://angular.dev/guide/routing)
- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [RxJS BehaviorSubject](https://rxjs.dev/api/behavior/BehaviorSubject)
