import React from 'react';
// import { useDroppable } from '@dnd-kit/core';

import { CSS } from '@dnd-kit/utilities';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import SortableItem from './SortableItem';


export default function SortableContainer(props) {
  const { id, container } = props;
  //const { setNodeRef: droppableNodeRef } = useDroppable({ id });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id,
    data: {
      type: "Container", // https://docs.dndkit.com/api-documentation/draggable/usedraggable#data
      value: container
    },
  });

  const containerStyle = {
    background: "#dadada",
    padding: 10,
    margin: 10,
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <SortableContext
      id={id}
      items={container.items}
      strategy={verticalListSortingStrategy}
    >
      <div data-id={id} ref={setNodeRef} style={containerStyle} {...attributes} {...listeners}>
        {container.items.map((value) => (
          <SortableItem key={value} value={value} />
        ))}
      </div>
    </SortableContext>
  );
}
