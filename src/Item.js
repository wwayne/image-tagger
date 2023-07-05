import { useState, useEffect } from 'react'
import { saveAs } from 'file-saver';

export default function Item (props) {
  const { name, imageFile, tags = [] } = props.data
  
  const [imgSrc, setImgSrc] = useState()
  const [myTags, setMyTags] = useState(tags)
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      setImgSrc(src)
    };
    reader.readAsDataURL(imageFile);
  })

  const tagOnChange = (idx, e) => {
    const value = e.target.innerHTML.trim()
    myTags[idx] = value
    setMyTags(myTags)
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

  const save = () => {
    const tagString = myTags.join(', ')
    const blob = new Blob([tagString], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${name}.txt`);
  }

  return (
    <div className='py-20'>
      <p className='mb-3 font-bold text-lg'>{name}</p>
      <div className='flex'>
        {imgSrc && <img src={imgSrc} className='w-96 h-96 objec-contain' />}
        <div className='ml-5 w-96 flex flex-col items-start'>
          {myTags.map((tag, idx) => {
            return (
              <div
                key={idx}
                className="text-left"
                contentEditable
                onInput={tagOnChange.bind(this, idx)}
                dangerouslySetInnerHTML={{ __html: tag }} />
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
