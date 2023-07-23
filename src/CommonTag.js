import { useState, useEffect } from 'react'

import { STORAGE_KEY } from './constant'

export default function CommonTag () {
  const [tags, setTags] = useState([])
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    let tagsInStorage = localStorage.getItem(STORAGE_KEY)
    if (tagsInStorage) {
      tagsInStorage = JSON.parse(tagsInStorage)
      setTags(tagsInStorage)
    }
  }, [])

  const tagOnChange = (idx, e) => {
    const value = e.target.value
    const newTags = [...tags]
    newTags[idx] = value
    saveNewTags(newTags)
  }

  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      const newTags = tags.concat([e.target.value])
      saveNewTags(newTags)
      setInputValue("")
    }
  }

  const inputOnChange = (e) => {
    setInputValue(e.target.value)
  }

  const removeItem = (idx) => {
    const newTags = [...tags]
    newTags.splice(idx, 1)
    saveNewTags(newTags)
  }

  const saveTagsIntoStorage = (tags) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags))
  }

  const saveNewTags = (tags) => {
    setTags(tags)
    saveTagsIntoStorage(tags)
  }

  return (
    <div className="w-96 my-10">
      {tags.map((tag, idx) => {
        return (
          <div className='flex w-full' key={idx}>
            <input
              className="text-left flex-1"
              onChange={tagOnChange.bind(this, idx)}
              value={tag} />
            <p className="font-bold w-5 text-red-400 cursor-pointer" onClick={removeItem.bind(this, idx)}>x</p>
          </div>
        ) 
        })}
      <input
        className="px-2 py-1 rounded border mt-2 w-full"
        value={inputValue}
        onChange={inputOnChange}
        onKeyUp={onKeyUp}
        placeholder="New common tag..." />
    </div>
  )
}