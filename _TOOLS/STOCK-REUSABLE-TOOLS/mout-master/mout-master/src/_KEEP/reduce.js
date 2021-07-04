/*Array reduce
 */
function reduce(arr, fn, initVal) {
    let hasInit = arguments.length > 2,
        result = initVal;

    if (arr == null || !arr.length) {
        if (!hasInit) {
            throw new Error("reduce of empty array with no initial value");
        } else {
            return initVal;
        }
    }

    let i = -1,
        len = arr.length;
    while (++i < len) {
        if (!hasInit) {
            result = arr[i];
            hasInit = true;
        } else {
            result = fn(result, arr[i], i, arr);
        }
    }

    return result;
}

return reduce;