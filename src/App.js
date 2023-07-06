import { useState } from 'react';

import FileSelector from './FileSelector';
import Item from './Item';
import CommonTag from './CommonTag';

function App() {
  const [items, setItems] = useState([])

  const onFilesSelected = (files) => {
    const myItems = {}
    files.forEach(f => {
      const isImg = f.type.startsWith('image/')
      const isTxt = f.type.startsWith('text/')
      const fileName = f.name.split('.').slice(0, -1).join('.')
      myItems[fileName] = myItems[fileName] || {}
      if (isImg) {
        myItems[fileName].imageFile = f
      }
      if (isTxt) {
        myItems[fileName].tags = f.content.split(',').map(tag => tag.trim())
      }
    })
    const itemsArray = Object.entries(myItems).map(([name, attributes]) => ({ name, ...attributes }))
    setItems(itemsArray)
  }

  return (
    <div className="App flex flex-col items-center">
      <FileSelector onFilesSelected={onFilesSelected} />
      <CommonTag />
      {items.map(item => {
        return <Item data={item} key={item.name} />
      })}
    </div>
  );
}

export default App;
