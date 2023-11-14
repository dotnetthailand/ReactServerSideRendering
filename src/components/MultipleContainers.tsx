import React, { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';

import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableContainer from './SortableContainer';
import { Container, Item } from './Type';
import SortableItem from './SortableItem';

// Drag over a new container
// add to the end 

// Drag over an item in a new continer and styles before over item.
// Active an over are in the same Container

// Same Container
// Active swap with over

// https://github.com/cssinjs/jss/issues/1344#issuecomment-734402215
const wrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '300px',
  minHeight: '800px',
  flexGrow: 0,
};

var defaultContainers: Container[] = [
  {
    id: 'root',
    items: ["1", "2", "3", "4"]
  },
  {
    id: 'container1',
    items: ["5", "6"]
  }
];

export default function MultipleContainers() {
  const [containers, setContainers] = useState<Container[]>(defaultContainers);

  //  const [activeId, setActiveId] = useState();
  const [activeContainer, setActiveContainer] = useState<Container | null>(null);
  const [activeItem, setActiveItem] = useState<Item | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  return (
    <div style={wrapperStyle}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={containers} strategy={verticalListSortingStrategy}>
          {
            containers.map(container =>
              <SortableContainer key={container.id} id={container.id} container={container} />
            )}
        </SortableContext>
        <DragOverlay
          style={{
            opacity: '70%',
          }}
        >
          {
            activeContainer ? <SortableContainer id={activeContainer.id} container={activeContainer} /> : null
          }
          {
            activeItem ? <SortableItem value={activeItem} /> : null
          }
        </DragOverlay>
      </DndContext>
    </div>
  );

  function handleDragStart(event) {
    if (event.active.data.current?.type === "Container") {
      setActiveContainer(event.active.data.current.value);
      return;
    }

    if (event.active.data.current?.type === "Item") {
      setActiveItem(event.active.data.current.value);
      return;
    }
  }

  function findContainerId(idOfItemOrContainer) {
    // if Id is a containerId 
    var container = containers.find(col => col.id == idOfItemOrContainer);
    if (container) {
      return container.id;
    }

    container = containers.find(col => col.items.some(i => i == idOfItemOrContainer))
    return container.id;
  }

  // For handle drag item over new container:
  // An item over a container
  // An item over an item
  function handleDragOver(event) {
    const { active, over } = event;

    const isActiveItem = active.data.current?.type === "Item";
    const isOverItemOrContainer = ["Item", "Container"].includes(over.data.current?.type);
    if (!isActiveItem || !isOverItemOrContainer) {
      return;
    }

    // Find the containers
    const activeContainerId = findContainerId(active.id);
    const overContainerId = findContainerId(over.id);

    // Drag item over a new container only
    if (activeContainerId === overContainerId) {
      return;
    }

    console.log(`${over.id} - ${overContainerId}`);
    setContainers(prev => {
      var activeContainerIndex = prev.findIndex(c => c.id === activeContainerId);
      var overContainerIndex = prev.findIndex(c => c.id === overContainerId);

      const activeContainer = prev[activeContainerIndex];
      const overContainer = prev[overContainerIndex];

      var activeItemIndex = activeContainer.items.findIndex(i => i === active.id);
      console.log(`activeItemIndex ${activeItemIndex}, activeContainerIndex: ${activeContainerIndex}, overContainerIndex: ${overContainerIndex}`)

      // move item in the current container
      const activeItem = activeContainer.items[activeItemIndex];
      activeContainer.items = activeContainer.items.filter(i => i !== active.id);
      overContainer.items = [...overContainer.items, activeItem]; // Add to the end of an over container

      if (activeContainerIndex < overContainerIndex) {
        console.log('update');
        return [
          ...prev.slice(0, activeContainerIndex),
          activeContainer, // Set the current container with new items.  1
          ...prev.slice(activeContainerIndex + 1, overContainerIndex),
          overContainer,
          ...prev.slice(overContainerIndex + 1),
        ];
      } else {
        return [
          ...prev.slice(0, overContainerIndex),
          overContainer, // Set the current container with new items.  1
          ...prev.slice(overContainerIndex + 1, activeContainerIndex),
          activeContainer,
          ...prev.slice(activeContainerIndex + 1),
        ];
      }
    });
  }

  // Only container over container and
  // items in the same container
  function handleDragEnd(event) {
    setActiveContainer(null);
    setActiveItem(null);

    const { active, over } = event;
    const isActiveContainer = active.data.current?.type === "Container";
    const isOverContainer = over.data.current?.type === "Container";

    if (isActiveContainer && isOverContainer) {

      setContainers((prev) => {
        const activeContainerIndex = containers.findIndex((col) => col.id === active.id);
        const overContainerIndex = containers.findIndex((col) => col.id === over.id);
        return arrayMove(prev, activeContainerIndex, overContainerIndex);
      });

      return;
    }

    const isActiveItem = active.data.current?.type === "Item";
    const isOverItem = over.data.current?.type === "Item";

    const activeContainerId = findContainerId(active.id);
    const overContainerId = findContainerId(over.id);
    const isSameContainer = activeContainerId === overContainerId;

    if (isActiveItem && isOverItem && isSameContainer) {

      setContainers((prev) => {

        var containerIndex = prev.findIndex(c => c.id == activeContainerId);
        var container = prev[containerIndex];

        var activeIndex = container.items.findIndex(i => i == active.id);
        var overIndex = container.items.findIndex(i => i == over.id);
        // move item in the current container
        container.items = arrayMove(container.items, activeIndex, overIndex);

        return [
          ...prev.slice(0, containerIndex), // Get containers before the current container index.
          container, // Set the current container with new items.
          ...prev.slice(containerIndex + 1), // Get containers after the current container index.
        ];
      });
    }
  }
}
