import { useState, useEffect, useRef } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
function App() {
  const [isModelLoading, setisModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const imageReference = useRef();

  const loadModel = async () => {
    setisModelLoading(true);
    try {
      const model = await mobilenet.load();
      setModel(model);
      setisModelLoading(false);
    } catch (error) {
      console.log(error);

      setisModelLoading(false);
    }
  };

  const uploadImage = (e) => {
    // console.log(e)
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageURL(url);
    } else {
      setImageURL(null);
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  if (isModelLoading) {
    return <h2>Model is loading...</h2>;
  }

  console.log(imageURL);
  return (
    <div className="App">
      <h2 className="header">This is an Image Identifier App</h2>
      <div className="inputImageHolder">
        <input
          type="file"
          accept="image/"
          capture="camera"
          className="uploadInputImage"
          onChange={uploadImage}
        />
      </div>
      <div className="mainWrapper">
        <div className="mainContent">
          <div className="imageHolder">
            {imageURL && (
              <img
                src={imageURL}
                alt="upload preview"
                crossOrigin="anonymous"
                ref={imageReference}
              />
            )}
          </div>
        </div>
        {imageURL && <button className="button">Identify</button>}
      </div>
    </div>
  );
}

export default App;
