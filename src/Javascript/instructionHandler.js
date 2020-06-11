// This file will handle execution of instructions
// Instruction Documentation: https://www.intel.com/content/www/us/en/programmable/documentation/iga1420498949526.html#iga1409764012031
// Omit wrctl, rdctl, eret, trap, wrprs, *io, possibly rdprs

let allInstructions = [
    'add', 'and', 'break', 'bret', 'callr', 'cmpeq', 'cmpgei', 'cmpgeu', 'cmplt', 'cmpltu',
    'cmpne', 'custom', 'div', 'divu', 'jmp', 'mov', 'mul', 'mulxss', 'mulxsu',
    'mulxuu', 'nextpc', 'nor', 'or', 'ret', 'rol', 'roli', 'ror', 'sll', 'slli', 'sra', 'srai', 'srl', 'srli',
    'sub', 'sync', 'xor', 'addi', 'andhi', 'andi', 'beq', 'bge', 'bgeu', 'bgt', 'bgtu', 'ble', 'bleu', 'blt', 'bltu', 'bne', 'br',
    'cmpeqi','cmpge', 'cmpgeui', 'cmpgt', 'cmpgti', 'cmpgtu', 'cmpgtui', 'cmple', 'cmplei', 'cmpleu',
    'cmpleui','cmplti', 'cmpltui', 'cmpnei', 'ldb', 'ldbu', 'ldh', 'ldhu',
    'ldw', 'movhi', 'movi', 'movia', 'movui', 'muli', 'orhi', 'ori', 'stb', 'sth', 'stw', 'subi', 'xorhi', 'xori', 'call', 'jmpi', 'nop'
];

/* R TYPE INSTRUCTIONS
6-bit opcode field
Three 5-bit register fields A, B, and C
11-bit opcode-extension field OPX
Instructions marked with * are pseudo-Instructions
39 Instructions:
add, and, break, bret, callr, cmpeq, cmpgei, cmpgeu, cmplt, cmpltu,
cmpne, custom, div, divu, jmp, *mov, mul, mulxss, mulxsu,
mulxuu, nextpc, nor, or, ret, rol, roli?, ror, sll, slli?, sra, srai?, srl, srli?,
sub, sync, xor,
 */
/* I TYPE INSTRUCTIONS
6-bit opcode field
Two 5-bit register fields A and B
A 16-bit immediate data field IMM16
Instructions marked with * are pseudo-Instructions
50 Instructions:
addi, andhi, andi, beq, bge, bgeu, *bgt, *bgtu, *ble, *bleu, blt, bltu, bne, br,
cmpeqi,cmpge, cmpgeui, *cmpgt, *cmpgti, *cmpgtu, *cmpgtui, *cmple, *cmplei, *cmpleu,
*cmpleui,cmplti, cmpltui, cmpnei, ldb, ldbu, ldh, ldhu,
 ldw, *movhi, *movi, *movia,  *movui, muli, orhi, ori, stb, sth, stw, *subi, xorhi, xori,
 */
/* J TYPE INSTRUCTIONS
6-bit opcode field
26 bit immediate field
Instructions:
call, jmpi,
 */

/* Might be used to deal with instructions that don't fit the types or for pseudo-Instructions
Instructions:
nop,
*/

