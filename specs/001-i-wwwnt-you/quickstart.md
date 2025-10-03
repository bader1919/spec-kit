# Quickstart: N8N Dashboard

## Integration Test Scenarios

### Scenario 1: Dashboard Load and Workflow Display
**Given** the n8n instance is running with active workflows
**When** the user opens the dashboard
**Then** the dashboard loads within 2 seconds
**And** displays current status of all workflows
**And** shows workflow cards with names, statuses, and last execution times

**Test Steps:**
1. Start n8n instance with test workflows
2. Configure dashboard with n8n API credentials
3. Navigate to dashboard URL
4. Verify workflow cards are displayed
5. Verify each card shows: name, status, last execution time
6. Verify status indicators use correct colors (green=success, red=error, blue=running)

### Scenario 2: Real-time Execution Updates
**Given** the dashboard is loaded and displaying workflows
**When** a workflow execution starts in n8n
**Then** the dashboard updates within 5 seconds
**And** shows the workflow status as "running"
**And** updates the execution count

**Test Steps:**
1. Load dashboard with existing workflows
2. Trigger workflow execution in n8n
3. Wait maximum 5 seconds
4. Verify workflow status changes to "running"
5. Verify execution count increments
6. Wait for execution completion
7. Verify status updates to "success" or "error"

### Scenario 3: Execution History Display
**Given** workflows have completed executions
**When** the user views the execution history
**Then** the last 5 executions are displayed
**And** each execution shows timestamp, status, and duration
**And** executions are ordered by most recent first

**Test Steps:**
1. Ensure at least 5 workflow executions exist
2. Load dashboard
3. Locate execution history section
4. Verify exactly 5 executions are shown (or fewer if less than 5 exist)
5. Verify each execution displays: timestamp, status, duration
6. Verify chronological ordering (newest first)

### Scenario 4: Node-level Execution Details
**Given** an execution has completed with multiple nodes
**When** the user clicks on an execution
**Then** detailed node information is displayed
**And** shows each node's status, processing time, and any errors

**Test Steps:**
1. Create workflow with multiple nodes (trigger + 2-3 actions)
2. Execute workflow and wait for completion
3. Click on execution in dashboard
4. Verify node details panel opens
5. Verify each node shows: name, type, status, execution time
6. For failed nodes, verify error message is displayed

### Scenario 5: Connection Error Handling
**Given** the dashboard is running
**When** the n8n instance becomes unavailable
**Then** the dashboard displays a connection error message
**And** continues attempting to reconnect
**And** recovers automatically when n8n is available

**Test Steps:**
1. Load dashboard with working n8n connection
2. Stop n8n instance
3. Wait for next polling cycle (3-5 seconds)
4. Verify error message appears: "Unable to connect to n8n instance"
5. Verify dashboard doesn't crash or become unresponsive
6. Restart n8n instance
7. Verify dashboard automatically reconnects within 10 seconds
8. Verify workflow data reappears

### Scenario 6: Authentication Failure Handling
**Given** the dashboard is configured with n8n credentials
**When** the API key becomes invalid
**Then** the dashboard displays an authentication error
**And** prompts user to update credentials

**Test Steps:**
1. Configure dashboard with valid n8n API key
2. Verify dashboard loads successfully
3. Change or revoke API key in n8n
4. Wait for next API call
5. Verify authentication error message: "Invalid API credentials"
6. Verify user is prompted to update API key
7. Update with valid credentials
8. Verify dashboard resumes normal operation

### Scenario 7: Performance with Multiple Workflows
**Given** n8n instance has 10+ active workflows
**When** the dashboard loads
**Then** all workflows are displayed within 3 seconds
**And** real-time updates continue to work smoothly
**And** browser memory usage remains stable

**Test Steps:**
1. Set up n8n with 15 different workflows
2. Activate all workflows
3. Load dashboard and measure load time
4. Verify all 15 workflows appear within 3 seconds
5. Trigger multiple workflows simultaneously
6. Monitor dashboard for 5 minutes
7. Verify smooth updates and stable performance
8. Check browser memory usage (should not exceed 100MB)

## Manual Testing Checklist

### Visual Components
- [ ] Workflow cards display correctly with proper styling
- [ ] Status indicators use consistent color scheme
- [ ] Charts render without visual artifacts
- [ ] Dashboard is responsive on different screen sizes
- [ ] Loading states are clearly indicated

### Data Accuracy
- [ ] Workflow names match n8n interface
- [ ] Execution times are accurate (within 1 second)
- [ ] Success/failure counts are correct
- [ ] Node execution order follows workflow logic
- [ ] Error messages match actual n8n errors

### User Experience
- [ ] Dashboard loads quickly (under 2 seconds)
- [ ] Real-time updates are noticeable but not jarring
- [ ] Error states provide helpful information
- [ ] Navigation is intuitive and responsive
- [ ] Data refresh doesn't cause flickering

### Error Scenarios
- [ ] Network disconnection handled gracefully
- [ ] Invalid API credentials show clear error
- [ ] Malformed n8n responses don't crash dashboard
- [ ] Rate limiting shows appropriate warning
- [ ] Partial data loads when some API calls fail

## Performance Benchmarks

### Load Time Targets
- Initial dashboard load: < 2 seconds
- Workflow data refresh: < 500ms
- Node detail display: < 200ms
- Error recovery time: < 10 seconds

### Resource Usage Limits
- Browser memory: < 100MB for 20 workflows
- API calls: Max 1 per second to n8n
- CPU usage: < 5% during normal operation
- Network bandwidth: < 10KB/s for polling

### Scalability Thresholds
- Max workflows displayed: 50
- Max executions per workflow: 5 (recent only)
- Max nodes per execution: 100
- Data retention: Current session only (no persistence)