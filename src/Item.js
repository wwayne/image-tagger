import { useState, useEffect, useRef } from 'react'
import { saveAs } from 'file-saver';

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

  return (
    <div className='py-20'>
      <p className='mb-3 font-bold text-lg'>{name}</p>
      <div className='flex'>
        {imgSrc && <img src={imgSrc} className='w-96 h-96 objec-contain' alt='img' />}
        <div className='ml-5 w-96 flex flex-col items-start'>
          {myTags.map((tag, idx) => {
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
            placeholder="New tag..." />
          <button onClick={save} className='bg-green-500 text-white text-sm block w-48 py-2 mt-5 rounded'>Save</button>
        </div>
        
      </div>
    </div>
  )
}
