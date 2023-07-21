import { useState, useEffect, useRef } from 'react'
import { saveAs } from 'file-saver';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { STORAGE_KEY } from './constant'

export default function Item (props) {
  const { name, imageFile, tags = [] } = props.data
  
  const [imgSrc, setImgSrc] = useState()
  const [myTags, setMyTags] = useState(tags)
  const [inputValue, setInputValue] = useState('');

  const myTagsRef = useRef(myTags)

  useEffect(() => {
    let commonTagsFromStorage = localStorage.getItem(STORAGE_KEY)
    if (commonTagsFromStorage) {
      commonTagsFromStorage = JSON.parse(commonTagsFromStorage)
      let newMyTags = [...myTagsRef.current]
      newMyTags = newMyTags.filter(tag => !commonTagsFromStorage.includes(tag))
      setMyTags(newMyTags)
    }
  }, [])

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      setImgSrc(src)
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile])

  const tagOnChange = (idx, e) => {
    const value = e.target.value
    const newMyTags = [...myTags]
    newMyTags[idx] = value
    setMyTags(newMyTags)
  }

  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      const newMyTags = myTags.concat([e.target.value])
      setMyTags(newMyTags)
      setInputValue("")
    }
  }

  const inputOnChange = (e) => {
    setInputValue(e.target.value)
  }

  const removeItem = (idx) => {
    const newMyTags = [...myTags]
    newMyTags.splice(idx, 1)
    setMyTags(newMyTags)
  }

  const save = () => {
    let commonTagsFromStorage = localStorage.getItem(STORAGE_KEY)
    if (commonTagsFromStorage) {
      commonTagsFromStorage = JSON.parse(commonTagsFromStorage)
    }
    const commonTags = commonTagsFromStorage || []
    const tagString = commonTags.concat(myTags).join(', ')
    const blob = new Blob([tagString], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${name}.txt`);
  }

  const onDragEnd = (result) => {
    const { source, destination } = result
    const newMyTags = [...myTags]
    const [removed] = newMyTags.splice(source.index, 1);
    newMyTags.splice(destination.index, 0, removed);
    setMyTags(newMyTags)
  }

  const getItemStyle = (isDragging, draggableStyle) => ({
    background: isDragging ? "#eaf1ff" : "inheritant",
    ...draggableStyle
  });

  return (
    <div className='py-20'>
      <p className='mb-3 font-bold text-lg'>{name}</p>
      <div className='flex'>
        {imgSrc && <img src={imgSrc} className='w-96 h-96 object-contain' alt='img' />}
        <div className='ml-5 w-96'>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="w-full  flex flex-col items-start">
                  {
                    myTags.map((tag, idx) => {
                      return (
                        <Draggable key={idx} draggableId={String(idx)} index={idx}>
                          {(provided, snapshot) => (
                            <div
                              className='flex w-full p-1'
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}>
                              <input
                                className="text-left flex-1"
                                onChange={tagOnChange.bind(this, idx)}
                                value={tag} />
                              <p className="font-bold w-5 text-red-400 cursor-pointer text-center" onClick={removeItem.bind(this, idx)}>x</p>
                            </div>
                          )}
                        </Draggable>
                      ) 
                    })
                  }
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <input
            className="px-2 py-1 rounded border mt-2 w-full"
            value={inputValue}
            onChange={inputOnChange}
            onKeyUp={onKeyUp}
            placeholder="New tag..." />
          <button onClick={save} className='bg-green-500 text-white text-sm block w-48 py-2 mt-5 rounded'>Save</button>
        </div>
        
      </div>
    </div>
  )
}
