import React from 'react'
import Icon from '@material-ui/core/Icon'
import {DebounceInput} from 'react-debounce-input';
import './table.scss'

const Table = ({objects}) => {
    return (
        <table>
            {objects.map(obj => (
                <div className={'dir-table__tr'} key={obj.id}>
                    <div className={'dir-table__td'}>
                        <span className={'dir-table__td-title'} title={obj.title}>{obj.title}</span>
                        {!!obj.onChangeDelay && !!obj.onHide && !!obj.onMove && (
                            <div className={'dir-table__td-actions'}>
                            {!!obj.onChangeDelay && (
                                <div>
                                    <span>Delay</span>
                                    <DebounceInput 
                                        debounceTimeout={300}
                                        type="number"
                                        min={'1'}
                                        value={obj.delayCentisecs}
                                        className={'dir-table__td-action'}
                                        onChange={(e) => obj.onChangeDelay(e.target.value)}
                                    />
                                </div>
                            )}
                            {!!obj.onHide && (         
                                <Icon className={'dir-table__td-action'} onClick={() => obj.onHide(!obj.isShow)}>
                                    {obj.isShow ? 'visibility' : 'visibility_off'}
                                </Icon>
                            )}
                            {!!obj.onMove && (
                                <>
                                    <Icon className={'dir-table__td-action'} onClick={() => obj.onMove(false)}>
                                        {'vertical_align_top'}
                                     </Icon>
                                    <Icon className={'dir-table__td-action'} onClick={() => obj.onMove()}>
                                        {'vertical_align_bottom'}
                                    </Icon>
                                </>
                            )}
                        </div>
                        )}
                    </div>
                </div>
            ))}
        </table>
    );
};

export default Table;
