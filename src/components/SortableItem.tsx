import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function Item(props) {
  const { value } = props;

  const style = {
    width: "100%",
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid black",
    margin: "10px 0",
    background: "white"
  };

  return <div style={style}>{value}</div>;
}

export default function SortableItem({ value }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: value,
    data: {
      type: "Item", // https://docs.dndkit.com/api-documentation/draggable/usedraggable#data
    },
  });

  // const isOverAContainer = over.data.current?.type === "Container";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item value={value} />
    </div>
  );
}
