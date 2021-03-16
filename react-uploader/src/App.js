import axios from 'axios';
import { useState } from 'react';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loaded, setLoaded] = useState(0);
  const [randString, setRandString] = useState('');

  const clearFileInput = () => setRandString(Math.random().toString(36));

  const onChangeHandler = (event) => {
    const file = event.target.files[0];

    if (checkFileSize(file)) {
      setSelectedFile(file);
    } else {
      toast.error('File size is larger than 15000');
      setSelectedFile(null);
      clearFileInput();
    }
    setLoaded(0);
  };

  const onClickHandler = async () => {
    const data = new FormData();
    data.append('file', selectedFile);
    try {
      const res = await axios.post('http://localhost:8000/upload', data, {
        onUploadProgress: (ProgressEvent) =>
          setLoaded((ProgressEvent.loaded / ProgressEvent.total) * 100),
      });
      if (res.status === 200) {
        toast.success('Upload Success');
      }

      setSelectedFile(null);
      setLoaded(0);
      clearFileInput();
    } catch (error) {
      toast.error(error.message);
    } finally {
    }
  };

  const checkFileSize = (file) => {
    return file && file.size < 15000;
  };

  return (
    <>
      <div className='form-group'>
        <ToastContainer />
      </div>
      <div className='row'>
        <div className='col-md-6'>
          <form method='post' action='#' id='#'>
            <div className='form-group files'>
              <input type='file' name='file' onChange={onChangeHandler} key={randString || ''} />
            </div>
            <button
              type='button'
              className='btn btn-success btn-block'
              onClick={onClickHandler}
              disabled={selectedFile ? '' : true}
            >
              Upload
            </button>
          </form>
          <div className='form-group'>
            <Progress max='100' color='success' value={loaded}>
              {Math.round(loaded, 2)}%
            </Progress>
          </div>
        </div>
      </div>
      {/* <div className='col-md-6'>
        <form method='post' action='#' id='#'>
          <div className='form-group files color'>
            <label>Upload Your File </label>
            <input type='file' name='file' onChange={onChangeHandler} />
          </div>
        </form>
      </div> */}
    </>
  );
}

export default App;
