export const initialState = {
  inputValue: '',
  formats: [],
  selectedFormat: '',
  videoTitle: '',
  thumbnail: '',
  isSearching: false,
  isDownloading: false,
  showPreview: false,
  error: '',
  downloadStatus: {
    percent: 0,
    speed: '',
    timeLeft: ''
  }
};

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, inputValue: action.payload };
    case 'SEARCH_START':
      return { ...state, isSearching: true };
    case 'SEARCH_SUCCESS':
      return {
        ...state,
        isSearching: false,
        showPreview: true,
        formats: action.payload.formats,
        videoTitle: action.payload.title,
        thumbnail: action.payload.thumbnail
      };
    case 'SEARCH_ERROR':
      return {
        ...state,
        isSearching: false,
        showPreview: false,
        formats: [],
        videoTitle: '',
        thumbnail: '',
        error: action.payload 
      };
    case 'CLEAR_ERROR':
      return { ...state, error: '', inputValue:'' };
    case 'SET_SELECTED_FORMAT':
      return { ...state, selectedFormat: action.payload };
    case 'DOWNLOAD_START':
      return { ...state, isDownloading: true };
    case 'DOWNLOAD_PROGRESS':
      return { ...state, downloadStatus: action.payload };
    case 'DOWNLOAD_DONE':
      return { ...state, isDownloading: false };
    default:
      return state;
  }
}