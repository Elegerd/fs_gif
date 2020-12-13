import {
    SET_FILE,
    SET_PROCESSING_STATUS,
    SET_FILE_INFO,
    SET_FRAMES,
} from '../actions/mainActions.js'


const initState = {
    selectedFile: null,
    fileInfo: null,
    processingStatus: null,
}

export function mainReducer(state = initState, action) {
    switch (action.type) {
        case SET_FILE: {
            return {
                ...state,
                selectedFile: action.payload
            }
        }
        case SET_PROCESSING_STATUS: {
            return {
                ...state,
                processingStatus: action.payload ? {
                    ...state.processingStatus,
                    ...action.payload
                } : action.payload
            }
        }
        case SET_FILE_INFO: {
            return {
                ...state,
                fileInfo: action.payload ? {
                    ...state.fileInfo,
                    ...action.payload
                } : action.payload
            }
        }
        default:
            return state;
    }
}
