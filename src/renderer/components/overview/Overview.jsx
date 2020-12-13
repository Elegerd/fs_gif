import React, {useMemo} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import classNames from 'classnames'
import Icon from '@material-ui/core/Icon'
import {selectFile, setFile, setFileInfo, setProcessingStatus} from '../../actions/mainActions.js'
import Table from '../commonComponents/Table.jsx'
import arrayMove from 'array-move'
import './overview.scss'


const {myIpcRenderer} = window;

const Overview = () => {
    const dispatch = useDispatch();
    const {selectedFile, fileInfo, processingStatus} = useSelector(state => state.main);

    const onClickSelectFile = () => dispatch(selectFile());
    const onClickGetResult = () => {
        dispatch(setProcessingStatus({status: 'waiting'}));
        myIpcRenderer.send('APP_GET_RESULT', { file: selectedFile[0], fileInfo });
    }
    const onClickResetFile = () => dispatch(setFile(null));
    const onClickResetStates = () => {
        dispatch(setFile(null));
        dispatch(setFileInfo(null));
        dispatch(setProcessingStatus(null));
    };

    const file = useMemo(() => {
        return selectedFile ? selectedFile.map((f, i) => ({ id: i, title: f })) : [];
    }, [selectedFile]);

    const onReapet = () => {
        const repeat = fileInfo.repeat > 0 ? 0 : 10;
        dispatch(setFileInfo({ repeat }));
    };

    const onHide = (id) => (isHidden = true) => {
        const newArray = fileInfo.frames.map(el => {
            if (el.id === id)
                return {
                    ...el,
                    isShow: isHidden
                }
            else
                return el;
        });
        dispatch(setFileInfo({ frames: newArray }));
    };

    const onMove = (id) => (isUp = true) => {
        const index = fileInfo.frames.findIndex(v => v.id === id);
        const newIndex = Math.min(Math.max(index + (isUp ? 1 : -1), 0), fileInfo.frames.length - 1);
        const newArray = arrayMove(fileInfo.frames, index, newIndex);
        dispatch(setFileInfo({ frames: newArray }));
    };

    const onChangeDelay = (id) => (value) => {
        const newArray = fileInfo.frames.map(el => {
            if (el.id === id)
                return {
                    ...el,
                    delayCentisecs: Math.max(value, 1)
                }
            else
                return el;
        });
        dispatch(setFileInfo({ frames: newArray }));
    };

    const frames = useMemo(() => {
        return fileInfo ? fileInfo.frames.map((f) => ({ 
            ...f,
            title: `Frame ${f.id + 1}`,
            onHide: onHide(f.id),
            onMove: onMove(f.id),
            onChangeDelay: onChangeDelay(f.id),
        })) : [];
    }, [fileInfo, onHide, onMove, onChangeDelay]);

    const renderSelect = () => {
        return (
            <div>
                <h2> Select the path to the file: </h2>
                <button onClick={onClickSelectFile}>
                    Select file
                </button>
            </div>
        );
    };

    const renderSaveResult = () => {
        return (
            <div className={'overview_container'}>
                <button onClick={onClickGetResult}>
                    Save file
                </button>
                <button onClick={onClickResetFile}>
                    Reset file
                </button>
            </div>
        );
    }

    const renderTable = () => {
        return (
            <div className={'dir-table'}>
                <div className={'dir-table__title'}>File</div>
                <Table objects={file}/>
                <div className={'dir-table__caption'}>Selected file</div>
            </div>
        );
    };

    const renderFrames = () => {
        return (
            <div className={'dir-table'}>
                <div className={'dir-table__title'}>
                    <span>Frames</span>
                    <Icon style={{cursor: 'pointer'}} className={'dir-table__td-action'} onClick={onReapet}>
                        {fileInfo.repeat > 1 ? 'sync' : 'sync_disabled'}
                    </Icon>
                </div>
                <Table objects={frames}/>
                <div className={'dir-table__caption'}>Current frames</div>
            </div>
        );
    };

    const renderProcessing = () => {
        return (
            <div className={'process_container'}>
                {(processingStatus.status === 'done' || processingStatus.status === 'error') &&
                <button
                    className={classNames('overview__button', {
                        'overview__button--error': processingStatus.status === 'error'
                    })} 
                    onClick={onClickResetStates}
                >
                    Reset process
                </button>
                }
            </div>
        );
    };

    return (
        <>
            <h1>Overview</h1>
            <div className={'overview'}>
                {(Array.isArray(selectedFile) && selectedFile.length > 0 && fileInfo) ?
                    <>
                        {renderTable()}
                        {renderFrames()}
                        {processingStatus ?
                            renderProcessing() : renderSaveResult()
                        }
                    </> :
                    renderSelect()
                }
            </div>
        </>
    );
};

export default Overview;
