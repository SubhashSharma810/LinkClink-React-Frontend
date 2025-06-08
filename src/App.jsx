import './styles.css';
import { useReducer, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from './globalVariable';
import { reducer, initialState } from './reducer';
import PreviewBox from './components/PreviewBox';
import ErrorPopup from './components/ErrorPopup';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // On mount, restore theme and toggle switch state
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      const toggle = document.getElementById('theme-toggle');
      if (toggle) toggle.checked = true;
    }
  }, []);

  // Toggle theme and save preference
  const toggleTheme = () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  };

  // Fetch video formats from backend
  const fetchFormats = async () => {
    if (!state.inputValue) return;
    dispatch({ type: 'SEARCH_START' });

    try {
      const res = await axios.post(`${API_BASE}/formats`, { url: state.inputValue });

      if (res.data.error || !res.data.formats || res.data.formats.length === 0) {
        dispatch({ type: 'SEARCH_ERROR', payload: "Oh! Bring Some Good Link this Won't Work" });
        return;
      }

      dispatch({
        type: 'SEARCH_SUCCESS',
        payload: {
          title: res.data.videoTitle,
          thumbnail: res.data.thumbnail,
          formats: res.data.formats,
        }
      });
    } catch (err) {
      console.error('Format fetch error', err);
      dispatch({
        type: 'SEARCH_ERROR',
        payload: "Oh! 🥱 Bring Some Good Link. This one won’t work!"
      });
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto">
      <header className="header">
        <div className="logo-title" aria-label="App Logo and Title">
          <div className="logo-circle" aria-hidden="true">LC</div>
          <h1>LinkClink</h1>
        </div>

        <div className="theme-switch" aria-label="Toggle light and dark theme">
          <input type="checkbox" id="theme-toggle" onChange={toggleTheme} aria-checked={document.body.classList.contains('light-theme')} />
          <label htmlFor="theme-toggle" className="theme-toggle-switch" />
        </div>
      </header>

      <p className="tagline" style={{ textAlign: 'center', marginTop: '0.5rem' }}>Download anything from any link!</p>

      <main className="container" role="main">
        <div className="cont-logo-circle" aria-hidden="true">LC</div>
        <h1 className="title">LinkClink</h1>
        <p className="mainText">Paste any video, photo, or document link below:</p>

        <input
          type="text"
          placeholder="Enter link here..."
          value={state.inputValue}
          onChange={(e) => dispatch({ type: 'SET_INPUT', payload: e.target.value })}
          aria-label="Input URL"
        />

        <button className="Searchbtn" onClick={fetchFormats} aria-live="polite">
          Search
        </button>
      </main>

      {/* Show loading spinner popup under search button */}
      {state.isLoading && (!state.thumbnail || state.formats.length === 0) && (
        <div className="download-popup" role="status" aria-live="polite">
          <div className="loading-spinner" aria-hidden="true" />
          <span>Fetching formats...</span>
        </div>
      )}

      {/* Show preview when data is available */}
      {state.showPreview && <PreviewBox state={state} dispatch={dispatch} />}

      {/* Show error popup */}
      {state.error && <ErrorPopup message={state.error} onClose={() => dispatch({ type: 'CLEAR_ERROR' })} />}

      {/* Show download progress popup */}
      {state.isDownloading && (
        <div className="download-popup" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={state.downloadStatus.percent}>
          <div style={{ width: 100, marginBottom: '1rem' }}>
            <CircularProgressbar
              value={state.downloadStatus.percent}
              text={`${state.downloadStatus.percent}%`}
              styles={buildStyles({
                textColor: '#fff',
                pathColor: '#ff6f91', // Pinkish (matches palette)
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

export default App;