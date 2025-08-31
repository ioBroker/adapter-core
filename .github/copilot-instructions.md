# GitHub Copilot Instructions for ioBroker Adapter Core

## Project Overview

This is the **@iobroker/adapter-core** library - a TypeScript module that serves as the core bridge between ioBroker adapters and the js-controller. It replaces the legacy `utils.js` from template adapters and provides essential utilities for adapter development in the ioBroker ecosystem.

### Key Purpose
- **Bridge to js-controller**: Acts as the primary interface layer between adapters and the ioBroker js-controller
- **Utility provider**: Offers standardized utility functions for common adapter operations
- **Type safety**: Provides comprehensive TypeScript definitions for adapter development
- **Compatibility layer**: Handles version differences between js-controller versions

## Architecture & Design Principles

### Core Components
- **utils.ts**: Controller directory resolution and adapter constructor
- **index.ts**: Main entry point exposing public API
- **controllerTools.ts**: Utility functions from js-controller
- **i18n.ts**: Internationalization support
- **TokenRefresher.ts**: OAuth2 token management
- **exitCodes.ts**: Standardized exit codes for adapters

### Design Principles
1. **Minimal dependencies**: Keep external dependencies to absolute minimum
2. **Backward compatibility**: Maintain compatibility across js-controller versions
3. **Type safety**: Comprehensive TypeScript types for all public APIs
4. **Dual output**: Support both ESM and CommonJS modules
5. **Adapter-first**: Design APIs from adapter developer perspective

## Code Standards & Conventions

### TypeScript Guidelines
- Use strict TypeScript configuration
- Prefer explicit typing over `any`
- Use generics for flexible, type-safe APIs (see `AdapterInstance<HasObjectsCache, HasStatesCache>`)
- Export types and interfaces for public consumption
- Use `@iobroker/types` for ioBroker-specific type definitions

### Code Style
- Follow existing ESLint configuration (`@iobroker/eslint-config`)
- Use ES modules syntax (`import`/`export`)
- Prefer `const` over `let` where possible
- Use descriptive function and variable names
- Add JSDoc comments for public APIs

### File Organization
```
src/
├── index.ts           # Main entry point and public API
├── utils.ts           # Core utilities and adapter constructor
├── controllerTools.ts # js-controller utility functions
├── i18n.ts           # Internationalization
├── TokenRefresher.ts # OAuth2 functionality
├── exitCodes.ts      # Exit code definitions
└── helpers.ts        # Internal helper functions
```

## Testing Requirements

### Test Structure
- **Type declarations**: Validate TypeScript types compile correctly
- **I18n functionality**: Test translation and localization features
- **Unit tests**: Use Mocha with custom setup in `test/mocha.setup.js`
- **Integration tests**: Test against different js-controller versions when possible

### Testing Patterns
```typescript
// Type declaration tests go in test/types/
// Runtime tests use Mocha in test/ directory
// Follow existing test patterns in testI18n.js
```

### Test Commands
- `npm test`: Run all tests (declarations + i18n)
- `npm run test:declarations`: TypeScript compilation tests
- `npm run test:i18n`: Runtime functionality tests

## Build Process

### Dual Output System
The project builds to both ESM and CommonJS:
```
build/
├── esm/          # ES modules output
└── cjs/          # CommonJS output
```

### Build Commands
- `npm run build`: Full clean build
- `npm run watch`: Watch mode for development
- `npm run lint`: ESLint checking

### Build Pipeline
1. **prebuild**: Clean previous build (`rimraf ./build`)
2. **build**: TypeScript compilation to ESM
3. **postbuild**: Convert ESM to CJS and copy type definitions

## ioBroker-Specific Patterns

### js-controller Compatibility
```typescript
// Handle multiple js-controller versions
function resolveAdapterConstructor(): any {
    // Multiple fallback attempts for different controller versions
    // Attempt 1: JS-Controller 6+ with ESM exports
    // Attempt 2: JS-Controller 6+ with CJS exports  
    // Attempt 3: JS-Controller 4.1+ with CJS
    // etc.
}
```

### Adapter Instance Types
```typescript
// Use generics for cache configuration
export interface AdapterInstance<
    HasObjectsCache extends boolean | undefined = undefined,
    HasStatesCache extends boolean | undefined = undefined
> extends ioBroker.Adapter {
    // Type-safe cache properties based on configuration
}
```

### Common Utilities
```typescript
// File path utilities
getAbsoluteDefaultDataDir(): string
getAbsoluteInstanceDataDir(adapter: ioBroker.Adapter | string): string

// Standard exit codes
EXIT_CODES.ADAPTER_REQUESTED_TERMINATION
```

## Development Guidelines

### Adding New Features
1. **Maintain compatibility**: New features should not break existing adapters
2. **Update types**: Add TypeScript definitions for all new public APIs
3. **Test coverage**: Add appropriate tests for new functionality
4. **Documentation**: Update README.md if adding public APIs

### Common Patterns to Follow
- Use `resolveNamedModule()` for accessing js-controller internals
- Handle multiple js-controller versions gracefully
- Prefer type-safe generics over runtime type checking
- Use absolute paths for internal imports
- Export utilities through main index.ts

### Performance Considerations
- Lazy-load heavy dependencies when possible
- Cache controller directory resolution
- Minimize synchronous file operations
- Avoid blocking the event loop in utility functions

## Error Handling

### Exit Codes
Use standardized exit codes from `exitCodes.ts`:
```typescript
adapter.terminate('reason', utils.EXIT_CODES.ADAPTER_REQUESTED_TERMINATION);
```

### Error Patterns
- Fail fast for critical errors (missing js-controller)
- Provide helpful error messages with context
- Use appropriate exit codes for different failure scenarios
- Log errors before terminating when possible

## Dependencies & Compatibility

### Peer Dependencies
- `@iobroker/types`: For TypeScript definitions
- Compatible with Node.js >=16

### js-controller Versions
Support multiple js-controller versions:
- Legacy: <= 4.0 (`lib/adapter.js`)
- Current: 4.1+ (`build/lib/adapter.js`)  
- Modern: 6+ (`build/cjs/lib/adapter.js`)

### Breaking Changes
- Avoid breaking changes in minor/patch releases
- Document migration paths for major version updates
- Maintain backward compatibility for at least 2 major js-controller versions

## Common Gotchas

1. **Module Resolution**: js-controller location varies by installation and version
2. **Dual Builds**: Ensure compatibility between ESM and CJS outputs
3. **Type Imports**: Use proper import paths for TypeScript definitions
4. **Path Handling**: Always use `path.join()` for cross-platform compatibility
5. **Controller Tools**: Not all tools are available in all js-controller versions

## Examples

### Adding a New Utility Function
```typescript
// In controllerTools.ts
export function newUtilityFunction(param: string): ReturnType {
    // Implementation with proper error handling
    // Support multiple js-controller versions if needed
}

// Export in commonTools object
export const commonTools = {
    // existing tools...
    newUtilityFunction,
};
```

### Type-Safe API Design
```typescript
// Use generics for flexible, type-safe APIs
export interface MyConfig<T extends boolean = false> {
    enabled: T;
    data: T extends true ? RequiredData : OptionalData;
}
```