const FileSelector = ({ onFilesSelected }) => {

  const onChange = async (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    const txtFiles = await Promise.all(
      files
        .filter((f) => f.type.startsWith('text/'))
        .map(f => {
          return new Promise(resolve => {
            const reader = new FileReader()
            reader.onload = (event) => {
              const content = event.target.result;
              resolve({
                name: f.name,
                type: f.type,
                content
              })
            };
            reader.readAsText(f);
          })
        })
    )
    
    onFilesSelected(imageFiles.concat(txtFiles));
  };

  return (
    <input type="file" multiple accept="image/*, .txt" onChange={onChange} />
  );
};

export default FileSelector;