import React from 'react'
import Container from './Container'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// react-dnd 16.0.0 is causing "Module not found: Error: Can't resolve 'react/jsx-runtime'" #3423
// https://github.com/react-dnd/react-dnd/issues/3423#issuecomment-1184043215
export default function SortableList() {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Container />
      </DndProvider>
    </div>
  )
}
