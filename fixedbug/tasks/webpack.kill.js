'use strict';

let exec = require('child_process').exec;

// 获取自定义配置
let config = require('../config.js').default;

// 判断是否window
let isWin32 = process.platform === 'win32';

let getWebpackserverPID = null;
let killWebpackserver   = null;

if(!isWin32){
    getWebpackserverPID = (port) => {
        return new Promise((resolve, reject) => {
            exec('lsof -i tcp:' + port, function(err, d) {
                d = d.split('\n');
                var data = [];
                var headers = d[0].toLowerCase().split(/\s+/);
                headers.forEach(function(v, k) {
                    // istanbul ignore next
                    if (v === '') {
                        delete headers[k];
                    }
                });
                // Remove the headers
                delete d[0];
                // Remove the last dead space
                d.pop();
                d.forEach(function(v) {
                    v = v.split(/\s+/);
                    var k = {};
                    var finalField = v[headers.length];
                    // istanbul ignore else
                    if (finalField) {
                        // There is one more field than there are headers. Interpret that state info.
                        // These are things like '(LISTEN)' or '(ESTABLISHED)'. Save it into the state
                        // field minus the parenthesis and lowercased
                        k['state'] = finalField.substring(1, finalField.length - 1).toLowerCase();
                        v.pop();
                    }
                    v.forEach(function(s, i) {
                        k[headers[i]] = s;
                    });
                    data.push(k);
                });
                //
                // console.log(data);
                let dataLength = data.length - 1,
                    pid = '';
                if(dataLength >= 0){
                    data.forEach(function(item, index){
                        if(item.state === 'listen' && item.command === 'node'){
                            pid = item.pid;
                        }
                        if(dataLength === index){
                            if(pid === ''){
                                reject('PID为空');
                            }else{
                                resolve(pid);
                            }
                        }
                    });
                }else{
                    // console.log('进程为空');
                    reject('进程为空');
                }
            });
       });
    }
    killWebpackserver = (pid) => {
        return new Promise((resolve, reject) => {
            if(pid){
                exec('kill ' + pid, (error, stdout, stderr) => {
                    if(error) throw error;
                    if(stderr !== ''){
                        reject(stderr);
                    }else{
                    	resolve('ok');
                    }
                });
            }else{
               reject('PID获取失败');
            }
       });
    }
}else{
    getWebpackserverPID = (port) => {
        return new Promise((resolve, reject) => {
            exec(`netstat -ano|findstr "${ port }"`, function(err, d) {
                d = d.split('\n');
                // console.log(d[0].split(/\s+/)[5]);
                if(d[0] && d[0].split(/\s+/)[5]){
                    let pid = d[0].split(/\s+/)[5];
                    if(pid === ''){
                        reject('PID为空');
                    }else{
                        resolve(pid);
                    }
                }else{
                    // console.log('进程为空');
                    reject('进程为空');
                }
            });
       });
    }
    killWebpackserver = (pid) => {
        return new Promise((resolve, reject) => {
            if(pid){
                exec(`taskkill /T /F /PID ${ pid }`, (error, stdout, stderr) => {
                    if(error) throw error;
                    if(stderr !== ''){
                        reject(stderr);
                    }else{
                    	resolve('ok');
                    }
                });
            }else{
               reject('PID获取失败');
            }
       });
    }
}

// flow
getWebpackserverPID(config.port)
    .then(killWebpackserver)
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    })
