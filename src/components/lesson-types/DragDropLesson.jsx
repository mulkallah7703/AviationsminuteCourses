import { useMemo, useState } from 'react'

export function DragDropLesson({ content }) {
  const [dropped, setDropped] = useState({})
  const [draggedId, setDraggedId] = useState(null)

  const unassignedItems = useMemo(
    () => content.items.filter((item) => !Object.values(dropped).flat().includes(item.id)),
    [content.items, dropped],
  )

  const assignItem = (category, itemId) => {
    setDropped((current) => {
      const next = {}
      for (const key of content.categories) {
        next[key] = (current[key] || []).filter((id) => id !== itemId)
      }
      next[category] = [...(next[category] || []), itemId]
      return next
    })
  }

  return (
    <div className="lesson-grid single">
      <div className="soft-card">
        <h4>{content.prompt}</h4>
        <div className="drag-bank">
          {unassignedItems.map((item) => (
            <button
              key={item.id}
              type="button"
              draggable
              onDragStart={() => setDraggedId(item.id)}
              className="drag-item"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="drop-zones">
          {content.categories.map((category) => (
            <div
              key={category}
              className="drop-zone"
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => draggedId && assignItem(category, draggedId)}
            >
              <h5>{category}</h5>
              {(dropped[category] || []).map((id) => {
                const item = content.items.find((entry) => entry.id === id)
                return (
                  <div key={id} className="dropped-chip">
                    {item?.label}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
