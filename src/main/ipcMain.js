const {app, ipcMain, dialog} = require('electron');
const {getWindow} = require("./window.js");
const { GifFrame, GifUtil } = require('gifwrap');

module.exports = () => {
    ipcMain.handle('APP_SELECT_FILE', (event) => {
        return dialog.showOpenDialogSync(getWindow('main'), {
            properties: ['openFile'],
            defaultPath: app.getAppPath(),
            filters: [
                {name: 'GIF', extensions: ['gif']},
                {name: 'Все файлы', extensions: ['*']}
            ]
        });
    });

    ipcMain.on('APP_GET_FILE_INFO', (event, file) => {
        const reply = (message) => event.reply('APP_FILE_INFO_REPLY', message);
        GifUtil.read(file)
            .then(inputGif => {
                const frames =  inputGif.frames.map((f, i) => {
                    return {
                        id: i,
                        delayCentisecs: f.delayCentisecs,
                        isShow: true,
                    }
                });
                reply({ repeat: inputGif.loops, frames });
            })
            .catch(_ => {
                reply(null);
            });
    });

    ipcMain.on('APP_GET_RESULT', (event, {file, fileInfo}) => {
        const reply = (message) => event.reply('APP_GET_RESULT_REPLY', message);
        const replyFileInfo = (message) => event.reply('APP_FILE_INFO_REPLY', message);
        reply({status: "beginning"});
        GifUtil.read(file)
            .then(inputGif => {
                reply({status: "processing"});
                const frames = [];
                inputGif.loops = fileInfo.repeat;
                inputGif.frames.forEach((frame, i) => {
                    const index = fileInfo.frames.findIndex(v => v.id === i);
                    if (fileInfo.frames[index].isShow) {
                        frames[index] = new GifFrame(frame)
                        frames[index].delayCentisecs = fileInfo.frames[index].delayCentisecs;
                    }
                });
                return GifUtil.write(file, frames.filter(v => v), inputGif)
                    .then(outputGif  => {
                        reply({status: "done"});
                        const frames =  outputGif .frames.map((f, i) => {
                            return {
                                id: i,
                                delayCentisecs: f.delayCentisecs,
                                isShow: true,
                            }
                        });
                        replyFileInfo({ repeat: outputGif.loops, frames });
                    });
            })
            .catch(_ => {
                reply({status: "error"});
            });
    });
};
