const worker = require('./worker.js');
const axios = require('axios');

const uristring = 'http://127.0.0.1:3000';

let dir = worker.dir_contents();
rendBread(dir.tgtdir);
rendContent(dir);
rendCount();
rendToolbar(dir);
$('.hidden').hide();

function rendCount() {
    let folderCountEl = $('#foldercount');
    let fileCountEl = $('#filecount');
    
    axios.get(uristring + '/get/folder')
        .then(function (response) {
            folderCountEl.text(response.data.value);
        })
        .catch(function (error) {
            console.log(error);
        });

    axios.get(uristring + '/get/file')
        .then(function (response) {
            fileCountEl.text(response.data.value);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function rendBread(dir) {
    let bc = $('.breadcrumb');
    let splitpath = dir.split('/');
    bc.attr('id', dir);
    bc.empty();
    let s = '/'
    for (let [index, item] of splitpath.entries()) {
        s += item + '/';
        let l = $('<li/>', { class: 'breadcrumb-item' })
        if (index < splitpath.length - 1) {
            a = $('<a/>', { id: s, href: '#', class: 'bread', text: item })
            l.append(a);
        } else {
            l.text(item);
        }
        bc.append(l);
    }
};

function rendContent(dir) {
    let c = $('#show-items');
    c.empty();

    for (folder of dir.folders) {
        let li = $('<li/>', { class: 'list-inline-item' });
        let f = dir.tgtdir + '/' + folder;
        li.append(`
                <div class="card text-center">
                    <div id="${ f }" class="card-body folder">
                        <i class="fa fa-folder fa-2x"></i>
                        <br><br>
                        <p>${ folder }</p>
                    </div>
                </div>
            `);
        if (folder.charAt(0) == '.') { li.addClass('hidden'); }
        c.append(li);
    };

    for (file of dir.files) {
        let li = $('<li/>', { class: 'list-inline-item' });
        let f = dir.tgtdir + '/' + file;
        li.append(`
                <div class="card text-center">
                    <div id="${ f }" class="card-body file">
                        <i class="fa fa-file fa-2x"></i>
                        <br><br>
                        <p>${ file }</p>
                    </div>
                </div>
            `);
        if (file.charAt(0) == '.') { li.addClass('hidden'); }
        c.append(li);
    };

    attachEvents();

    let hiddenOn = $('#toggle-hidden').prop('checked');
    if (hiddenOn) { $('.hidden').show(); }
    else { $('.hidden').hide(); }
}

function rendToolbar(d) {
    let upOne = removeLastDir(d.tgtdir);
    console.log(upOne);
    $('#up').attr('id', upOne);
}

function removeLastDir(url) {
    var arr = url.split('/');
    arr.pop();
    return( arr.join('/') );
}

function attachEvents() {
    $('.folder').click((e) => {
        let id = e.currentTarget.id;
        worker.log('entering ' + id);
        dir = worker.dir_contents(id);
        rendBread(dir.tgtdir);
        rendContent(dir);
        rendToolbar(dir);

        let folderCountEl = $('#foldercount');
        let val = parseInt(folderCountEl.text())
        axios.get(uristring + '/set/folder/' + (val + 1))
            .then(function (response) {
                rendCount();
            })
            .catch(function (error) {
                console.log(error);
            });
    });

    $('.file').click((e) => {
        let id = e.currentTarget.id;
        worker.log('opening ' + id);
        worker.open_file(id);

        let fileCountEl = $('#filecount');
        let val = parseInt(fileCountEl.text())
        axios.get(uristring + '/set/file/' + (val + 1))
            .then(function (response) {
                rendCount();
            })
            .catch(function (error) {
                console.log(error);
            });
    });

    $('.bread').click((e) => {
        worker.log('breadcrumb clicked');
        let id = e.currentTarget.id;
        worker.log('entering ' + id);
        dir = worker.dir_contents(id);
        rendBread(dir.tgtdir);
        rendContent(dir);
        rendToolbar(dir);
    });

    $('#up').click((e) => {
        worker.log('up clicked');
        let id = e.currentTarget.id;
        worker.log('entering ' + id);
        dir = worker.dir_contents(id);
        rendBread(dir.tgtdir);
        rendContent(dir);
        rendToolbar();
    });
}

// ------------------------------------------------------------ toolbar buttons
$('#back').click((e) => {
    worker.log('back clicked');
});

$('#home').click((e) => {
    worker.log('home clicked');
    dir = worker.dir_contents();
    rendContent(dir);
    rendBread(dir.tgtdir);
    rendToolbar(dir);
});



$('#refresh').click((e) => {
    worker.log('refresh clicked');
});

$('#upload').click((e) => {
    worker.log('upload clicked');
});

$('#download').click((e) => {
    worker.log('download clicked');
});

$('#edit').click((e) => {
    worker.log('edit clicked');
});

$('#copy').click((e) => {
    worker.log('copy clicked');
});

$('#paste').click((e) => {
    worker.log('paste clicked');
});

$('#plus').click((e) => {
    worker.log('plus clicked');
});

$('#delete').click((e) => {
    worker.log('delete clicked');
});

$('#resetcount').click((e) => {
    worker.log('reset clicked');

    let folderCountEl = $('#foldercount');
    let fileCountEl = $('#filecount');

    axios.get(uristring + '/set/folder/0')
      .then(function (response) {
        rendCount();
      })
      .catch(function (error) {
        console.log(error);
      });

      axios.get(uristring + '/set/file/0')
      .then(function (response) {
        rendCount();
      })
      .catch(function (error) {
        console.log(error);
      });
})

// --------------------------------------------------------------- debug button
$('#toggle-debug').bootstrapToggle({
    on: 'Debug On',
    off: 'Debug Off'
});

$('#toggle-debug').change(() => {
    worker.toggledebug();
    console.log('debug: ' + worker.debug());
});

// -------------------------------------------------------------- hidden button
$('#toggle-hidden').bootstrapToggle({
    on: 'Hide Hidden Files',
    off: 'Show Hidden Files'
});

$('#toggle-hidden').change(() => {
    let hiddenOn = $('#toggle-hidden').prop('checked');
    worker.log('show hidden ' + hiddenOn);
    if (hiddenOn) {
        $('.hidden').show();
    }
    else {
        $('.hidden').hide();
    }
});