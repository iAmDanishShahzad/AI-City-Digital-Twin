# AI City Digital Twin: MVP Technology Stack

## Stack Principles

This stack is deliberately small, local-first, and suited to one developer building a polished MVP in one week. It supports the architecture's separation between simulation, analytics, insight generation, presentation, and rendering without adding infrastructure or abstraction that the MVP does not need.

| Area | Selected technology or approach |
| --- | --- |
| Programming language | TypeScript |
| Frontend | React |
| Build tool | Vite |
| 3D rendering | Three.js with React Three Fiber |
| Styling | CSS Modules and CSS custom properties |
| State | React `useReducer` and Context |
| Routing | No routing library |
| Simulation | Custom deterministic domain module |
| Pathfinding | Custom Dijkstra shortest-path implementation |
| Analytics | Custom deterministic rules and derived metrics |
| Testing | Vitest and Testing Library |
| Linting and formatting | ESLint and Prettier |
| Package manager | npm |
| Version control | Git with GitHub |
| Deployment | Static build published with GitHub Pages |
| Development environment | VS Code, Node.js LTS, and a modern desktop browser |

## 1. Programming Language

**Selected: TypeScript**

- **Purpose:** Define application, simulation, scenario, analytics, and presentation contracts with static types.
- **Why it was chosen:** The project goal requires strict typing. Types make state transitions and domain boundaries easier to understand, refactor, and test during a fast-moving build.
- **Alternatives considered:** JavaScript.
- **Why alternatives were rejected:** JavaScript provides less protection against invalid scenario data, inconsistent simulation snapshots, and accidental state-shape changes.

## 2. Frontend Framework

**Selected: React**

- **Purpose:** Build the interactive controls, impact panel, and application-level view composition.
- **Why it was chosen:** It is already established in the project direction and supports small, reusable functional components and explicit UI state updates.
- **Alternatives considered:** A framework-free interface, Vue, and Svelte.
- **Why alternatives were rejected:** A framework-free approach would add manual UI coordination work; Vue and Svelte would introduce a change in the established project direction without a material MVP benefit.

## 3. Build Tool

**Selected: Vite**

- **Purpose:** Provide local development, production builds, and static asset handling.
- **Why it was chosen:** It has a minimal setup, fast feedback loop, and strong support for the selected frontend and language combination.
- **Alternatives considered:** Webpack and a custom build configuration.
- **Why alternatives were rejected:** They require more configuration and maintenance than a one-week MVP warrants.

## 4. 3D Rendering

**Selected: Three.js with React Three Fiber**

- **Purpose:** Render the 3D district, roads, vehicles, scenario markers, lighting, and camera interactions.
- **Why it was chosen:** Three.js is established by the project direction. React Three Fiber keeps 3D scene composition aligned with the component model while retaining access to the underlying renderer when needed.
- **Alternatives considered:** Direct Three.js integration, Babylon.js, and a 2D map or canvas renderer.
- **Why alternatives were rejected:** Direct integration would require more manual lifecycle coordination; Babylon.js adds a new engine without a clear MVP advantage; 2D rendering does not meet the project requirement for a 3D district.

## 5. Styling

**Selected: CSS Modules and CSS custom properties**

- **Purpose:** Style the interface, overlay panels, controls, responsive layout, and visual design tokens.
- **Why it was chosen:** This keeps styles scoped, native to the platform, lightweight, and easy to tune for a polished demo.
- **Alternatives considered:** A utility-class styling framework, CSS-in-JS, and a component-library theme system.
- **Why alternatives were rejected:** Each adds conventions, dependencies, or generated styling behavior that is unnecessary for a small, custom-designed interface.

## 6. State Management

**Selected: React `useReducer` and Context**

- **Purpose:** Manage application state transitions, selected scenarios, simulation snapshots, presentation data, and recoverable errors.
- **Why it was chosen:** The MVP has a small, explicit state model. A reducer maps naturally to the architecture's state transitions and is easy to test without introducing another state dependency.
- **Alternatives considered:** Zustand, Redux Toolkit, and a global mutable store.
- **Why alternatives were rejected:** External stores add setup and API surface beyond the MVP's needs; a global mutable store weakens traceability and deterministic state transitions.

## 7. Routing

**Selected: No routing library for the MVP**

- **Purpose:** Keep the demo as one focused, single-screen experience.
- **Why it was chosen:** The product has one primary user flow: view the district, apply a scenario, observe the result, and read its insight. Navigation infrastructure would not improve that flow.
- **Alternatives considered:** Client-side routing libraries and multiple pages.
- **Why alternatives were rejected:** They add navigation states, URLs, and test cases without supporting a required MVP capability.

## 8. Simulation Strategy

**Selected: Custom deterministic simulation module**

- **Purpose:** Advance vehicle movement, route availability, congestion indicators, and scenario effects on a compact fictional road network.
- **Why it was chosen:** A custom module directly models the limited domain required by the product, is repeatable for demos, and keeps the simulation independent of rendering and interface concerns.
- **Alternatives considered:** A physics engine, a general-purpose agent simulation library, and real traffic-data integration.
- **Why alternatives were rejected:** Physics and agent libraries solve broader problems than needed; live data conflicts with deterministic, local-first MVP behavior and the product's non-goals.

## 9. Pathfinding Strategy

**Selected: Custom Dijkstra shortest-path implementation over a small weighted road graph**

- **Purpose:** Choose valid alternate routes when a scenario closes or constrains a road segment.
- **Why it was chosen:** The district is intentionally small, edge costs can represent route length or congestion, and the algorithm is understandable, deterministic, and straightforward to test.
- **Alternatives considered:** Breadth-first search, A*, and external pathfinding libraries.
- **Why alternatives were rejected:** Breadth-first search does not account for weighted route costs; A* provides little value on a tiny graph without a strong heuristic; a library is more dependency than the MVP requires.

