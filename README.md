# ember-select-dropdown-tree

Render a tree inside the `ember-select` dropdown

## Installation

```bash
ember install ember-select-dropdown-tree
```


## Usage
Basic example:

```handlebars
{{x-select model=model value=value
  dropdown='select-dropdown-tree'
  onSelect=(action 'select')}}
```


*Note*: The component uses `ember-simple-tree` to render the tree
