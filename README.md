# redocly-cli-plugin-remove-example-schemas
A Redocly CLI plugin for managing reusable schema examples. It allows you to define common validation rules and examples in separate files and reference them throughout your OpenAPI definitions using `$ref`.

## File Structure
This plugin operates on a structured directory of example files. Here is a sample layout:
```
swagger/
├── components/
│   └── examples/
│       ├── inctance_1/
│       │   └── inctance1_name.exm.yaml
│       └── inctance_2/
│           └── inctance2_type.exm.yaml
└── path/
    └── instance/
        └── get.yaml
```

## Installation
```
npm i redocly-cli-plugin-remove-example-schemas --save-dev
```

## Usage
### 1. Configure `redocly.yaml`
Add the plugin to your `redocly.yaml` configuration file and activate the decorator.
```
# redocly.yaml
plugins:
  - redocly-cli-plugin-remove-example-schemas

decorators:
  # Activate the decorator by its ID
  'remove-example-schemas/post-bundle': on
```

### 2. Create Reusable Example Files
Create separate YAML files for each reusable example component.

> IMPORTANT!
> File names must end with the .exm.yaml suffix. For better organization, it is also recommended to use a unique prefix > that corresponds to the parent directory's name.

Example: `swagger/components/examples/inctance1/inctance1_name.exm.yaml`
```
type: string
maxLength: 12
example: some name
```

Example: `swagger/components/examples/inctance_2/inctance2_type.exm.yaml`
```
type: string
enum:
  - on
  - off
example: on
```

### 3. Reference Examples in Your OpenAPI Definition
Use `$ref` in your main OpenAPI files to point to the reusable example files.

Example: `swagger/path/instance/get.yaml`

```
responses:
  '200':
    description: 'Successful operation'
    content:
      application/json:
        schema:
          type: object
          description: Instance
          properties:
            name:
              $ref: ../../components/examples/inctance1/inctance1_name.exm.yaml
            type:
              $ref: ../../components/examples/inctance2/inctance2_type.exm.yaml
```

## Build
After correctly referencing all example files in your schemas, build the documentation using the Redocly CLI.
```
redocly bundle -o dist
```