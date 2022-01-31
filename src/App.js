import { useState, useEffect, useRef } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
function App() {
  const [isModelLoading, setisModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  const imageReference = useRef();
  const textInputReference = useRef();
  const fileInputReference = useRef();
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

  const identify = async () => {
    textInputReference.current.value = "";
    const results = await model.classify(imageReference.current);
    // console.log(results);
    setResults(results);
  };

  const handleOnChange = (e) => {
    setImageURL(e.target.value);
    setResults([]);
  };

  const triggerUpload = () => {
    fileInputReference.current.click();
  };

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    if (imageURL) {
      setHistory([imageURL, ...history]);
    }
  }, [imageURL]);

  if (isModelLoading) {
    return <h2>Model is loading...</h2>;
  }

  // console.log(imageURL);
  console.log(results);

  return (
    <div className="App">
      <h2 className="header">This is an Image Identifier App</h2>
      <div className="inputHolder">
        <input
          type="file"
          accept="image/*"
          capture="camera"
          className="uploadInput"
          onChange={uploadImage}
          ref={fileInputReference}
        />
        <button className="uploadImage" onClick={triggerUpload}>
          Upload Image
        </button>
        <span className="or">OR</span>
        <input
          type="text"
          placeholder="Paster image URL"
          ref={textInputReference}
          onChange={handleOnChange}
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
          {results.length > 0 && (
            <div className="resultsHolder">
              {results.map((result, index) => {
                return (
                  <div className="result" key={result.className}>
                    <span className="name">{result.className}</span>
                    <span className="confidence">
                      Confidence level: {(result.probability * 100).toFixed(2)}%{" "}
                      {index === 0 && (
                        <span className="bestGuess">Best Guess</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {imageURL && (
          <button className="button" onClick={identify}>
            Identify
          </button>
        )}
      </div>
      {history.length > 0 && (
        <div className="recentPredictions">
          <h2>Recent Images</h2>
          <div className="recentImages">
            {history.map((image, index) => {
              return (
                <div className="recentPrediction" key={`${image}${index}`}>
                  <img
                    src={image}
                    alt="Recent Prediction"
                    onClick={() => setImageURL(image)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
