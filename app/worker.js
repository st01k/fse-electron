const fse = require('fs-extra');
const os = require('os');
const path = require('path');
const { shell } = require('electron');

_debug = false;

module.exports = {
    debug: () => {
        return _debug;
    },
    toggledebug: () => {
        _debug = !_debug;
    },
    log: (s) => {
        if (_debug) console.log(s);
    },
    dir_contents: (_folder) => {
        if (!_folder) _folder = os.homedir();

        let items = {
            tgtdir: _folder,
            files: [],
            folders: []
        }

        let _items = fse.readdirSync(items.tgtdir);
        _items.forEach(item => {
            let p = path.join(items.tgtdir, '/', item);

            let isdir = fse.statSync(p).isDirectory();
            if (isdir) {
                items.folders.push(item);
            } else {
                items.files.push(item);
            }
        })
        items.folders.sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase())
        });
        console.log(items);
        return items;

        // fse.readdir(items.tgtdir, (err, _items) => {
        //     if (err) throw err;
        //     else {
        //         for (let item of _items) {
        //             let p = path.join(_folder, '/', item)
        //             let isdir = fse.statSync(p).isDirectory();
        //             if (isdir) {
        //                 items.folders.push(item);
        //             } else {
        //                 items.files.push(item);
        //             }
        //         }
        //     }
        // });

        // if (items.tgtdir != '/') {
        //     items.folders.push('..');
        // }
    },
    open_file: (_file) => {
        shell.openItem(_file);
    }
}