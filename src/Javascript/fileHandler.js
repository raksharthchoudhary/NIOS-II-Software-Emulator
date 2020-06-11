const dict = new Map([['add','r'], ['addi','i'], ['and','r'], ['andhi','i'], ['andi','i'], ['beq','i'], ['bge','i'],
['bgeu','i'], ['bgt','i'], ['bgtu','i'], ['ble','i'], ['bleu','i'], ['blt','i'], ['bltu','i'], ['bne','i'], ['br','i'],
['break','r'], ['bret','r'], ['call','j'], ['callr','r'], ['cmpeq','r'], ['cmpeqi','i'], ['cmpge','r'], ['cmpgei','i'],
['cmpgeu','r'], ['cmpgeui','i'], ['cmpgt','r'], ['cmpgti','i'], ['cmpgtu','r'], ['cmpgtui','i'], ['cmple','r'],
['cmplei','i'], ['cmpleu','r'], ['cmpleui','i'], ['cmplt','r'], ['cmplti','i'], ['cmpltu','r'], ['cmpltui','i'],
['cmpne','r'], ['cmpnei','i'], ['custom','n'], ['div','r'], ['divu','r'], ['eret','r'], ['flushd','i'], ['flushda','i'],
['flushi','r'], ['flushp','r'], ['initd','i'], ['initda','i'], ['initi','r'], ['jmp','r'], ['jmpi','j'], ['ldb','i'],
['ldbio','i'], ['ldbu','i'], ['ldbuio','i'], ['ldh','i'], ['ldhio','i'], ['ldhu','i'], ['ldhuio','i'], ['ldw','i'],
['ldwio','i'], ['mov','r'], ['movhi','i'], ['movi','i'], ['movia','i'], ['movui','i'], ['mul','r'], ['muli','i'],
['mulxss','r'], ['mulxsu','r'], ['mulxuu','r'], ['nextpc','r'], ['nop','n'], ['nor','r'], ['or','r'], ['orhi','i'],
['ori','i'], ['rdctl','r'], ['rdprs','i'], ['ret','r'], ['rol','r'], ['roli','i'], ['ror','r'], ['sll','r'],
['slli','i'], ['sra','r'], ['srai','i'], ['srl','r'], ['srli','i'], ['stb','i'], ['stbio','i'], ['sth','i'],
['sthio','i'], ['stw','i'],['stwio','i'], ['sub','r'], ['subi','i'], ['sync','r'], ['trap','r'], ['wrctl','r'],
['wrprs','r'], ['xor','r'], ['xorhi','i'], ['xori','i'],['dowhile','j']
]);
let labels = new Map();

let asmFile = null;

// Object instances in main document
const hiddenInput = document.getElementById('hidden-input');
const customDz = document.getElementById('myDropzone');
const customTxt = document.getElementById('custom-text');

// Dropzone functions
customDz.onload = function () {
    // Browser API exception check
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // All the File APIs are supported.
    } else {
        customTxt.innerHTML = 'This browser does not support the required APIs';
    }
};

customDz.ondrop = function (event) {
    if (customTxt.innerHTML.indexOf('does not support') !== -1) return;
    event.preventDefault();
    customDz.className = 'dropzone';
    upload(event.dataTransfer.files);
};

customDz.ondragover = function () {
    customDz.className = 'dropzone dragover';
    return false;
};

customDz.ondragleave = function () {
    customDz.className = 'dropzone';
    return false;
};

// File upload functions
const upload = function (files) {
    if (files.length > 1) {
        alert('Please upload one file at a time');
        return;
    } else {
        asmFile = files[0];
    }
    verifyFile();
};

// Event listeners
customDz.addEventListener('click', function() {
    if (customTxt.innerHTML.indexOf('does not support') !== -1) return;
    hiddenInput.click();
});

hiddenInput.addEventListener('change', function() {
    let files = hiddenInput.files;
    asmFile = files[0];
    verifyFile();
});