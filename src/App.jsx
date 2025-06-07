import './styles.css';
import { useReducer, useEffect } from 'react';
import axios from 'axios';
import { API_BASE, WS_URL } from './globalVariable';
import { reducer, initialState } from './reducer';
import PreviewBox from './components/PreviewBox';
import ErrorPopup from './components/ErrorPopup';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      document.getElementById('theme-toggle').checked = true;
    }
  }, []);

  const toggleTheme = () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  };

  const fetchFormats = async () => {
    if (!state.inputValue) return;
    dispatch({ type: 'SEARCH_START' });

    try {
      const res = await axios.post(`${API_BASE}/formats`, { url: state.inputValue });

      if (res.data.error || !res.data.formats || res.data.formats.length === 0) {
        dispatch({ type: 'SEARCH_ERROR', payload: 'Oh! Bring Some Good Link this Won\'t Work ' });
        return;
      }

      dispatch({
        type: 'SEARCH_SUCCESS',
        payload: {
          title: res.data.title,
          thumbnail: res.data.thumbnail,
          formats: res.data.formats,
        }
      });
    } catch (err) {
      console.error('Format fetch error', err);
      dispatch({
        type: 'SEARCH_ERROR',
        payload: 'Oh! 🥱 Bring Some Good Link. This one won’t work!'
      });
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto">
      <div className="header">
        <div className="logo-title">
          <div className="logo-circle">LC</div>
          <h1>LinkClink</h1>
        </div>

        <div className="theme-switch">
          <input type="checkbox" id="theme-toggle" onChange={toggleTheme} />
          <label htmlFor="theme-toggle" className="theme-toggle-switch"></label>
        </div>
      </div>

      <p className="tagline">Download anything from any link!</p>

      <div className="container">
        <div className="cont-logo-circle">LC</div>
        <h1 className="title">LinkClink</h1>
        <p className="mainText">Paste any video, photo, or document link below:</p>

        <input
          type="text"
          placeholder="Enter link here..."
          value={state.inputValue}
          onChange={(e) => dispatch({ type: 'SET_INPUT', payload: e.target.value })}
        />
        <button className="Searchbtn" onClick={fetchFormats}>Search</button>
      </div>

      {state.showPreview && (
        <PreviewBox state={state} dispatch={dispatch} />
      )}

      {state.isSearching && (
        <div className="popup-overlay">
          <div className="loader"></div>
          <p>Fetching formats...</p>
        </div>
      )}

      {state.error && (
        <ErrorPopup
          message={state.error}
          onClose={() => dispatch({ type: 'CLEAR_ERROR' })}
        />
      )}

      {state.isDownloading && (
        <div className="popup-overlay">
          <div style={{ width: 100, marginBottom: '1rem' }}>
            <CircularProgressbar
              value={state.downloadStatus.percent}
              text={`${state.downloadStatus.percent}%`}
              styles={buildStyles({
                textColor: '#fff',
                pathColor: '#FF7BBF',
                trailColor: 'rgba(255, 255, 255, 0.2)',
              })}
            />
          </div>
          <p>Downloading...</p>
          <p>Speed: {state.downloadStatus.speed}</p>
          <p>Time left: {state.downloadStatus.timeLeft}</p>
        </div>
      )}
    </div>
  );
}

/*===========================*/
/*       Hero Section        */
/*===========================*/
export default App;