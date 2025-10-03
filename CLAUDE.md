# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Spec Kit** - a specification-driven development framework that enforces structured feature development through constitutional principles. The framework uses PowerShell scripts and markdown templates to guide development from initial specification through implementation.

## Core Architecture

### Constitutional Development
- All development is governed by principles defined in `.specify/memory/constitution.md`
- Constitutional compliance is enforced at key checkpoints during the development workflow
- Features must justify any constitutional violations in their complexity tracking

### Workflow Structure
The framework follows a strict 6-phase development process:

1. **Feature Specification** (`/specify`) - Create spec.md from natural language description
2. **Clarification** (`/clarify`) - Resolve ambiguities with targeted questions
3. **Implementation Planning** (`/plan`) - Generate technical design and artifacts
4. **Task Generation** (`/tasks`) - Create actionable task breakdown
5. **Analysis** (`/analyze`) - Cross-artifact consistency validation
6. **Implementation** (`/implement`) - Execute tasks following TDD principles

### Directory Structure
```
specs/[###-feature-name]/          # Feature-specific artifacts
├── spec.md                        # Requirements and user stories
├── plan.md                        # Technical design and architecture
├── research.md                    # Technical decisions and rationale
├── data-model.md                  # Entity definitions and relationships
├── quickstart.md                  # Integration scenarios
├── contracts/                     # API specifications and tests
└── tasks.md                       # Actionable implementation tasks

.specify/                          # Framework configuration
├── memory/constitution.md         # Project principles and governance
├── templates/                     # Markdown templates for artifacts
└── scripts/powershell/           # Automation scripts

.claude/commands/                  # Slash command definitions
├── specify.md, plan.md, etc.     # Individual command workflows
```

## Development Commands

### Primary Workflow Commands
Use these slash commands for structured feature development:

- `/specify [description]` - Create initial feature specification
- `/clarify` - Resolve specification ambiguities (run before /plan)
- `/plan [context]` - Generate implementation plan and design artifacts
- `/tasks [context]` - Create actionable task breakdown
- `/analyze` - Validate cross-artifact consistency
- `/implement [context]` - Execute implementation tasks

### Support Commands
- `/constitution` - Create or update project principles

## Key Development Principles

### Test-First Development (TDD)
- Tests MUST be written before implementation
- Contract tests, integration tests, and unit tests follow strict ordering
- Tasks are marked [P] for parallel execution when files don't conflict

### Feature Branch Workflow
- Features use numbered branches: `001-feature-name`
- Each feature gets its own specs directory
- PowerShell scripts handle branch management and path resolution

### Parallel Task Execution
- Tasks marked with [P] can run in parallel (different files, no dependencies)
- Sequential dependencies are explicitly documented
- TDD ordering: Setup → Tests → Models → Services → Endpoints → Polish

## Script Usage

All automation scripts are in `.specify/scripts/powershell/`:

- `check-prerequisites.ps1 -Json` - Validate environment and get paths
- `create-new-feature.ps1 -Json` - Initialize new feature branch
- `setup-plan.ps1 -Json` - Prepare planning environment
- `update-agent-context.ps1 -AgentType claude` - Update this CLAUDE.md file

## File Templates

The framework uses structured templates in `.specify/templates/`:
- `spec-template.md` - Feature specification format
- `plan-template.md` - Implementation planning structure
- `tasks-template.md` - Task breakdown format
- `agent-file-template.md` - Agent context file template

## Best Practices

### When Working with Specifications
- Always run `/clarify` before `/plan` to reduce rework
- Mark ambiguities with `[NEEDS CLARIFICATION: specific question]`
- Focus on WHAT users need, not HOW to implement

### When Creating Implementation Plans
- Extract all NEEDS CLARIFICATION items in Technical Context
- Follow constitutional principles during design
- Generate concrete file paths and structures

### When Executing Tasks
- Follow exact task ordering and dependencies
- Mark tasks complete in tasks.md as [X] when finished
- Respect [P] parallel execution markers
- Validate tests fail before implementing features

## Error Handling

If scripts fail or artifacts are missing:
- Check that you're on a numbered feature branch (001-feature-name)
- Verify git repository status
- Run prerequisite commands in correct order
- Use `-Json` flag for machine-readable script output
