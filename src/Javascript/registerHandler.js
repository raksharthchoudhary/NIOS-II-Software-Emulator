function updateRegisterTable() {
    let clist = $("#registerValues"); // This reference speeds up the run time
    $("#registerValues").html("");
    clist.append(
        '<tr style = "background-color : darkgray">' +
            '<th>PC</th>' +
            '<th>' + pc * 4 + '</th>' +
            '<th></th>' +
        '</tr>' +
        '<tr>' +
            '<th>Register</th>' +
            '<th>Value</th>' +
            '<th>Hex</th>' +
        '</tr>'
    );
    for (let i = 0; i < 32; i++) {
        let r = "r";
        r += i;
        let value = reg[i];
        let hex = '0x' + parseInt(value).toString(16).toUpperCase();
        clist.append(
            '<tr>' +
                '<td align="left">' + r + '</td>' +
                '<td align="center">' + value + '</td>' +
                '<td align="center">' + hex +'</td>' +
            '</tr>'
        );
    }
}

function updateMemoryTable() {
    let clist = $("#memoryValues"); // This reference speeds up the run time
    $("#memoryValues").html("");
    clist.append(
        '<tr style="background-color: lightgray">' +
            '<th>Memory Table</th>' +
            '<th></th>' +
            '<th></th>' +
        '</tr>' +
        '<tr style="background-color: darkgray ">' +
            '<th>Memory Location</th>' +
            '<th>Data</th>' +
            '<th></th>' +
        '</tr>'
    );

    let memAddress = 0;
    for (let i = 0; i < 16; i++) {
        let hex = '0x' + memAddress.toString(16).toLocaleUpperCase();
        let id = 'tableRow' + i.toString();
        clist.append(
            '<tr id="'+ id +'">' +
                '<td align="center">' + hex + '</td>' +
                '<td>' + memoryCheck(memAddress) + '</td>' +
                '<td align="center"><button id="' + i +'" type="button" class="btn btn-default btn-md" ' +
                    'onclick= "memoryButton(id)">Select Memory Location</button></td>' +
            '</tr>'
        );
        memAddress++;
    }
}

function memoryCheck(memAddress) {
    let verify = memRead(memAddress);
    if (verify !== undefined) {
        return verify[verify.length - 1];
    } else {
        return "No Data";
    }
}

function memoryButton(id) {
    let address = prompt("Enter memory address:", "0x");
    document.getElementById('tableRow' + id.toString()).cells[0].innerHTML = address;
    document.getElementById('tableRow' + id.toString()).cells[1].innerHTML = memoryCheck(parseInt(address));
}