/* This file will handle all basic memory operations

                Design of Memory
     _______________________________________________
     |                                             |
     |                 R0                          |       0x00
     |_____________________________________________|
     |                                             |
     |                 R1                          |       0x01
     |_____________________________________________|
     |                                             |
     |                 R2                          |       0x02
     |_____________________________________________|
     |                                             |
     |                                             |
                        .
                        .
                        .
     |                                             |
     |_____________________________________________|
     |                                             |
     |                 R30                         |       0x1E
     |_____________________________________________|
     |                                             |
     |                 R31                         |       0x1F
     |_____________________________________________|
     |                                             |
     |                                             |
                        .
                        .
                        .
     |                                             |
     |_____________________________________________|
     |                                             |
     |         Start of Instructions               |       0x40
     |_____________________________________________|
     |                                             |
     |                                             |
                        .
                        .
                        .
     |                                             |
     |_____________________________________________|
     |                                             |
     |             End of Memory                   |       0xFFFF
     |_____________________________________________|                */

// Memory is represented in a 65,536 byte array
const MEMORY_SIZE = 65536;
let mem = [];
let reg = [];

mem[0xFFFF] = 0; // slider swtiches
mem[0xFFFE] = 0; // seven segment display


// Set up function of the memory
function memoryInit() {
    // Initializing all registers in memory to zero
    // Ex. mem[1] = r1 mem[2] = r2 ... mem[25] = r25
    if (newUpload) {
        // Clear memory and registers only if new file is uploaded
        mem = [];
        reg = [];
    }
    for (let i = 0; i < 32; i++) reg[i] = 0;
    pc = 0;
}

function regWrite(register, data) {
    reg[register] = data;
}

function regRead(register) {
    return reg[register];
}

// Writes data to memory at a certain address
function memWrite(memAddress, data) {
    mem[memAddress] = data;
}

// Reads array by address and return whats at that address
function memRead(memAddress) {
    return mem[memAddress];
}

// returns how much free space is left in bytes
function spaceFree() {
    let count = 0;
    for (let i = 0; i < MEMORY_SIZE; i++) {
        if (mem[i] !== undefined) count++;
    }
    return MEMORY_SIZE - count;
}

memoryInit();