function executeInstruction(address) {
    let data = memRead(address);
    if (data === undefined) {
        return 'Undefined memory';
    }
    let ra = null, rb = null, rc = null;
    let instruction = data[0];

    if (data[1] === 'r0') {
        return 'Cannot write to r0';
    }

    // Parse a, b, and c operands as registers if they exist
    if (data[1]) {
        if (data[1].indexOf('r') === 0) ra = parseOutReg(data[1]);
        else if (labels.has(data[1])) ra = labels.get(data[1]);
        else if (!isNaN(parseInt(data[1]))) {
            ra = parseInt(data[1]);
            if (ra> 0x80000000) {
                ra = ra - 0x100000000;
            }
        }
    }
    if (data[2]) {
        if (data[2].indexOf('r') === 0) rb = parseOutReg(data[2]);
        else if (labels.has(data[2])) rb = labels.get(data[2]);
        else if (!isNaN(parseInt(data[2]))) {
            rb = parseInt(data[2]);
            if (rb > 0x80000000) {
                rb = rb - 0x100000000;
            }
        }
    }
    if (data[3]) {
        if (data[3].indexOf('r') === 0) rc = parseOutReg(data[3]);
        else if (labels.has(data[3])) rc = labels.get(data[3]);
        else if (!isNaN(parseInt(data[3]))) {
            rc = parseInt(data[3]);
            if (rc > 0x80000000) {
                rc = rc - 0x100000000;
            }
        }
    }

    if (!instruction) {
        return 'Failure to retrieve instruction from address in InstructionHandler';
    }

    //R types ---------------------------------------------------------------------------
    if (instruction === 'add') {
        let result = regRead(rb) + regRead(rc);
        result = binCap(result);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'and') {
        let result = regRead(rb) & regRead(rc);
        result = binCap(result);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'break') {
        return 'break';

    } else if (instruction === 'bret') {
        //breakpoint return, so resume execution?
        return 1;

    } else if (instruction === 'callr') {
        regWrite(31, address + 1);
        return regRead(ra);

    } else if (instruction === 'cmpeq') {
        if (regRead(rb) === regRead(rc)) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'cmpgei') {
        if (regRead(rb) >= rc) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'cmpgeu') {
        let bVal = binCap(regRead(rb), 'uint');
        let cVal = binCap(regRead(rc), 'uint');
        if (bVal >= cVal) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'cmplt') {
        if (regRead(rb) <= regRead(rc)) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'cmpltu') {
        let bVal = binCap(regRead(rb), 'uint');
        let cVal = binCap(regRead(rc), 'uint');
        if (bVal <= cVal) {
            regWrite(ra, 1);
        } else {
            regWrite(rb, 0);
        }
        return 1;

    } else if (instruction === 'cmpne') {
        if (regRead(rb) !== regRead(rc)) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'custom') {
        return 1;

    } else if (instruction === 'div') {
        if (regRead(rc) === 0) {
            regWrite(ra, undefined);
        } else {
            let result = binCap(regRead(rb) / regRead(rc));
            regWrite(ra, result);
        }
        return 1;

    } else if (instruction === 'divu') {
        let bVal = binCap(regRead(rb), 'uint');
        let cVal = binCap(regRead(rc), 'uint');
        if (cVal === 0) {
            regWrite(ra, undefined);
        } else {
            let result = binCap(bVal / cVal);
            regWrite(ra, result);
        }
        return 1;

    } else if (instruction === 'jmp') {
        return regRead(ra);

    } else if (instruction === 'mov') {
        regWrite(ra, regRead(rb));
        return 1;

    } else if (instruction === 'mul') {
        let result = regRead(rb) * regRead(rc);
        result = binCap(result);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'mulxss') {
        let result = regRead(rb) * regRead(rc);
        result = binCap(result);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'mulxsu') {
        let cVal = binCap(regRead(rc), 'uint');
        let result = regRead(rb) * cVal;
        result = binCap(result);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'mulxuu') {
        let bVal = binCap(regRead(rb), 'uint');
        let cVal = binCap(regRead(rc), 'uint');
        let result = bVal * cVal;
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'nextpc') {
        // puts the address of the next instruction in the register;
        regWrite(ra, address+1);
        return 1;

    } else if (instruction === 'nor') {
        let result = ~(regRead(rb) | regRead(rc));
        result = binCap(result);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'or') {
        let result = regRead(rb) | regRead(rc);
        result = binCap(result);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'ret') {
        // return to address at r31
        return regRead(31);

    } else if (instruction === 'rol') {
        let bin = binCap(regRead(rb), 'bin');
        let rolled = bin.substring(0, regRead(rc) - 1);
        bin = bin.substring(regRead(rc), bin.length);
        bin = '0b' + bin + rolled;
        let result = parseInt(bin);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'roli') {
        let bin = binCap(regRead(rb), 'bin');
        let rolled = bin.substring(0, rc - 1);
        bin = bin.substring(rc, bin.length);
        bin = '0b' + bin + rolled;
        let result = parseInt(bin);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'ror') {
        let bin = binCap(regRead(rb), 'bin');
        let rolled = bin.substring(bin.length - regRead(rc), bin.length);
        bin = bin.substring(0 ,bin.length - regRead(rc) - 1 );
        bin = '0b' + rolled + bin;
        let result = parseInt(bin);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'sll') {
        let result = regRead(rb) << binCap(regRead(rc), 'int', 5);
        result = binCap(result);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'slli') {
        let result = regRead(rb) << binCap(rc, 'int', 5);
        result = binCap(result);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'sra') {
        let cVal = binCap(regRead(rc), 'uint', 5);
        let result = binCap(regRead(rb) >>> cVal);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'srai') {
        let cVal = binCap(rc, 'uint', 5);
        let result = binCap(regRead(rb) >>> cVal);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'srl') {
        let bVal = binCap(regRead(rb), 'uint');
        let cVal = binCap(regRead(rc), 'uint');
        let result = binCap(bVal >>> cVal);
        regWrite(ra, result); // TODO: Double check
        return 1;

    } else if (instruction === 'srli') {
        let bVal = binCap(regRead(rb), 'uint');
        let cVal = binCap(rc, 'uint');
        let result = binCap(bVal >>> cVal);
        regWrite(ra, result); // TODO: Double check
        return 1;

    } else if (instruction === 'sub') {
        let result = regRead(rb) - regRead(rc);
        result = binCap(result);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'sync') {
        return 1;

    } else if (instruction === 'xor') {
        let result = binCap(regRead(rb) ^ regRead(rc));
        regWrite(ra, result);
        return 1;

    }
    // I TYPES ------------------------------------------------------------------------------------------------------------
    else if (instruction === 'addi') {
        let result = regRead(rb) + rc;
        result = binCap(result);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'andhi') {
        let cBin = binCap(rc, 'ubin', 16) + '0000000000000000';
        let cVal = parseInt(cBin, 2);
        let result = regRead(rb) & cVal;
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'andi') {
        let result = regRead(rb) & rc;
        result = binCap(result);
        regWrite(parseOutReg(ra), result);
        return 1;

    } else if (instruction === 'beq') {
        if (regRead(ra) === regRead(rb)) {
            return rc;
        }
        return 1;

    } else if (instruction === 'bge') {
        if (regRead(ra) === regRead(rb)) {
            return rc;
        }
        return 1;

    } else if (instruction === 'bgeu') {
        let aVal = binCap(regRead(ra), 'uint');
        let bVal = binCap(regRead(rb), 'uint');
        if (aVal >= bVal) {
            return rc;
        }
        return 1;

    } else if (instruction === 'bgt') {
        if (regRead(ra) > regRead(rb)) {
            return rc;
        }
        return 1;

    } else if (instruction === 'bgtu') {
        let aVal = binCap(regRead(ra), 'uint');
        let bVal = binCap(regRead(rb), 'uint');
        if (aVal > bVal) {
            return rc;
        }
        return 1;

    } else if (instruction === 'ble') {
        if (regRead(ra) <= regRead(rb)) {
            return rc;
        }
        return 1;

    } else if (instruction === 'bleu') {
        let aVal = binCap(regRead(ra), 'uint');
        let bVal = binCap(regRead(rb), 'uint');
        if (aVal <= bVal) {
            return rc;
        }
        return 1;

    } else if (instruction === 'blt') {
        if (regRead(ra) < regRead(rb)) {
            return rc;
        }
        return 1;

    } else if (instruction === 'bltu') {
        let aVal = binCap(regRead(ra), 'uint');
        let bVal = binCap(regRead(rb), 'uint');
        if (aVal < bVal) {
            return rc;
        }
        return 1;

    } else if (instruction === 'bne') {
        if (regRead(ra) !== regRead(rb)) {
            return rc;
        }
        return 1;

    } else if (instruction === 'br') {
        if (address === ra) {
            return 'finished';
        }
        return ra;

    } else if (instruction === 'cmpeqi') {
        if (regRead(rb) === rc) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'cmpge') {
        if (regRead(rb) >= regRead(rc)) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'cmpgeui') {
        let bVal = binCap(regRead(rb), 'uint');
        let cVal = binCap(rc, 'uint');
        if (bVal >= cVal) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'cmpgt') {
        if (regRead(rb) > regRead(rc)) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'cmpgti') {
        if (regRead(rb) > rc) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'cmpgtu') {
        let bVal = binCap(regRead(rb), 'uint');
        let cVal = binCap(regRead(rc), 'uint');
        if (bVal > cVal) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'cmpgtui') {
        let bVal = binCap(regRead(rb), 'uint');
        let cVal = binCap(rc, 'uint');
        if (bVal > cVal) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'cmple') {
        if (regRead(rb) <= regRead(rb)) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'cmplei') {
        if (regRead(rb) <= rc) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'cmpleu') {
        let bVal = binCap(regRead(rb), 'uint');
        let cVal = binCap(regRead(rc), 'uint');
        if (bVal <= cVal) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'cmpleui') {
        let bVal = binCap(regRead(rb), 'uint');
        let cVal = binCap(rc, 'uint');
        if (bVal <= cVal) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'cmplti') {
        if (regRead(rb) < rc) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'cmpltui') {
        let bVal = binCap(regRead(rb), 'uint');
        let cVal = binCap(rc, 'uint');
        if (bVal <= cVal) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'cmpnei') {
        if (regRead(rb) < rc) {
            regWrite(ra, 1);
        } else {
            regWrite(ra, 0);
        }
        return 1;

    } else if (instruction === 'ldb') {
        if (isNaN(data[2])) {
            rc = rb;
            rb = 0;
        }
        let addressToRead = rb + regRead(rc);
        let result = binCap(memRead(addressToRead), 'int', 8);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'ldbu') {
        if (isNaN(data[2])) {
            rc = rb;
            rb = 0;
        }
        let addressToRead = rb + regRead(rc);
        let result = binCap(memRead(addressToRead), 'uint', 8);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'ldh') {
        if (isNaN(data[2])) {
            rc = rb;
            rb = 0;
        }
        let addressToRead = rb + regRead(rc);
        let result = binCap(memRead(addressToRead), 'int', 16);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'ldhu') {
        if (isNaN(data[2])) {
            rc = rb;
            rb = 0;
        }
        let addressToRead = rb + regRead(rc);
        let result = binCap(memRead(addressToRead), 'uint', 16);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'ldw') {
        if (isNaN(data[2])) {
            rc = rb;
            rb = 0;
        }
        let addressToRead = rb + regRead(rc);
        let result = memRead(addressToRead);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'movhi') {
        let bBin = binCap(rb, 'ubin', 16) + '0000000000000000';
        let bVal = parseInt(bBin, 2);
        regWrite(ra, bVal);
        return 1;

    } else if (instruction === 'movi') {
        regWrite(ra, rb);
        return 1;

    } else if (instruction === 'movia') {
        regWrite(ra, rb);
        return 1;

    } else if (instruction === 'movui') {
        let bVal = binCap(rb, 'uint');
        regWrite(ra, bVal);
        return 1;

    } else if (instruction === 'muli') {
        let result = binCap(regRead(rb) * rc);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'orhi') {
        let cBin = binCap(rc, 'ubin', 16) + '0000000000000000';
        let cVal = parseInt(cBin, 2);
        let result = regRead(rb) | cVal;
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'ori') {
        let result = binCap(regRead(rb) | rc);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'stb') {
        if (isNaN(data[2])) {
            rc = rb;
            rb = 0;
        }
        let addressToWrite = rb + regRead(rc);
        if (addressToWrite === 0xFFFE) {
            setSevenSegment(regRead(ra));
        }
        let result = binCap(regRead(ra), 'int', 8);
        memWrite(addressToWrite , result);
        return 1;

    } else if (instruction === 'sth') {
        if (isNaN(data[2])) {
            rc = rb;
            rb = 0;
        }
        let addressToWrite = rb + regRead(rc);
        if (addressToWrite === 0xFFFE) {
            setSevenSegment(regRead(ra));
        }
        let result = binCap(regRead(ra), 'int', 16);
        memWrite(addressToWrite , result);
        return 1;

    } else if (instruction === 'stw') {
        if (isNaN(data[2])) {
            rc = rb;
            rb = 0;
        }
        let addressToWrite = rb + regRead(rc);
        if (addressToWrite === 0xFFFE) {
            setSevenSegment(regRead(ra));
        }
        memWrite(addressToWrite , regRead(ra));
        return 1;

    } else if (instruction === 'subi') {
        let result = binCap(regRead(rb) - rc);
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'xorhi') {
        let cBin = binCap(rc, 'ubin', 16) + '0000000000000000';
        let cVal = parseInt(cBin, 2);
        let result = regRead(rb) ^ cVal;
        regWrite(ra, result);
        return 1;

    } else if (instruction === 'xori') {
        let result = binCap(regRead(rb) ^ rc);
        regWrite(ra, result);
        return 1;

    }
    // J Types --------------------------------------------------------------------------------------------
    else if (instruction === 'call') {
        // Use map to return address of label in data, set r31 to pc + 1;
        regWrite(31, address + 1);
        return ra;

    } else if (instruction === 'jmpi') {
        return ra;

    } else if (instruction === 'nop') {
        return 1;
    } else {
        return 'Instruction \'' + instruction + '\' was not able to be identified by the instruction handler'
    }
}

