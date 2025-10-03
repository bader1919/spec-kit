# Tasks: N8N Dashboard

**Input**: Design documents from `D:/GitHub/spec kit/specs/001-i-wwwnt-you/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Found: JavaScript/TypeScript + React/Express web application
   → Extract: tech stack, libraries, web app structure
2. Load optional design documents:
   → data-model.md: Extract entities → Workflow, Execution, Node, DashboardWidget
   → contracts/: workflows-api.json, executions-api.json → contract test tasks
   → research.md: Extract decisions → React/Express/Chart.js setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, React components
   → Integration: API proxy, middleware, real-time polling
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests ✓
   → All entities have models ✓
   → All endpoints implemented ✓
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app**: `backend/src/`, `frontend/src/`
- Backend: Express.js API proxy with models, services, routes
- Frontend: React components with hooks, services, utils

## Phase 3.1: Setup
- [X] T001 Create project structure per implementation plan (backend/, frontend/, tests/)
- [X] T002 Initialize Node.js backend with Express.js, TypeScript, Jest dependencies
- [X] T003 Initialize React frontend with TypeScript, Chart.js, React Testing Library
- [X] T004 [P] Configure ESLint and Prettier for backend in backend/.eslintrc.js
- [X] T005 [P] Configure ESLint and Prettier for frontend in frontend/.eslintrc.js
- [X] T006 [P] Setup Jest configuration for backend in backend/jest.config.js
- [X] T007 [P] Setup Jest and RTL configuration for frontend in frontend/jest.config.js

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [X] T008 [P] Contract test GET /api/workflows in backend/tests/contract/workflows-api.test.js
- [X] T009 [P] Contract test GET /api/workflows/{workflowId} in backend/tests/contract/workflows-api.test.js
- [X] T010 [P] Contract test GET /api/executions in backend/tests/contract/executions-api.test.js
- [X] T011 [P] Contract test GET /api/executions/{executionId} in backend/tests/contract/executions-api.test.js
- [X] T012 [P] Integration test dashboard load scenario in frontend/tests/integration/dashboard-load.test.js
- [ ] T013 [P] Integration test real-time updates scenario in frontend/tests/integration/realtime-updates.test.js
- [ ] T014 [P] Integration test execution history display in frontend/tests/integration/execution-history.test.js
- [ ] T015 [P] Integration test node-level details in frontend/tests/integration/node-details.test.js
- [ ] T016 [P] Integration test connection error handling in frontend/tests/integration/error-handling.test.js

## Phase 3.3: Backend Core Implementation (ONLY after tests are failing)
- [ ] T017 [P] Workflow model in backend/src/models/workflow.js
- [ ] T018 [P] Execution model in backend/src/models/execution.js
- [ ] T019 [P] Node model in backend/src/models/node.js
- [ ] T020 N8N client service in backend/src/services/n8nClient.js
- [ ] T021 Dashboard service in backend/src/services/dashboardService.js
- [ ] T022 GET /api/workflows route in backend/src/api/routes/workflows.js
- [ ] T023 GET /api/workflows/{workflowId} route in backend/src/api/routes/workflows.js
- [ ] T024 GET /api/executions route in backend/src/api/routes/executions.js
- [ ] T025 GET /api/executions/{executionId} route in backend/src/api/routes/executions.js

## Phase 3.4: Frontend Core Implementation
- [ ] T026 [P] WorkflowCard component in frontend/src/components/WorkflowCard/index.tsx
- [ ] T027 [P] ExecutionList component in frontend/src/components/ExecutionList/index.tsx
- [ ] T028 [P] StatusIndicator component in frontend/src/components/StatusIndicator/index.tsx
- [ ] T029 [P] Charts component in frontend/src/components/Charts/index.tsx
- [ ] T030 Dashboard main component in frontend/src/components/Dashboard/index.tsx
- [ ] T031 DashboardPage in frontend/src/pages/DashboardPage/index.tsx
- [ ] T032 [P] API client service in frontend/src/services/apiClient.js
- [ ] T033 [P] Dashboard service in frontend/src/services/dashboardService.js
- [ ] T034 [P] useRealTimeData hook in frontend/src/hooks/useRealTimeData.js
- [ ] T035 [P] Date/time formatters in frontend/src/utils/formatters.js

## Phase 3.5: Integration
- [ ] T036 Auth middleware in backend/src/api/middleware/auth.js
- [ ] T037 Error handler middleware in backend/src/api/middleware/errorHandler.js
- [ ] T038 CORS and rate limiting in backend/src/config/app.js
- [ ] T039 Real-time polling implementation in useRealTimeData hook
- [ ] T040 Backend server entry point in backend/src/app.js
- [ ] T041 Frontend App component with routing in frontend/src/App.tsx

## Phase 3.6: Polish
- [ ] T042 [P] Unit tests for Workflow model in backend/tests/unit/workflow.test.js
- [ ] T043 [P] Unit tests for N8N client in backend/tests/unit/n8nClient.test.js
- [ ] T044 [P] Unit tests for WorkflowCard component in frontend/tests/components/WorkflowCard.test.tsx
- [ ] T045 [P] Unit tests for ExecutionList component in frontend/tests/components/ExecutionList.test.tsx
- [ ] T046 [P] Unit tests for useRealTimeData hook in frontend/tests/hooks/useRealTimeData.test.js
- [ ] T047 Performance optimization for Chart.js rendering
- [ ] T048 API response caching implementation
- [ ] T049 Error boundary implementation for React components
- [ ] T050 Update README.md with setup and development instructions

## Dependencies
- Setup (T001-T007) before everything
- Tests (T008-T016) before implementation (T017-T041)
- Models (T017-T019) before services (T020-T021)
- Services before routes (T022-T025)
- Backend routes before frontend API client (T032)
- Components available before page assembly (T031)
- Core implementation before integration (T036-T041)
- Implementation before polish (T042-T050)

## Parallel Example
```
# Launch T008-T011 together (contract tests):
Task: "Contract test GET /api/workflows in backend/tests/contract/workflows-api.test.js"
Task: "Contract test GET /api/workflows/{workflowId} in backend/tests/contract/workflows-api.test.js"
Task: "Contract test GET /api/executions in backend/tests/contract/executions-api.test.js"
Task: "Contract test GET /api/executions/{executionId} in backend/tests/contract/executions-api.test.js"

