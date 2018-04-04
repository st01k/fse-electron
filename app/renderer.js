const worker = require('./worker.js')

let dir = worker.dir_contents();
rendBread(dir.tgtdir);
rendContent(dir);
$('.hidden').hide();

function rendBread(dir) {
    let bc = $('.breadcrumb');
    let splitpath = dir.split('/');
    bc.attr('id', dir);
    bc.empty();
    for (let [index, item] of splitpath.entries()) {
        let l = $('<li/>', { class: 'breadcrumb-item' })
        if (index < splitpath.length - 1) {
            a = $('<a/>', { href: '#', text: item })
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
}

function attachEvents() {
    $('.folder').click((event) => {
        let id = event.currentTarget.id;
        worker.log('entering ' + id);
        dir = worker.dir_contents(id);
        rendBread(dir.tgtdir);
        rendContent(dir);
    });

    $('.file').click((e) => {
        let id = e.currentTarget.id;
        worker.log('opening ' + id);
        worker.open_file(id);
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
});

$('#up').click((e) => {
    worker.log('up clicked');
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
    console.log('hidden toggled');
    $('.hidden').toggle();
});