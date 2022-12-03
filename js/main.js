var size = 4
var htmlElements;
var cells;

function FeldErstellen() {
    if (htmlElements){
        return;
    }
    htmlElements = [];
    var table = document.getElementById('field')
    for (var y = 0; y < size; y++) {
        var tr = document.createElement('tr')
        var trElements = [];
        for (var x = 0; x < size; x++) {
            var td = document.createElement("td")
            td.setAttribute('class', 'cell');
            tr.appendChild(td);
            trElements.push(td)
        }
        htmlElements.push(trElements);
        table.appendChild(tr);
    }
}
function ZellenErstellen() {
    cells = [];
    for( var y = 0; y < size; y++) {
        cells.push(new Array(size).fill(0));
    }
}
function GeneriereLeereZelle() {
    var x,y;
    do {
        x = Math.floor(Math.random() * size), y = Math.floor(Math.random() * size);
        if (cells [y][x] == 0){
            cells [y][x] = Math.random() >= 0.9 ? 4 : 2;
            break;
        }
    }while (true)
}
function draw() {
    for (var y = 0; y < size; y++){
        for (var x = 0; x < size; x++){
            var td = htmlElements[y][x];
            var v = cells[y][x];
            td.innerHTML = v == 0 ? '' : String(v);
            if (v == 0) {
                td.setAttribute('style', 'background-color: white');
            } else {
                var h = 20 + 24 * Math.log2(2048 / v);
                td.setAttribute('style', 'background-color: hsl(' + h + ', 100%, 50%)');
            }
        }
    }
}
function Bewegen(array, size) {
    // [0, 2, 2, 2] => [2, 2, 2] => [4, 0, 2] => [4, 2] => [4, 2, 0, 0]
    function filterEmpty(a) {
        return a.filter(x => x != 0);
    }

    array = filterEmpty(array)
    if (array.length > 0) {
        for (var i = 0; i < array.length - 1; i++) {
            if (array[i] == array [i + 1]) {
                array[i] *= 2;
                array[i + 1] = 0;
            }
        }
    }
    array = filterEmpty(array);
    while (array.length < size) {
        array.push(0);
    }
    return array;
}
function NachLinksVerschieben() {
    var changed = false;
    for (var y = 0; y < size; y++) {
        var alt= Array.from(cells[y]);
        cells[y] = Bewegen(cells[y], size);
        changed = changed || (cells[y].join(',') != old.join(','));
    }
    return changed;
}

function Tauschen(x1,y1,x2,y2) {
    var neu = cells[y1][x1];
    cells[y1][x1] = cells [y2][x2];
    cells[y2][x2] = neu
}

function Spiegeln() {
    for( var y = 0; y< size; y++) {
        for (var xLeft = 0, xRight = size - 1; xLeft < xRight; xLeft++, xRight--) {
            Tauschen(xLeft, y, xRight, y);
        }
    }
}

function Umsetzen() {
    for (var y =  0; y < size; y++) {
        for (var x = 0; x < y; x++) {
            Tauschen(x, y, y, x);//nochmal commiten und pushen
        }
    }
}


function NachLinksBewegen() {
    NachLinksVerschieben();
}

function NachRechtsBewegen() {
    Spiegeln();
    var changed = NachRechtsBewegen();
    Spiegeln();
    return changed;
}
function NachObenBewegen() {
    Umsetzen();
    var changed = NachLinksBewegen();
    Umsetzen();
    return changed;
}

function NachUntenBewegen() {
    Umsetzen();
    var changed = NachRechtsBewegen();
    Umsetzen();
    return changed;
}

function SpielEnde() {
    for (var y = 0; y < size ;y++) {
        for (var x = 0; x < size; x++) {
            if (cells[y][x] == 0) {
                return false;
            }
        }
    }
    for (var y = 0; y < size - 1; y++) {
        for (var x = 0; x < size; x++) {
            var c = cells[y][x]
            if (c != 0 && (c == cells[y + 1][x] || c == cells[y][x + 1])) {
                return false
            }
        }
    }
    return true;
}
document.addEventListener('keydown', function(e) {
    var code = e.keyCode;
    var ok;
    switch (code) {
        case 40: ok = NachUntenBewegen(); break;
        case 38: ok = NachObenBewegen(); break;
        case 37: ok = NachLinksBewegen();break;
        case 39: ok = NachRechtsBewegen();break;
        default: return;
    }
    if (ok) {
        GeneriereLeereZelle();
        draw();
    }
    if (SpielEnde()) {
        setTimeout(function () {
            alert('Spiel zu Ende');
            init();
        }, 1000);
    }
})

function init() {
    FeldErstellen();
    ZellenErstellen();
    new Array(3).fill(0).forEach(GeneriereLeereZelle);
    draw();
}
init();
