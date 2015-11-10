/*
*  NODE.JS第一个练习项目
*  模块说明：监控指定路径的文件变化，并在文件更改时，通过回调传递目标文件更新的内容
*/

var fs = require('fs');

module.exports = function (fileName) {
    console.log(fileName);
    return new fileHandler(fileName);
};

var fileHandler = function (fileName) {
    var _this = this;
    this._fileName = fileName;
    this._encoding = 'gb2312';
    this._offset = 0;

    this.startWatch = function (callback) {
        fileExists(function (exists) {
            if (!exists)
                throw 'file is not exists!';

            getFileSize(function (size) {
                _this._offset = size;
                fs.watch(_this._fileName, { persistent: true, interval: 0 }, function (event, sender) {
                    if (event == 'change') {
                        getFileSize(function (newSize) {
                            var offsetPrev = _this._offset;
                            if (newSize > offsetPrev) {
                                _this._offset = newSize;
                                var bufSize = newSize - offsetPrev;

                                fs.open(_this._fileName, 'r', 0664, function (err, fd) {
                                    if (err) throw err;
                                    var buffer = new Buffer(bufSize);
                                    fs.read(fd, buffer, 0, bufSize, offsetPrev, function (err) {
                                        if (err) throw err;
                                        var data = buffer.toString(_this._encoding);
                                        callback(data);
                                    });
                                });
                            }
                        });
                    }
                });
            });

        });
    };

    var fileExists = function (callBack) {
        fs.exists(_this._fileName, function (exists) {
            callBack(exists);
        });
    };

    var getFileSize = function (callBack) {
        fs.stat(_this._fileName, function (exception, description) {
            if (exception) throw exception;
            callBack(description.size);
        });
    };
};