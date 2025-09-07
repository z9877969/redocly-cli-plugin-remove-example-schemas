const refactorsRefValue = (schemaValue) => {
  if (
    typeof schemaValue === 'object' &&
    schemaValue !== null &&
    !schemaValue.$ref
  ) {
    for (const key in schemaValue) {
      refactorsRefValue(schemaValue[key], key);
    }
    if (schemaValue.properties) {
      for (const propName in schemaValue.properties) {
        const newSchemaValue = schemaValue.properties[propName];
        if (!newSchemaValue.$ref) {
          continue;
        }
        const exmName = schemaValue.properties[propName].$ref
          .split('/')
          .pop()
          .split('.')[0];

        schemaValue.properties[propName] = {
          $ref: `#/components/examples/${exmName}`,
        };
      }
    }
    if (schemaValue.items?.$ref) {
      const exmName = schemaValue.items.$ref.split('/').pop().split('.')[0];
      schemaValue.items = {
        $ref: `#/components/examples/${exmName}`,
      };
    }
  }
};

module.exports = {
  id: 'remove-example-schemas', // Унікальний ID плагіна
  decorators: {
    oas3: {
      // Декоратор, який спрацює після бандлінгу для OpenAPI 3
      'post-bundle': () => {
        return {
          // Ми працюємо з коренем документа
          DefinitionRoot: {
            leave(root) {
              if (!root.components || !root.components.schemas) {
                return;
              }
              for (const schemaName in root.components.schemas) {
                if (schemaName.includes('.exm')) {
                  if (!root.components.examples) {
                    root.components.examples = {};
                  }
                  const exampleKey = schemaName.split('.exm')[0];
                  root.components.examples[exampleKey] =
                    root.components.schemas[schemaName];
                  delete root.components.schemas[schemaName];
                } else {
                  refactorsRefValue(root.components.schemas[schemaName]);
                }
              }
              refactorsRefValue(root.paths);
            },
          },
        };
      },
    },
  },
};
