import React, { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';

import { arrayMove, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import Container from './Container';

// Drag over a new container
// add to the end 

// Drag over an item in a new continer and styles before over item.
// Active an over are in the same column

// Same column
// Active swap with over

// https://github.com/cssinjs/jss/issues/1344#issuecomment-734402215
const wrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

export default function MultipleContainers() {
  const [items, setItems] = useState({
    root: ["1", "2", "3"],
    container1: ["4", "5", "6"],
    container2: ["7", "8", "9"],
    container3: []
  });

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
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Container id="root" items={items.root} />
        <Container id="container1" items={items.container1} />
        <Container id="container2" items={items.container2} />
        <Container id="container3" items={items.container3} />
      </DndContext>
    </div>
  );



  function findContainerId(idOfItemOrContainer) {
    // if Id is a containerId 
    if (idOfItemOrContainer in items) {
      return idOfItemOrContainer; // return a container
    }

    return Object.keys(items).find((key) => items[key].includes(idOfItemOrContainer));
  }

  // For handle drag item to new container
  function handleDragOver(event) {
    const { active, over } = event;
    const { id: activeId } = active; // item
    const { id: overId } = over; // item in other container, or other container

    // Find the containers
    const activeContainerId = findContainerId(activeId);
    const overContainerId = findContainerId(overId);

    // drag item to a new container only
    if (!activeContainerId || !overContainerId || activeContainerId === overContainerId) {
      return;
    }

    // Over a new container
    if (overId == overContainerId) {

      console.log(`over containerId: ${overContainerId} only`);
      setItems(prev => {

        const activeItems = prev[activeContainerId];
        const overItems = prev[overContainerId];

        //   Find the indexes for the items
        //const activeIndex = activeItems.indexOf(activeId);
        const activeItem = activeItems.find((item) => item == activeId);

        return {
          ...prev,
          [activeContainerId]: activeItems.filter((item) => item !== activeItem),//remove  [ ] to read a value of a key
          [overContainerId]: [...overItems, activeItem] // add to the end of an over container
        };
      })

    } else {

      // over an item in a new container
      console.log(`${activeId} is over itemId: ${overId}`);
      setItems(prev => {

        const activeItems = prev[activeContainerId];
        const overItems = prev[overContainerId];

        //   Find the indexes for the items
        const overIndex = overItems.indexOf(overId);
        const activeItem = activeItems.find((item) => item == activeId);

        console.log(`${activeId} and ${overId} are in the same column`);
        return {
          ...prev,
          [activeContainerId]: activeItems.filter((item) => item !== activeItem),//remove  [ ] to read a value of a key
          [overContainerId]: [
            ...overItems.slice(0, overIndex),
            activeItem,
            ...overItems.slice(overIndex),
          ] // add to the end of an over container
        };
      })
    }
  }

  function handleDragEnd(event) {
    const { active: { id: activeId }, over: { id: overId } } = event;

    const activeContainerId = findContainerId(activeId);
    const overContainerId = findContainerId(overId);

    // If not the same container, return;
    if (!activeContainerId || !overContainerId || activeContainerId !== overContainerId) {
      return;
    }

    // active activeContainer and overContainer are the same
    const activeIndex = items[activeContainerId].indexOf(activeId);
    const overIndex = items[activeContainerId].indexOf(overId);

    if (activeIndex == overIndex) {
      return;
    }

    console.log(`Same column activeId: ${activeId}, index: ${activeIndex} and overId: ${overId} index: ${overIndex}`);

    setItems((prev) => {

      return {
        ...prev,
        [activeContainerId]: arrayMove(items[activeContainerId], activeIndex, overIndex)
      };

    })

  }

}
