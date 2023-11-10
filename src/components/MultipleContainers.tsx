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
    items: ["1", "2", "3"]
  },
  {
    id: 'container1',
    items: ["4", "5", "6"]
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
        //onDragOver={handleDragOver}
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

  // // For handle drag item to new container
  // function handleDragOver(event) {
  //   const { active, over } = event;
  //   const { id: activeId } = active; // item
  //   const { id: overId } = over; // item in other container, or other container

  //   // Find the containers
  //   const activeContainerId = findContainerId(activeId);
  //   const overContainerId = findContainerId(overId);

  //   // drag item to a new container only
  //   if (!activeContainerId || !overContainerId || activeContainerId === overContainerId) {
  //     return;
  //   }

  //   // Over a new container
  //   if (overId == overContainerId) {

  //     console.log(`over containerId: ${overContainerId} only`);
  //     setItems(prev => {

  //       const activeItems = prev[activeContainerId];
  //       const overItems = prev[overContainerId];

  //       //   Find the indexes for the items
  //       //const activeIndex = activeItems.indexOf(activeId);
  //       const activeItem = activeItems.find((item) => item == activeId);

  //       return {
  //         ...prev,
  //         [activeContainerId]: activeItems.filter((item) => item !== activeItem),//remove  [ ] to read a value of a key
  //         [overContainerId]: [...overItems, activeItem] // add to the end of an over container
  //       };
  //     })

  //   } else {

  //     // over an item in a new container
  //     console.log(`${activeId} is over itemId: ${overId}`);
  //     setItems(prev => {

  //       const activeItems = prev[activeContainerId];
  //       const overItems = prev[overContainerId];

  //       //   Find the indexes for the items
  //       const overIndex = overItems.indexOf(overId);
  //       const activeItem = activeItems.find((item) => item == activeId);

  //       console.log(`${activeId} and ${overId} are in the same Container`);
  //       return {
  //         ...prev,
  //         [activeContainerId]: activeItems.filter((item) => item !== activeItem),//remove  [ ] to read a value of a key
  //         [overContainerId]: [
  //           ...overItems.slice(0, overIndex),
  //           activeItem,
  //           ...overItems.slice(overIndex),
  //         ] // add to the end of an over container
  //       };
  //     })
  //   }
  // }

  function handleDragEnd(event) {

    setActiveContainer(null);
    setActiveItem(null);
    const { active, over } = event;

    const isActiveContainer = active.data.current?.type === "Container";
    const isOverContainer = over.data.current?.type === "Container";

    if (isActiveContainer && isOverContainer) {

      const activeContainerIndex = containers.findIndex((col) => col.id === active.id);
      const overContainerIndex = containers.findIndex((col) => col.id === over.id);

      setContainers((prev) => {
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
      console.log('same container');

      setContainers((prev) => {

        var containerIndex = prev.findIndex(c => c.id == activeContainerId);
        var container = prev[containerIndex];

        var activeIndex = container.items.findIndex(i => i == active.id);
        var overIndex = container.items.findIndex(i => i == over.id);
        container.items = arrayMove(container.items, activeIndex, overIndex);

        return [
          ...prev.slice(0, containerIndex),
          container,
          ...prev.slice(containerIndex + 1)
        ];

      });
    }

  }

}
