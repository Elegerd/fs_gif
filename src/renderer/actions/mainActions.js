export const SET_FILE = "SET_FILE";
export const SET_FILE_INFO = "SET_FILE_INFO";
export const SET_FRAMES = "SET_FRAMES";
export const SET_PROCESSING_STATUS = "SET_PROCESSING_STATUS";


const {myIpcRenderer} = window;

export function selectFile() {
    return async dispatch => {
        try {
            const files = await myIpcRenderer.invoke('APP_SELECT_FILE');
            if (files && files[0]) {
                myIpcRenderer.send('APP_GET_FILE_INFO', files[0]);
                dispatch(setFile(files));
            }
        } catch (e) {
            console.error(e);
            dispatch(setFile(null));
        }
    };
}

export function setFile(file) {
    return {
        type: SET_FILE,
        payload: file
    }
}

export function setFileInfo(info) {
    return {
        type: SET_FILE_INFO,
        payload: info
    }
}

export function setProcessingStatus(status) {
    return {
        type: SET_PROCESSING_STATUS,
        payload: status
    }
}
