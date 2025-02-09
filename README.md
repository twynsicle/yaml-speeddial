# YAML Speed Dial Browser Extension

A browser extension that provides a customizable speed dial page using YAML configuration. This extension allows developers to organize their frequently accessed URLs in a hierarchical structure, making it easy to navigate between different environments and services.

## Overview

YAML Speed Dial is built using modern web technologies to provide a clean and efficient way to organize and access frequently used URLs. It's particularly useful for developers who need quick access to various development environments, services, and tools.

### Key Features

- Hierarchical organization of bookmarks (groups, subgroups, sites)
- YAML-based configuration for easy maintenance
- Real-time YAML validation with error feedback
- Vue.js-powered interface
- Built with Plasmo framework for cross-browser compatibility
- CodeMirror integration for YAML editing with syntax highlighting

## Technologies Used

- Plasmo (v0.86.3) - Browser extension framework
- Vue.js (v3.4.15) - UI framework
- YAML - Configuration format
- CodeMirror - YAML editor integration
- TypeScript - Type-safe development

## Configuration Structure

The speed dial is configured using a YAML file with the following structure:

```yaml
groups:
  - name: group_name
    url: group_url (optional)
    sites:
      - name: site_name
        url: site_url
    subgroups:
      - name: subgroup_name
        sites:
          - name: site_name
            url: site_url
```

### Configuration Elements

- `groups`: Top-level organization units
- `subgroups`: Nested organization units within groups
- `sites`: Individual bookmarks
- `name`: Display name for the group/site
- `url`: Target URL for the bookmark

## Installation

1. Clone the repository
2. Install dependencies: `yarn install`
3. Development: `yarn dev`
4. Build: `yarn build`
5. Package: `yarn package`

## Usage

1. Install the extension in your browser
2. Configure your bookmarks in the `sites.yaml` file
3. Access your speed dial page from the new tab page

## Development

The project uses the following structure:
- `components/` - Vue components
- `sites.yaml` - Main configuration file
- `newtab.vue` - New tab page implementation

### Editor Features

The built-in YAML editor provides:
- Syntax highlighting for YAML
- Real-time validation of YAML syntax
- Immediate error feedback for invalid configurations
- Auto-indentation and formatting
- Configuration persistence with validation
- Prevents saving of invalid YAML configurations
