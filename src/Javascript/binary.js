/* Returns binary or integer as either signed or unsigned formats
 * Type inputs: ubin, bin, uint, int
 */
function binCap(value, type = 'int', length = 32) {
    // Convert value to 32 bit binary
    let bin = '';
    if (type.indexOf('u') === 0) {
        bin = (Math.abs(value) >>> 0).toString(2);
    } else bin = (value >>> 0).toString(2);

    // Cut binary if greater than
    if (bin.length > length) {
        bin = bin.substr(length - bin.length, bin.length);
    }

    // Return binary string or literal value
    if (type.indexOf('int') !== -1) {
        return parseInt(bin, 2) >> 0;
    } else if (type === 'bin' || type === 'ubin') {
        return bin;
    }
}