# Data Model: N8N Dashboard

## Core Entities

### Workflow
Represents an n8n automation workflow with current status and metadata.

**Attributes:**
- `id`: string - Unique workflow identifier from n8n
- `name`: string - User-defined workflow name
- `active`: boolean - Whether workflow is currently active/enabled
- `status`: enum - Current execution status (idle, running, error, disabled)
- `lastExecutionTime`: Date - Timestamp of most recent execution
- `lastExecutionStatus`: enum - Result of last execution (success, error, cancelled, running)
- `executionCount`: number - Total number of executions
- `errorCount`: number - Total number of failed executions
- `averageExecutionTime`: number - Average execution duration in milliseconds

**Validation Rules:**
- `id` must be non-empty string
- `name` must be 1-100 characters
- `status` must be one of: idle, running, error, disabled
- `lastExecutionStatus` must be one of: success, error, cancelled, running
- `executionCount` and `errorCount` must be non-negative integers
- `averageExecutionTime` must be positive number or null

**State Transitions:**
- idle → running (when workflow execution starts)
- running → idle/error (when workflow execution completes)
- active ↔ disabled (when user enables/disables workflow)

### Execution
Represents a single run of a workflow with detailed execution information.

**Attributes:**
- `id`: string - Unique execution identifier from n8n
- `workflowId`: string - Reference to parent workflow
- `status`: enum - Execution status (running, success, error, cancelled)
- `startTime`: Date - When execution began
- `endTime`: Date | null - When execution completed (null if still running)
- `duration`: number | null - Execution time in milliseconds
- `mode`: string - Execution mode (manual, trigger, webhook, etc.)
- `retryOf`: string | null - Reference to execution being retried
- `errorMessage`: string | null - Error details if execution failed

**Validation Rules:**
- `id` and `workflowId` must be non-empty strings
- `status` must be one of: running, success, error, cancelled
- `startTime` is required
- `endTime` must be after `startTime` if present
- `duration` must be positive number if execution completed
- `mode` must be valid n8n execution mode

**Relationships:**
- Belongs to one Workflow (workflowId foreign key)
- Contains multiple Nodes (execution context)

### Node
Represents individual steps within a workflow execution with processing details.

**Attributes:**
- `name`: string - Node identifier within workflow
- `type`: string - Node type (trigger, action, condition, etc.)
- `executionStatus`: enum - Node execution status (success, error, skipped, running)
- `startTime`: Date | null - When node execution began
- `endTime`: Date | null - When node execution completed
- `executionTime`: number | null - Node processing time in milliseconds
- `inputData`: object | null - Input data received by node
- `outputData`: object | null - Output data produced by node
- `errorDetails`: string | null - Error message if node failed

**Validation Rules:**
- `name` and `type` must be non-empty strings
- `executionStatus` must be one of: success, error, skipped, running
- `endTime` must be after `startTime` if both present
- `executionTime` must be positive number if node completed
- `inputData` and `outputData` must be valid JSON objects

**Relationships:**
- Belongs to one Execution context
- May reference other Nodes (workflow connections)

### DashboardWidget
Represents visual components displaying workflow and execution data.

**Attributes:**
- `id`: string - Unique widget identifier
- `type`: enum - Widget type (workflow_status, execution_history, performance_chart, error_summary)
- `title`: string - Display title for widget
- `configuration`: object - Widget-specific settings and filters
- `position`: object - Layout position (x, y, width, height)
- `refreshInterval`: number - Data refresh frequency in seconds
- `visible`: boolean - Whether widget is currently displayed

**Validation Rules:**
- `type` must be one of: workflow_status, execution_history, performance_chart, error_summary
- `title` must be 1-50 characters
- `refreshInterval` must be 1-300 seconds
- `position` must contain valid x, y, width, height numbers

**State Transitions:**
- visible ↔ hidden (user toggles widget display)
- Configuration changes trigger data refresh

## Entity Relationships

```
Workflow (1) ←→ (many) Execution
    ↓                    ↓
Execution (1) ←→ (many) Node

DashboardWidget (independent, displays aggregated data from above entities)
```

## Data Flow Patterns

### Real-time Data Updates
1. Backend polls n8n API every 3-5 seconds
2. Fetches workflow status and recent executions
3. Transforms n8n response to internal data model
4. Frontend components subscribe to data updates
5. Dashboard widgets re-render with new data

### Error State Handling
- Workflow status = "error" when last execution failed
- Execution status = "error" with errorMessage details
- Node executionStatus = "error" with errorDetails
- Dashboard gracefully displays partial data on API failures

### Data Aggregation
- Workflow averageExecutionTime calculated from recent executions
- Success rate computed as (executionCount - errorCount) / executionCount
- Performance trends derived from execution duration history
- Node-level performance aggregated across executions

## Performance Considerations

### Data Volume
- Display maximum 5 recent executions per workflow
- Node details limited to current/selected execution
- Historical data aggregated, not stored in detail
- API responses cached for 2-3 seconds to reduce n8n load

### Memory Management
- Frontend state limited to currently visible data
- Background executions purged from local state
- Large node input/output data truncated for display
- Pagination for workflows if user has >20 active workflows