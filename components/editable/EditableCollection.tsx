'use client';
import React from 'react';
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useLang, useStore, useValue } from '@/lib/store';
import type { Path } from '@/lib/paths';
import { useConfirm } from './Confirm';
import { EditableText } from './EditableText';

type Item = { id: string };
type RenderArgs<T> = { item: T; index: number; path: Path; controls: React.ReactNode };
type Props<T extends Item> = {
  path: Path;                                  // path to an array of { id, ... }
  factory: () => T;                            // creates a new blank item (ids auto-generated)
  render: (a: RenderArgs<T>) => React.ReactNode;
  addLabel: { en: string; ar: string };
  itemName: { en: string; ar: string };        // used in delete confirmation
  className?: string;                          // wrapper (grid/flex) classes
  itemClassName?: string;
  emptyLabelPath?: Path;                       // editable empty-state copy
  inline?: boolean;                            // chip-style add button
};

/**
 * THE collection primitive (§1). Works at any nesting depth: renders items, in Edit Mode adds
 * drag-reorder, per-item toolbar (Duplicate · Delete · Move), and an in-context "+ Add" at the natural insertion point.
 * Empty state is first-class and itself editable.
 */
export function EditableCollection<T extends Item>({ path, factory, render, addLabel, itemName, className = '', itemClassName = '', emptyLabelPath, inline }: Props<T>) {
  const items = (useValue<T[]>(path) ?? []) as T[];
  const { editMode, addItem, removeItem, moveItem, duplicateItem } = useStore();
  const { t, lang } = useLang();
  const confirm = useConfirm();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  if (!editMode) {
    if (items.length === 0) return null; // public: empty collections simply don't render
    return <div className={className}>{items.map((item, index) => <div key={item.id} className={itemClassName}>{render({ item, index, path: [...path, index], controls: null })}</div>)}</div>;
  }

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === active.id); const to = items.findIndex((i) => i.id === over.id);
    if (from >= 0 && to >= 0) moveItem(path, from, to);
  };
  const del = async (index: number) => { if (await confirm({ en: `Delete this ${itemName.en}?`, ar: `حذف ${itemName.ar}؟` })) removeItem(path, index); };

  const addBtn = (
    <button type="button" onClick={() => addItem(path, factory)} className={inline ? 'add-chip' : 'add-block'}>
      <span aria-hidden>+</span> {t(addLabel)}
    </button>
  );

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
        <div className={className}>
          {items.length === 0 && (
            <div className="empty-state col-span-full">
              {emptyLabelPath ? <EditableText path={emptyLabelPath} /> : <span>{lang === 'ar' ? 'لا يوجد شيء بعد — أضف عنصرًا' : 'Nothing here yet — add one'}</span>}
            </div>
          )}
          {items.map((item, index) => (
            <SortableItem key={item.id} id={item.id} className={itemClassName}
              toolbar={(handle) => (
                <div className="item-toolbar" contentEditable={false}>
                  <button type="button" className="tb" title={lang === 'ar' ? 'اسحب لإعادة الترتيب' : 'Drag to reorder'} {...handle}>⋮⋮</button>
                  <button type="button" className="tb" title={lang === 'ar' ? 'تكرار' : 'Duplicate'} onClick={() => duplicateItem(path, index)}>⧉</button>
                  {index > 0 && <button type="button" className="tb" title={lang === 'ar' ? 'تحريك للأعلى' : 'Move up'} onClick={() => moveItem(path, index, index - 1)}>↑</button>}
                  {index < items.length - 1 && <button type="button" className="tb" title={lang === 'ar' ? 'تحريك للأسفل' : 'Move down'} onClick={() => moveItem(path, index, index + 1)}>↓</button>}
                  <button type="button" className="tb tb--danger" title={lang === 'ar' ? 'حذف' : 'Delete'} onClick={() => del(index)}>×</button>
                </div>
              )}>
              {(controls) => render({ item, index, path: [...path, index], controls })}
            </SortableItem>
          ))}
          <div className={inline ? 'contents' : 'col-span-full'}>{addBtn}</div>
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ id, className, toolbar, children }: { id: string; className: string; toolbar: (handle: any) => React.ReactNode; children: (controls: React.ReactNode) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1, zIndex: isDragging ? 30 : undefined };
  const controls = toolbar({ ...attributes, ...listeners });
  return <div ref={setNodeRef} style={style} className={`editable-item ${className}`}>{controls}{children(controls)}</div>;
}
