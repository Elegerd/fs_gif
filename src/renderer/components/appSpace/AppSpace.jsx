import React, {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {setProcessingStatus, setFileInfo} from '../../actions/mainActions.js'
import {Switch, Route} from 'react-router-dom'
import Sidebar from '../sidebar/Sidebar.jsx'
import Overview from '../overview/Overview.jsx'
import './appSpace.scss'


const AppSpace = () => {
    let removeListenerGetResult, removeListenerFileInfo;
    const dispatch = useDispatch();

    useEffect(() => {
        removeListenerGetResult = myIpcRenderer.on('APP_GET_RESULT_REPLY', data => {
            dispatch(setProcessingStatus(data));
        });
        removeListenerFileInfo = myIpcRenderer.on('APP_FILE_INFO_REPLY', data => {
            dispatch(setFileInfo(data));
        });
        return () => {
            if (typeof removeListenerGetResult !== 'undefined')
                removeListenerGetResult();
            if (typeof removeListenerFileInfo !== 'undefined')
                removeListenerFileInfo();
        }
    }, []);

    return (
        <>
            <Sidebar/>
            <main>
                <Switch>
                    <Route exact path='/' component={Overview}/>
                </Switch>
            </main>
        </>
    );
};

export default AppSpace;
