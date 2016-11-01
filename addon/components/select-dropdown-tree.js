import Ember from 'ember';
import layout from '../templates/components/select-dropdown-tree';
import SelectDropdown from 'ember-select/components/select-dropdown';
import { buildTree, getDescendents } from 'ember-select/utils/tree';
import { bringInView } from 'ember-select/utils/view';

const {
  A,
  computed,
  get,
  isEmpty,
  isNone,
  isPresent,
  run
} = Ember;

export default SelectDropdown.extend({
  layout,
  list: null,
  tree: null,

  didReceiveAttrs(attrs) {
    // Don't do any work if model hasn't changed
    let { oldAttrs, newAttrs } = attrs;
    if (oldAttrs && oldAttrs.model.value === newAttrs.model.value) {
      return;
    }

    this._super(...arguments);

    let model = this.get('model');
    let options = {
      isExpanded: get(model, 'length') < 20,
      labelKey: this.get('labelKey'),
      valueKey: this.get('valueKey')
    };

    let tree = buildTree(model, options);
    let list = getDescendents(tree);

    if (!options.isExpanded) {
      // Expand roots if tree is not expanded
      list.filter(x => isNone(get(x, 'parentId')))
        .forEach(x => x.set('isExpanded', true));
    }

    this.setProperties({ tree, list });
  },

  branches: computed('token', 'model.[]', 'values.[]', function() {
    this.filterModel();

    return this.get('tree');
  }),

  // Down: 40, Up: 38
  move(list, selected, direction) {
    if (isPresent(selected)) {
      selected.set('isSelected', false);
    }

    if (isEmpty(list)) {
      return;
    }

    let node;

    if (direction === 38) {
      if (isPresent(selected)) {
        node = this.findPrevNode(list, selected);
      }

      if (isNone(node)) {
        node = list[list.length - 1];
      }
    } else if (direction === 40) {
      if (isPresent(selected)) {
        node = this.findNextNode(list, selected);
      }

      if (isNone(node)) {
        node = list[0];
      }
    }

    this.set('selected', node);
    node.set('isSelected', true);

    run.next(this, bringInView, '.es-options', '.tree-highlight');
  },

  findNextNode(list, node) {
    if (node.get('isExpanded') && node.children.isAny('isVisible')) {
      return node.children.findBy('isVisible');
    }

    return this.findNextSibling(list, node);
  },

  findNextSibling(list, node) {
    let parentId = node.get('parentId');
    if (isNone(parentId)) {
      return;
    }

    let parent = A(list).findBy('id', node.get('parentId'));
    let index = parent.children.indexOf(node);
    let sibling = parent.children[index + 1];

    if (sibling) {
      if (sibling.get('isVisible')) {
        return sibling;
      } else {
        return this.findNextSibling(list, sibling);
      }
    }

    return this.findNextSibling(list, parent);
  },

  findLastNode(list, node) {
    if (node.get('isExpanded')) {
      let children = node.children
        .filterBy('isVisible');
      let child = children[children.length - 1];

      if (child) {
        return this.findLastNode(list, child);
      }
    }

    return node;
  },

  findPrevNode(list, node) {
    let parentId = node.get('parentId');
    if (isNone(parentId)) {
      return;
    }

    let parent = A(list).findBy('id', parentId);
    let index = parent.children.indexOf(node);
    let sibling = parent.children[index - 1];

    if (sibling) {
      if (sibling.get('isVisible')) {
        return this.findLastNode(list, sibling);
      } else {
        return this.findPrevNode(list, sibling);
      }
    }

    return parent;
  },

  getAncestors(tree, node) {
    let ancestors = A();
    let parentId = get(node, 'parentId');

    if (isPresent(parentId)) {
      let ancestor = tree.findBy('id', parentId);

      if (isPresent(ancestor)) {
        ancestors.pushObject(ancestor);
        ancestors.unshiftObjects(this.getAncestors(tree, ancestor));
      }
    }

    return ancestors;
  },

  setVisibility(list, token) {
    list
      .filter(el => get(el, 'name').toLowerCase().indexOf(token) > -1)
      .forEach(el => {
        el.set('isExpanded', true);
        el.set('isVisible', true);

        let ancestors = this.getAncestors(list, el);
        ancestors.setEach('isExpanded', true);
        ancestors.setEach('isVisible', true);
      });
  }
});