function parseOutReg(register) {
    if (register) {
        register = register.replace('r', '');
        return parseInt(register);
    }
}

function setSevenSegment(instruction) {
    // 32 bits for all 4 displays, each gets 8 bits
    // mem[0xFFFE] for seven segment display
    let display = [];
    display[0] =  instruction & 0x0000007F;
    display[1] = (instruction & 0x00007F00) >> 8;
    display[2] = (instruction & 0x007F0000) >> 16;
    display[3] = (instruction & 0x7F000000) >> 24;

    for (let i = 0; i<4; i++) {
        if (display[i] === 0x3f) display[i] = '0';
        else if (display[i] === 0x06) display[i] = '1';
        else if (display[i] === 0x5B) display[i] = '2';
        else if (display[i] === 0x4F) display[i] = '3';
        else if (display[i] === 0x26) display[i] = '4';
        else if (display[i] === 0x5D) display[i] = '5';
        else if (display[i] === 0x7D) display[i] = '6';
        else if (display[i] === 0x07) display[i] = '7';
        else if (display[i] === 0x07) display[i] = '8';
        else if (display[i] === 0x67) display[i] = '9';
        else if (display[i] === 0x40) display[i] = '-';
        else if (display[i] === 0x77) display[i] = 'A';
        else if (display[i] === 0x7C) display[i] = 'b';
        else if (display[i] === 0x39) display[i] = 'C';
        else if (display[i] === 0x5E) display[i] = 'd';
        else if (display[i] === 0x79) display[i] = 'E';
        else if (display[i] === 0x71) display[i] = 'F';
        else display[i] = '';
    }

    document.getElementById('segmentRow').cells[0].innerHTML = display[3];
    document.getElementById('segmentRow').cells[1].innerHTML = display[2];
    document.getElementById('segmentRow').cells[2].innerHTML = display[1];
    document.getElementById('segmentRow').cells[3].innerHTML = display[0];
}