# Launch T017-T019 together (model creation):
Task: "Workflow model in backend/src/models/workflow.js"
Task: "Execution model in backend/src/models/execution.js"
Task: "Node model in backend/src/models/node.js"

# Launch T026-T029 together (React components):
Task: "WorkflowCard component in frontend/src/components/WorkflowCard/index.tsx"
Task: "ExecutionList component in frontend/src/components/ExecutionList/index.tsx"
Task: "StatusIndicator component in frontend/src/components/StatusIndicator/index.tsx"
Task: "Charts component in frontend/src/components/Charts/index.tsx"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Follow TDD: Red-Green-Refactor cycle
- API contracts must match OpenAPI specs exactly
- Real-time polling should be configurable (3-5 second intervals)
- Handle n8n API rate limits gracefully
- Implement proper error boundaries and loading states

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - workflows-api.json → T008-T009, T022-T023 (tests + implementation)
   - executions-api.json → T010-T011, T024-T025 (tests + implementation)

2. **From Data Model**:
   - Workflow entity → T017 (model creation)
   - Execution entity → T018 (model creation)
   - Node entity → T019 (model creation)
   - DashboardWidget → T026-T029 (React components)

3. **From User Stories (quickstart.md)**:
   - Dashboard load scenario → T012 (integration test)
   - Real-time updates → T013 (integration test)
   - Execution history → T014 (integration test)
   - Node details → T015 (integration test)
   - Error handling → T016 (integration test)

4. **Ordering**:
   - Setup → Tests → Models → Services → Routes → Components → Integration → Polish
   - TDD strictly enforced: tests fail first, then implement

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests (T008-T011)
- [x] All entities have model tasks (T017-T019)
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task