import {
  SimpleTreeItemWrapper,
  SortableTree,
  TreeItemComponentProps,
  TreeItems
} from "dnd-kit-sortable-tree";
import React, { useState } from "react";

export default function MinimalSortableTree() {
  const [items, setItems] = useState(initialViableMinimalData);
  return (
    <SortableTree
      items={items}
      onItemsChanged={setItems}
      TreeItemComponent={MinimalTreeItemComponent}
    />
  );
};

type MinimalTreeItemData = {
  value: string;
};
/*
 * Here's the component that will render a single row of your tree
 */
const MinimalTreeItemComponent = React.forwardRef<HTMLDivElement, TreeItemComponentProps<MinimalTreeItemData>>(
  (props, ref) => (
    /* you could also use FolderTreeItemWrapper if you want to show vertical lines.  */
    <SimpleTreeItemWrapper {...props} ref={ref}>
      <div>{props.item.value}</div>
    </SimpleTreeItemWrapper>
  )
);

/*
 * Configure the tree data.
 */
const initialViableMinimalData: TreeItems<MinimalTreeItemData> = [
  {
    id: '1',
    value: 'Jane',
    children: [
      { id: '4', value: 'John' },
      { id: '5', value: 'Sally' },
    ],
  },
  { id: '2', value: 'Fred', children: [{ id: '6', value: 'Eugene' }] },
  { id: '3', value: 'Helen', canHaveChildren: false },
];