## 10. Analytics

**Selected: Custom deterministic rules and derived metrics**

- **Purpose:** Compare baseline and scenario snapshots to produce traffic, route, emergency-access, and delivery-impact facts.
- **Why it was chosen:** The MVP needs a small set of explainable facts, not statistical forecasting. Explicit rules make every shown insight traceable to simulation state.
- **Alternatives considered:** A data-analysis library, predictive models, and external analytics services.
- **Why alternatives were rejected:** They add complexity, data requirements, or non-determinism without improving the demonstration's central story.

## 11. Testing

**Selected: Vitest and Testing Library**

- **Purpose:** Test domain rules, scenario validation, analytics, reducer transitions, and user-facing interaction flows.
- **Why it was chosen:** Vitest integrates cleanly with the selected build tool and provides a fast test loop. Testing Library focuses UI tests on user-observable behavior rather than implementation details.
- **Alternatives considered:** Jest, end-to-end-only testing, and manual testing only.
- **Why alternatives were rejected:** Jest is viable but provides no clear advantage in this stack; end-to-end-only testing is slower and less focused for domain logic; manual testing alone cannot reliably protect deterministic simulation behavior.

## 12. Linting & Formatting

**Selected: ESLint and Prettier**

- **Purpose:** Enforce consistent code quality and formatting across application and test code.
- **Why it was chosen:** ESLint supports the project's code-quality requirements; Prettier removes formatting decisions from day-to-day work.
- **Alternatives considered:** No automated formatting, editor-only formatting, and a single all-in-one linter/formatter replacement.
- **Why alternatives were rejected:** Manual or editor-only conventions are inconsistent across contributors; changing tools offers no practical advantage over the widely understood pair for this MVP.

## 13. Package Manager

**Selected: npm**

- **Purpose:** Install dependencies and run standard development, test, lint, and build scripts.
- **Why it was chosen:** It ships with Node.js, requires no additional package-manager setup, and keeps onboarding straightforward.
- **Alternatives considered:** pnpm and Yarn.
- **Why alternatives were rejected:** Both are capable, but their installation and workspace advantages do not justify an additional team convention for this small single-package project.

## 14. Version Control

**Selected: Git with GitHub**

- **Purpose:** Track changes, review history, host the open-source repository, and publish the static MVP.
- **Why it was chosen:** Git supports small, reversible changes; GitHub provides an appropriate public project home and static-site publishing path without additional infrastructure.
- **Alternatives considered:** Other hosted Git services and local-only version control.
- **Why alternatives were rejected:** Other hosts do not offer a meaningful MVP advantage; local-only history would undermine the open-source project workflow.

## 15. Deployment

**Selected: Static build published with GitHub Pages**

- **Purpose:** Make the browser-based demo available from the repository without managing a server.
- **Why it was chosen:** The MVP is a static client-side application with no required backend. This approach is simple, low-maintenance, and sufficient for a hackathon demonstration.
- **Alternatives considered:** Manual local demonstration, Vercel, Netlify, and a custom server.
- **Why alternatives were rejected:** A local-only demo is harder to share; additional hosting platforms create an unnecessary account and deployment decision; a custom server adds infrastructure the MVP does not use.

## 16. Development Environment

**Selected: VS Code, Node.js LTS, and a modern desktop browser**

- **Purpose:** Provide the local authoring, execution, debugging, and visual verification environment.
- **Why it was chosen:** This combination offers an accessible editor, stable runtime, and browser developer tools for diagnosing scene and performance behavior.
- **Alternatives considered:** Other code editors, non-LTS runtime releases, and mobile-first development.
- **Why alternatives were rejected:** Other editors are compatible but provide no required MVP benefit; non-LTS releases add avoidable volatility; the demo is designed and performance-tested for a desktop presentation.

## 17. Libraries Intentionally Not Used

| Library or category | Reason for exclusion from the MVP |
| --- | --- |
| External state-management library | The reducer and Context approach is sufficient for the small, explicit state model. |
| Client-side routing library | The MVP has one primary screen and no navigation requirement. |
| Physics engine | Vehicle movement is route-based rather than physics-driven. |
| External pathfinding library | The road graph is small enough for a tested local implementation. |
| UI component library | The demo needs a small, custom visual language rather than a broad component catalog. |
| Charting library | The product favors visual scene changes and concise impact statements over dashboards. |
| Mapping or geospatial SDK | The district is fictional and purpose-built; live geographic data is out of scope. |
| Backend, database, or authentication service | The MVP has no accounts, persistence, or server-side product requirement. |
| Analytics, telemetry, or error-monitoring service | Local diagnostics and manual demo verification are sufficient at this stage. |
| AI SDK or external AI dependency | Insight generation must have deterministic, predefined fallback content; any optional integration remains isolated until explicitly selected. |

## 18. Future Technology Considerations

These are not part of the MVP and should be adopted only in response to a confirmed product need:

- A dedicated state-management library if multiple independent views or complex asynchronous workflows make the reducer approach difficult to maintain.
- A routing solution if the product gains distinct, meaningful screens.
- A larger-scale simulation or pathfinding capability if district size or vehicle count exceeds the custom module's performance envelope.
- Persisted scenario data only if users need to save, compare, or share scenarios.
- A carefully scoped insight-generation integration if it improves explanations while retaining validation and deterministic fallbacks.
- A more formal deployment pipeline if the project moves beyond a static, hackathon-scale demonstration.

Any future change must preserve the architecture's modular boundaries, deterministic demo mode, and clear distinction between simulation output and real-world prediction.
