let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextDecoder, TextEncoder } = require(String.raw`util`);

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_24(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hd8c11c84ee44bd81(arg0, arg1, addHeapObject(arg2));
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
* @param {number} day_of_year
* @param {number} latitude
* @param {number} time_of_day
* @returns {number}
*/
module.exports.photosynthetically_active_radiation = function(day_of_year, latitude, time_of_day) {
    var ret = wasm.photosynthetically_active_radiation(day_of_year, latitude, time_of_day);
    return ret;
};

/**
*    Compile the shaders and link them to a program, returning the pointer to the executable
*    in GPU memory.
*
*    This is the high-level routine called directly from JavaScript.
* @param {WebGLRenderingContext} ctx
* @param {string} vertex
* @param {string} fragment
* @returns {WebGLProgram}
*/
module.exports.create_program = function(ctx, vertex, fragment) {
    try {
        var ptr0 = passStringToWasm0(vertex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(fragment, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.create_program(addBorrowedObject(ctx), ptr0, len0, ptr1, len1);
        return takeObject(ret);
    } finally {
        heap[stack_pointer++] = undefined;
    }
};

let cachegetFloat32Memory0 = null;
function getFloat32Memory0() {
    if (cachegetFloat32Memory0 === null || cachegetFloat32Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat32Memory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachegetFloat32Memory0;
}

function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4);
    getFloat32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
*    Memory buffers are used to store array data for visualization.
*
*    This could be colors, or positions, or offsets, or velocities.
* @param {WebGLRenderingContext} ctx
* @param {Float32Array} data
* @returns {WebGLBuffer}
*/
module.exports.create_buffer = function(ctx, data) {
    try {
        var ptr0 = passArrayF32ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.create_buffer(addBorrowedObject(ctx), ptr0, len0);
        return takeObject(ret);
    } finally {
        heap[stack_pointer++] = undefined;
    }
};

/**
*    Activate the chosen texture so that GL operations on textures will target it. The
*    texture number is [0,...) and can be accessed sequentially by offset.
*
*    Currently we only support 2D textures, which can be stacked to emulate 3D.
* @param {WebGLRenderingContext} ctx
* @param {WebGLTexture} texture
* @param {number} unit
*/
module.exports.bind_texture = function(ctx, texture, unit) {
    try {
        wasm.bind_texture(addBorrowedObject(ctx), addHeapObject(texture), unit);
    } finally {
        heap[stack_pointer++] = undefined;
    }
};

/**
*    Define a 2D array in GPU memory, and bind it for GL operations.
* @param {WebGLRenderingContext} ctx
* @param {ImageData} data
* @param {number} filter
* @param {number} _width
* @param {number} _height
* @returns {WebGLTexture}
*/
module.exports.create_texture = function(ctx, data, filter, _width, _height) {
    try {
        var ret = wasm.create_texture(addBorrowedObject(ctx), addBorrowedObject(data), filter, _width, _height);
        return takeObject(ret);
    } finally {
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
};

/**
*    After generating the base data array, clamp it and create a new
*    array as a JavaScript/HTML image data element.
* @param {number} world_size
* @param {number} water_level
* @returns {ImageData}
*/
module.exports.image_data = function(world_size, water_level) {
    var ret = wasm.image_data(world_size, water_level);
    return takeObject(ret);
};

/**
* @param {number} jj
* @param {number} length
* @param {number} grid_size
* @returns {number}
*/
module.exports.x_transform = function(jj, length, grid_size) {
    var ret = wasm.x_transform(jj, length, grid_size);
    return ret;
};

/**
* @param {number} xx
* @param {number} phase
* @param {number} width
* @returns {number}
*/
module.exports.z_transform = function(xx, phase, width) {
    var ret = wasm.z_transform(xx, phase, width);
    return ret;
};

/**
* @param {string} name
* @returns {string}
*/
module.exports.hello_world = function(name) {
    try {
        const retptr = wasm.__wbindgen_export_4.value - 16;
        wasm.__wbindgen_export_4.value = retptr;
        var ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.hello_world(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_export_4.value += 16;
        wasm.__wbindgen_free(r0, r1);
    }
};

/**
*/
module.exports.panic_hook = function() {
    wasm.panic_hook();
};

/**
* @param {any} _color
* @returns {CanvasRenderingContext2D}
*/
module.exports.create_color_map_canvas = function(_color) {
    var ret = wasm.create_color_map_canvas(addHeapObject(_color));
    return takeObject(ret);
};

/**
* @param {CanvasRenderingContext2D} ctx
* @param {number} w
* @param {number} h
* @param {any} color
*/
module.exports.clear_rect_blending = function(ctx, w, h, color) {
    try {
        wasm.clear_rect_blending(addBorrowedObject(ctx), w, h, addHeapObject(color));
    } finally {
        heap[stack_pointer++] = undefined;
    }
};

/**
* @param {CanvasRenderingContext2D} ctx
* @param {string} caption
* @param {number} x
* @param {number} y
* @param {any} color
* @param {string} font
*/
module.exports.draw_caption = function(ctx, caption, x, y, color, font) {
    try {
        var ptr0 = passStringToWasm0(caption, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(font, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        wasm.draw_caption(addBorrowedObject(ctx), ptr0, len0, x, y, addBorrowedObject(color), ptr1, len1);
    } finally {
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
};

/**
* @param {CanvasRenderingContext2D} ctx
* @param {number} frames
* @param {number} time
* @param {any} color
* @returns {number}
*/
module.exports.draw_fps = function(ctx, frames, time, color) {
    try {
        var ret = wasm.draw_fps(addBorrowedObject(ctx), frames, time, addBorrowedObject(color));
        return ret >>> 0;
    } finally {
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
};

/**
* @param {CanvasRenderingContext2D} ctx
* @param {number} x
* @param {number} y
* @param {number} scale
* @param {any} color
*/
module.exports.draw_single_pixel = function(ctx, x, y, scale, color) {
    try {
        wasm.draw_single_pixel(addBorrowedObject(ctx), x, y, scale, addHeapObject(color));
    } finally {
        heap[stack_pointer++] = undefined;
    }
};

/**
* @param {number} size
* @returns {number}
*/
module.exports.alloc = function(size) {
    var ret = wasm.alloc(size);
    return ret;
};

/**
* @param {number} ptr
* @param {number} cap
*/
module.exports.dealloc = function(ptr, cap) {
    wasm.dealloc(ptr, cap);
};

/**
* @param {string} path
* @returns {any}
*/
module.exports.fetch_text = function(path) {
    var ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.fetch_text(ptr0, len0);
    return takeObject(ret);
};

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8);
    getFloat64Memory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayF64FromWasm0(ptr, len) {
    return getFloat64Memory0().subarray(ptr / 8, ptr / 8 + len);
}
/**
* @param {Float64Array} series
* @returns {Float64Array}
*/
module.exports.make_vertex_array = function(series) {
    try {
        const retptr = wasm.__wbindgen_export_4.value - 16;
        wasm.__wbindgen_export_4.value = retptr;
        var ptr0 = passArrayF64ToWasm0(series, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.make_vertex_array(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayF64FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 8);
        return v1;
    } finally {
        wasm.__wbindgen_export_4.value += 16;
    }
};

function isLikeNone(x) {
    return x === undefined || x === null;
}

function handleError(f) {
    return function () {
        try {
            return f.apply(this, arguments);

        } catch (e) {
            wasm.__wbindgen_exn_store(addHeapObject(e));
        }
    };
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachegetUint8ClampedMemory0 = null;
function getUint8ClampedMemory0() {
    if (cachegetUint8ClampedMemory0 === null || cachegetUint8ClampedMemory0.buffer !== wasm.memory.buffer) {
        cachegetUint8ClampedMemory0 = new Uint8ClampedArray(wasm.memory.buffer);
    }
    return cachegetUint8ClampedMemory0;
}

function getClampedArrayU8FromWasm0(ptr, len) {
    return getUint8ClampedMemory0().subarray(ptr / 1, ptr / 1 + len);
}
function __wbg_adapter_242(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h612f064297571433(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }
/**
*/
class ContextCursor {

    static __wrap(ptr) {
        const obj = Object.create(ContextCursor.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_contextcursor_free(ptr);
    }
    /**
    * @param {number} x
    * @param {number} y
    */
    constructor(x, y) {
        var ret = wasm.contextcursor_new(x, y);
        return ContextCursor.__wrap(ret);
    }
    /**
    * @param {CanvasRenderingContext2D} ctx
    * @param {number} theta
    * @param {number} n
    * @param {number} a
    * @param {number} b
    */
    static ticks(ctx, theta, n, a, b) {
        try {
            wasm.contextcursor_ticks(addBorrowedObject(ctx), theta, n, a, b);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {number} x
    * @param {number} y
    */
    update(x, y) {
        wasm.contextcursor_update(this.ptr, x, y);
    }
    /**
    * @param {CanvasRenderingContext2D} ctx
    * @param {number} w
    * @param {number} h
    * @param {any} color
    * @param {number} time
    * @param {number} line_width
    */
    draw(ctx, w, h, color, time, line_width) {
        try {
            wasm.contextcursor_draw(this.ptr, addBorrowedObject(ctx), w, h, addBorrowedObject(color), time, line_width);
        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
}
module.exports.ContextCursor = ContextCursor;
/**
*    Features are used in multiple ways. Both by the probability table.
*    and by the game interface.
*/
class Feature {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_feature_free(ptr);
    }
}
module.exports.Feature = Feature;
/**
*/
class HexagonalGrid {

    static __wrap(ptr) {
        const obj = Object.create(HexagonalGrid.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_hexagonalgrid_free(ptr);
    }
    /**
    * @param {number} nx
    */
    constructor(nx) {
        var ret = wasm.hexagonalgrid_new(nx);
        return HexagonalGrid.__wrap(ret);
    }
    /**
    * @param {CanvasRenderingContext2D} ctx
    * @param {number} w
    * @param {number} h
    * @param {number} mx
    * @param {number} my
    * @param {any} color
    * @param {number} line_width
    * @param {number} _alpha
    */
    draw(ctx, w, h, mx, my, color, line_width, _alpha) {
        try {
            wasm.hexagonalgrid_draw(this.ptr, addBorrowedObject(ctx), w, h, mx, my, addHeapObject(color), line_width, _alpha);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
module.exports.HexagonalGrid = HexagonalGrid;
/**
*/
class InteractiveDataStream {

    static __wrap(ptr) {
        const obj = Object.create(InteractiveDataStream.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_interactivedatastream_free(ptr);
    }
    /**
    *        Create a new container without making too many assumptions
    *        abour how it will be used. Mostly streams are dynamically
    *        constructed on the JavaScript side.
    * @param {number} capacity
    */
    constructor(capacity) {
        var ret = wasm.interactivedatastream_new(capacity);
        return InteractiveDataStream.__wrap(ret);
    }
    /**
    *        Compose the data-driven visualization and draw to the target HtmlCanvasElement.
    * @param {HTMLCanvasElement} canvas
    * @param {number} time
    * @param {any} style
    */
    draw(canvas, time, style) {
        wasm.interactivedatastream_draw(this.ptr, addHeapObject(canvas), time, addHeapObject(style));
    }
    /**
    *        Hoist the datastream push method, needed to ensure JavaScript binding
    * @param {number} x
    * @param {number} y
    */
    push(x, y) {
        wasm.interactivedatastream_push(this.ptr, x, y);
    }
    /**
    *        Hoist data stream size getter, needed to ensure JavaScript binding
    * @returns {number}
    */
    size() {
        var ret = wasm.interactivedatastream_size(this.ptr);
        return ret >>> 0;
    }
    /**
    *        Hoist cursor setter, needed to ensure JavaScript binding
    * @param {number} x
    * @param {number} y
    */
    update_cursor(x, y) {
        wasm.interactivedatastream_update_cursor(this.ptr, x, y);
    }
}
module.exports.InteractiveDataStream = InteractiveDataStream;
/**
* Container for rectilinear grid that also has a cursor reference,
* and keeps track of metadata related to sampling and rendering.
*/
class InteractiveGrid {

    static __wrap(ptr) {
        const obj = Object.create(InteractiveGrid.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_interactivegrid_free(ptr);
    }
    /**
    * JavaScript binding for creating a new interactive grid container
    * @param {number} nx
    * @param {number} ny
    * @param {number} nz
    * @param {number} stencil
    */
    constructor(nx, ny, nz, stencil) {
        var ret = wasm.interactivegrid_new(nx, ny, nz, stencil);
        return InteractiveGrid.__wrap(ret);
    }
    /**
    * Hoisting function for cursor updates from JavaScript.
    * Prevents null references in some cases.
    * @param {number} x
    * @param {number} y
    */
    update_cursor(x, y) {
        wasm.interactivegrid_update_cursor(this.ptr, x, y);
    }
    /**
    * Animation frame is used as a visual feedback test
    * that utilizes most public methods of the data structure.
    * @param {HTMLCanvasElement} canvas
    * @param {number} time
    * @param {any} style
    */
    draw(canvas, time, style) {
        wasm.interactivegrid_draw(this.ptr, addHeapObject(canvas), time, addHeapObject(style));
    }
}
module.exports.InteractiveGrid = InteractiveGrid;
/**
*/
class InteractiveGroup {

    static __wrap(ptr) {
        const obj = Object.create(InteractiveGroup.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_interactivegroup_free(ptr);
    }
    /**
    * @param {number} count
    * @param {number} length
    * @param {number} spring_constant
    * @param {number} length_variability
    */
    constructor(count, length, spring_constant, length_variability) {
        var ret = wasm.interactivegroup_new(count, length, spring_constant, length_variability);
        return InteractiveGroup.__wrap(ret);
    }
    /**
    * @param {number} x
    * @param {number} y
    */
    updateCursor(x, y) {
        wasm.interactivegroup_updateCursor(this.ptr, x, y);
    }
    /**
    * @param {number} drag
    * @param {number} bounce
    * @param {number} dt
    * @param {number} collision_threshold
    */
    updateState(drag, bounce, dt, collision_threshold) {
        wasm.interactivegroup_updateState(this.ptr, drag, bounce, dt, collision_threshold);
    }
    /**
    * @param {HTMLCanvasElement} canvas
    * @param {number} time
    * @param {number} collision
    * @param {any} style
    */
    draw(canvas, time, collision, style) {
        wasm.interactivegroup_draw(this.ptr, addHeapObject(canvas), time, collision, addHeapObject(style));
    }
}
module.exports.InteractiveGroup = InteractiveGroup;
/**
*/
class InteractiveMesh {

    static __wrap(ptr) {
        const obj = Object.create(InteractiveMesh.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_interactivemesh_free(ptr);
    }
    /**
    * @param {number} nx
    * @param {number} ny
    */
    constructor(nx, ny) {
        var ret = wasm.interactivemesh_new(nx, ny);
        return InteractiveMesh.__wrap(ret);
    }
    /**
    * @param {HTMLCanvasElement} canvas
    * @param {any} background
    * @param {any} _color
    * @param {any} overlay
    * @param {number} line_width
    * @param {number} font_size
    * @param {number} tick_size
    * @param {number} label_padding
    * @param {number} time
    */
    draw(canvas, background, _color, overlay, line_width, font_size, tick_size, label_padding, time) {
        wasm.interactivemesh_draw(this.ptr, addHeapObject(canvas), addHeapObject(background), addHeapObject(_color), addHeapObject(overlay), line_width, font_size, tick_size, label_padding, time);
    }
    /**
    * @param {number} x
    * @param {number} y
    */
    update_cursor(x, y) {
        wasm.interactivemesh_update_cursor(this.ptr, x, y);
    }
    /**
    * @param {number} angle
    * @param {number} ax
    * @param {number} ay
    * @param {number} az
    */
    rotate(angle, ax, ay, az) {
        wasm.interactivemesh_rotate(this.ptr, angle, ax, ay, az);
    }
}
module.exports.InteractiveMesh = InteractiveMesh;
/**
*     The Island Kernel is used to generate island features
*     when the program is used in generative mode.
*/
class IslandKernel {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_islandkernel_free(ptr);
    }
    /**
    * @returns {number}
    */
    get mask() {
        var ret = wasm.__wbg_get_islandkernel_mask(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set mask(arg0) {
        wasm.__wbg_set_islandkernel_mask(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get depth() {
        var ret = wasm.__wbg_get_islandkernel_depth(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set depth(arg0) {
        wasm.__wbg_set_islandkernel_depth(this.ptr, arg0);
    }
}
module.exports.IslandKernel = IslandKernel;
/**
*    The MiniMap is a data structure and interactive container.
*    It contains persistent world data as a raster, and exposes
*    selection and subsetting methods to explore subareas.
*/
class MiniMap {

    static __wrap(ptr) {
        const obj = Object.create(MiniMap.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_minimap_free(ptr);
    }
    /**
    * Constructor to init the data structure from JavaScript.
    * @param {number} vx
    * @param {number} vy
    * @param {number} world_size
    * @param {number} water_level
    * @param {CanvasRenderingContext2D} ctx
    * @param {number} grid_size
    */
    constructor(vx, vy, world_size, water_level, ctx, grid_size) {
        var ret = wasm.minimap_new(vx, vy, world_size, water_level, addHeapObject(ctx), grid_size);
        return MiniMap.__wrap(ret);
    }
    /**
    * @param {number} jj
    * @param {number} index
    * @param {number} length
    * @param {number} width
    * @param {number} phase
    * @returns {string}
    */
    get_dynamic_tile(jj, index, length, width, phase) {
        try {
            const retptr = wasm.__wbindgen_export_4.value - 16;
            wasm.__wbindgen_export_4.value = retptr;
            wasm.minimap_get_dynamic_tile(retptr, this.ptr, jj, index, length, width, phase);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_4.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {CanvasRenderingContext2D} ctx
    * @param {number} ii
    * @param {number} jj
    * @param {number} length
    * @param {number} time
    * @param {number} width
    * @param {number} tile
    */
    drawTile(ctx, ii, jj, length, time, width, tile) {
        wasm.minimap_drawTile(this.ptr, addHeapObject(ctx), ii, jj, length, time, width, tile);
    }
    /**
    * Public interface to update actions
    * @param {number} actions
    */
    set_actions(actions) {
        wasm.minimap_set_actions(this.ptr, actions);
    }
    /**
    * Get remaining actions from Javascript
    * @returns {number}
    */
    actions() {
        var ret = wasm.minimap_actions(this.ptr);
        return ret >>> 0;
    }
    /**
    * Hoist the insert feature method and rename it for
    * web interface
    * @param {any} feature
    */
    insertFeature(feature) {
        wasm.minimap_insertFeature(this.ptr, addHeapObject(feature));
    }
    /**
    * Hoist the score calculating method
    * @returns {number}
    */
    score() {
        var ret = wasm.minimap_score(this.ptr);
        return ret;
    }
    /**
    * Get the JSON serialized tile data from a linear index.
    * @param {number} index
    * @returns {any}
    */
    get_tile(index) {
        var ret = wasm.minimap_get_tile(this.ptr, index);
        return takeObject(ret);
    }
    /**
    * Hoist the replace tile function to make it
    * available from JavaScript interface.
    * This swaps out a tile for another tile.
    * @param {number} ii
    * @param {number} jj
    */
    replaceTile(ii, jj) {
        wasm.minimap_replaceTile(this.ptr, ii, jj);
    }
    /**
    */
    clear() {
        wasm.minimap_clear(this.ptr);
    }
    /**
    * @param {number} ind
    * @param {number} ii
    * @param {number} jj
    * @returns {number}
    */
    insertTile(ind, ii, jj) {
        var ret = wasm.minimap_insertTile(this.ptr, ind, ii, jj);
        return ret >>> 0;
    }
    /**
    * @param {number} index
    * @returns {number}
    */
    get_mask(index) {
        var ret = wasm.minimap_get_mask(this.ptr, index);
        return ret;
    }
    /**
    * @param {CanvasRenderingContext2D} ctx
    * @returns {ImageData}
    */
    visible(ctx) {
        try {
            var ret = wasm.minimap_visible(this.ptr, addBorrowedObject(ctx));
            return takeObject(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    *        Access method for current view
    * @returns {number}
    */
    view_x() {
        var ret = wasm.minimap_view_x(this.ptr);
        return ret;
    }
    /**
    *        Access method for current view
    * @returns {number}
    */
    view_y() {
        var ret = wasm.minimap_view_y(this.ptr);
        return ret;
    }
    /**
    *        Move the field of view in the overall world image. Input is used
    *        my onClick events to navigate around the map.
    * @param {CanvasRenderingContext2D} ctx
    * @param {number} vx
    * @param {number} vy
    */
    updateView(ctx, vx, vy) {
        wasm.minimap_updateView(this.ptr, addHeapObject(ctx), vx, vy);
    }
    /**
    *        Make a white box, that will be filled in with image
    *        data to form a frame.
    * @param {CanvasRenderingContext2D} ctx
    */
    draw_bbox(ctx) {
        try {
            wasm.minimap_draw_bbox(this.ptr, addBorrowedObject(ctx));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    *        Draw the image data, then a square, and then fill the square with part of the image data again to form
    *        a frame
    * @param {CanvasRenderingContext2D} ctx
    */
    draw_image_data(ctx) {
        try {
            wasm.minimap_draw_image_data(this.ptr, addBorrowedObject(ctx));
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
module.exports.MiniMap = MiniMap;
/**
*/
class SimpleCursor {

    static __wrap(ptr) {
        const obj = Object.create(SimpleCursor.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_simplecursor_free(ptr);
    }
    /**
    * @returns {number}
    */
    get x() {
        var ret = wasm.__wbg_get_simplecursor_x(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set x(arg0) {
        wasm.__wbg_set_simplecursor_x(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get y() {
        var ret = wasm.__wbg_get_simplecursor_y(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set y(arg0) {
        wasm.__wbg_set_simplecursor_y(this.ptr, arg0);
    }
    /**
    * @param {number} x
    * @param {number} y
    */
    constructor(x, y) {
        var ret = wasm.contextcursor_new(x, y);
        return SimpleCursor.__wrap(ret);
    }
    /**
    * @param {number} x
    * @param {number} y
    */
    update(x, y) {
        wasm.contextcursor_update(this.ptr, x, y);
    }
    /**
    * @param {CanvasRenderingContext2D} ctx
    * @param {number} w
    * @param {number} h
    * @param {any} color
    * @param {number} font_size
    * @param {number} line_width
    * @param {number} tick_size
    * @param {number} completeness
    * @param {number} label_padding
    */
    draw(ctx, w, h, color, font_size, line_width, tick_size, completeness, label_padding) {
        try {
            wasm.simplecursor_draw(this.ptr, addBorrowedObject(ctx), w, h, addBorrowedObject(color), font_size, line_width, tick_size, completeness, label_padding);
        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
}
module.exports.SimpleCursor = SimpleCursor;
/**
*/
class Texture2D {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_texture2d_free(ptr);
    }
    /**
    * @param {CanvasRenderingContext2D} ctx
    * @param {number} _w
    * @param {number} _h
    * @param {number} _frame
    * @param {number} time
    */
    static fill_canvas(ctx, _w, _h, _frame, time) {
        try {
            wasm.texture2d_fill_canvas(addBorrowedObject(ctx), _w, _h, _frame, time);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
}
module.exports.Texture2D = Texture2D;
/**
*    Tiles are individual features, aka the instance of
*    a type of feature, which is stored in memory and may be
*    modified to deviate from the basic rules.
*
*    These are used in the TileSet struct.
*
*    These have:
*    - feature: unique string identifying the base type
*    - flip: render left or right facing sprite
*    - value: passive value toward total score
*    - frame_offset: start frame to desync animations
*/
class Tile {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_tile_free(ptr);
    }
}
module.exports.Tile = Tile;
/**
* Tileset collects data structures related to generating and saving
* features in the game.
* Tiles are stored in `tiles`.
* Current count of each type is stored
* in a HashMap indexed by tile type, and mapping of diagonal indices
* to linear indices is stored in a another HashMap.
*/
class TileSet {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_tileset_free(ptr);
    }
}
module.exports.TileSet = TileSet;

module.exports.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

module.exports.__wbindgen_json_parse = function(arg0, arg1) {
    var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbindgen_json_serialize = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = JSON.stringify(obj === undefined ? null : obj);
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbindgen_cb_drop = function(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    var ret = false;
    return ret;
};

module.exports.__wbg_instanceof_Window_d64060d13377409b = function(arg0) {
    var ret = getObject(arg0) instanceof Window;
    return ret;
};

module.exports.__wbg_document_bcf9d67bc56e8c6d = function(arg0) {
    var ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

module.exports.__wbg_fetch_b3f48cf99ebd282a = function(arg0, arg1) {
    var ret = getObject(arg0).fetch(getObject(arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_createElement_467bb064d2ae5833 = handleError(function(arg0, arg1, arg2) {
    var ret = getObject(arg0).createElement(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
});

module.exports.__wbindgen_object_clone_ref = function(arg0) {
    var ret = getObject(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_addColorStop_c75d1d727f815743 = handleError(function(arg0, arg1, arg2, arg3) {
    getObject(arg0).addColorStop(arg1, getStringFromWasm0(arg2, arg3));
});

module.exports.__wbg_set_234288aa11f3e098 = handleError(function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).set(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
});

module.exports.__wbg_instanceof_Response_acb554d7c391aef7 = function(arg0) {
    var ret = getObject(arg0) instanceof Response;
    return ret;
};

module.exports.__wbg_text_83594a5e8d9e514a = handleError(function(arg0) {
    var ret = getObject(arg0).text();
    return addHeapObject(ret);
});

module.exports.__wbg_headers_1edd511ef1b065ca = function(arg0) {
    var ret = getObject(arg0).headers;
    return addHeapObject(ret);
};

module.exports.__wbg_newwithstrandinit_54427750de69ea87 = handleError(function(arg0, arg1, arg2) {
    var ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
    return addHeapObject(ret);
});

module.exports.__wbg_bufferData_e135b678b6ef2433 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).bufferData(arg1 >>> 0, getObject(arg2), arg3 >>> 0);
};

module.exports.__wbg_texImage2D_154146e05cef429c = handleError(function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    getObject(arg0).texImage2D(arg1 >>> 0, arg2, arg3, arg4 >>> 0, arg5 >>> 0, getObject(arg6));
});

module.exports.__wbg_activeTexture_a4d9c550dcacf795 = function(arg0, arg1) {
    getObject(arg0).activeTexture(arg1 >>> 0);
};

module.exports.__wbg_attachShader_9958cc9636fc8494 = function(arg0, arg1, arg2) {
    getObject(arg0).attachShader(getObject(arg1), getObject(arg2));
};

module.exports.__wbg_bindBuffer_c96c99b259d952f4 = function(arg0, arg1, arg2) {
    getObject(arg0).bindBuffer(arg1 >>> 0, getObject(arg2));
};

module.exports.__wbg_bindTexture_998c063ed7315afd = function(arg0, arg1, arg2) {
    getObject(arg0).bindTexture(arg1 >>> 0, getObject(arg2));
};

module.exports.__wbg_compileShader_82966bc7f1d070fe = function(arg0, arg1) {
    getObject(arg0).compileShader(getObject(arg1));
};

module.exports.__wbg_createBuffer_501da6aef1c4b91c = function(arg0) {
    var ret = getObject(arg0).createBuffer();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

module.exports.__wbg_createProgram_531dab3c15c28e4f = function(arg0) {
    var ret = getObject(arg0).createProgram();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

module.exports.__wbg_createShader_376b269548a48c7a = function(arg0, arg1) {
    var ret = getObject(arg0).createShader(arg1 >>> 0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

module.exports.__wbg_createTexture_77f1141b79fa578d = function(arg0) {
    var ret = getObject(arg0).createTexture();
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

module.exports.__wbg_getProgramInfoLog_5def5bb3d8d30e1f = function(arg0, arg1, arg2) {
    var ret = getObject(arg1).getProgramInfoLog(getObject(arg2));
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbg_getProgramParameter_c021157c5817259f = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).getProgramParameter(getObject(arg1), arg2 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbg_getShaderInfoLog_b619769ff40aac70 = function(arg0, arg1, arg2) {
    var ret = getObject(arg1).getShaderInfoLog(getObject(arg2));
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbg_getShaderParameter_d03718a8c98a4d23 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).getShaderParameter(getObject(arg1), arg2 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbg_linkProgram_9e60adcb42d34c3c = function(arg0, arg1) {
    getObject(arg0).linkProgram(getObject(arg1));
};

module.exports.__wbg_shaderSource_c208cc7a688e8923 = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).shaderSource(getObject(arg1), getStringFromWasm0(arg2, arg3));
};

module.exports.__wbg_texParameteri_d819847181bb4c5a = function(arg0, arg1, arg2, arg3) {
    getObject(arg0).texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
};

module.exports.__wbg_instanceof_CanvasRenderingContext2d_1112667cc1f23532 = function(arg0) {
    var ret = getObject(arg0) instanceof CanvasRenderingContext2D;
    return ret;
};

module.exports.__wbg_setglobalAlpha_38e9b8a563afafa7 = function(arg0, arg1) {
    getObject(arg0).globalAlpha = arg1;
};

module.exports.__wbg_setstrokeStyle_4af370453cc9beef = function(arg0, arg1) {
    getObject(arg0).strokeStyle = getObject(arg1);
};

module.exports.__wbg_setfillStyle_379229e7549f4190 = function(arg0, arg1) {
    getObject(arg0).fillStyle = getObject(arg1);
};

module.exports.__wbg_setlineWidth_791bd882f2c95620 = function(arg0, arg1) {
    getObject(arg0).lineWidth = arg1;
};

module.exports.__wbg_setlineCap_f80e51156fa227b9 = function(arg0, arg1, arg2) {
    getObject(arg0).lineCap = getStringFromWasm0(arg1, arg2);
};

module.exports.__wbg_setfont_02a2069b464f8be9 = function(arg0, arg1, arg2) {
    getObject(arg0).font = getStringFromWasm0(arg1, arg2);
};

module.exports.__wbg_drawImage_0bd4e512109731d5 = handleError(function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
    getObject(arg0).drawImage(getObject(arg1), arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
});

module.exports.__wbg_beginPath_3fa944f9f04ab627 = function(arg0) {
    getObject(arg0).beginPath();
};

module.exports.__wbg_fill_591769697a512b9a = function(arg0) {
    getObject(arg0).fill();
};

module.exports.__wbg_stroke_80ff74c82b2000f2 = function(arg0) {
    getObject(arg0).stroke();
};

module.exports.__wbg_createLinearGradient_813e324ba7a40ba2 = function(arg0, arg1, arg2, arg3, arg4) {
    var ret = getObject(arg0).createLinearGradient(arg1, arg2, arg3, arg4);
    return addHeapObject(ret);
};

module.exports.__wbg_getImageData_3ed5d135de4d3339 = handleError(function(arg0, arg1, arg2, arg3, arg4) {
    var ret = getObject(arg0).getImageData(arg1, arg2, arg3, arg4);
    return addHeapObject(ret);
});

module.exports.__wbg_putImageData_b290181a4e24024c = handleError(function(arg0, arg1, arg2, arg3) {
    getObject(arg0).putImageData(getObject(arg1), arg2, arg3);
});

module.exports.__wbg_arc_a76d718c10697300 = handleError(function(arg0, arg1, arg2, arg3, arg4, arg5) {
    getObject(arg0).arc(arg1, arg2, arg3, arg4, arg5);
});

module.exports.__wbg_closePath_645de671318f9598 = function(arg0) {
    getObject(arg0).closePath();
};

module.exports.__wbg_lineTo_2f564751588d678e = function(arg0, arg1, arg2) {
    getObject(arg0).lineTo(arg1, arg2);
};

module.exports.__wbg_moveTo_7b8c1f8d728e56d3 = function(arg0, arg1, arg2) {
    getObject(arg0).moveTo(arg1, arg2);
};

module.exports.__wbg_rect_a45a5e48878e40ce = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).rect(arg1, arg2, arg3, arg4);
};

module.exports.__wbg_clearRect_5163a03172c6613a = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).clearRect(arg1, arg2, arg3, arg4);
};

module.exports.__wbg_fillRect_45e261a0d8e4d566 = function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).fillRect(arg1, arg2, arg3, arg4);
};

module.exports.__wbg_restore_28d621c4540ffa99 = function(arg0) {
    getObject(arg0).restore();
};

module.exports.__wbg_save_0bee05b6d23ded8e = function(arg0) {
    getObject(arg0).save();
};

module.exports.__wbg_fillText_20e548df14499144 = handleError(function(arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).fillText(getStringFromWasm0(arg1, arg2), arg3, arg4);
});

module.exports.__wbg_measureText_0cf2621ea8e44df5 = handleError(function(arg0, arg1, arg2) {
    var ret = getObject(arg0).measureText(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
});

module.exports.__wbg_rotate_43a9ff93afb49de2 = handleError(function(arg0, arg1) {
    getObject(arg0).rotate(arg1);
});

module.exports.__wbg_translate_882094cd23d918c7 = handleError(function(arg0, arg1, arg2) {
    getObject(arg0).translate(arg1, arg2);
});

module.exports.__wbg_width_900ad1fe25297a68 = function(arg0) {
    var ret = getObject(arg0).width;
    return ret;
};

module.exports.__wbg_instanceof_HtmlCanvasElement_308a7fa689ff20ef = function(arg0) {
    var ret = getObject(arg0) instanceof HTMLCanvasElement;
    return ret;
};

module.exports.__wbg_width_fe8c60ee753fcbd0 = function(arg0) {
    var ret = getObject(arg0).width;
    return ret;
};

module.exports.__wbg_setwidth_568dfd10a534fefd = function(arg0, arg1) {
    getObject(arg0).width = arg1 >>> 0;
};

module.exports.__wbg_height_144b34836e4e98e5 = function(arg0) {
    var ret = getObject(arg0).height;
    return ret;
};

module.exports.__wbg_setheight_f95890a4f65f1ed9 = function(arg0, arg1) {
    getObject(arg0).height = arg1 >>> 0;
};

module.exports.__wbg_getContext_554fc171434d411b = handleError(function(arg0, arg1, arg2) {
    var ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2));
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
});

module.exports.__wbg_data_2f716d6abc9ed79e = function(arg0, arg1) {
    var ret = getObject(arg1).data;
    var ptr0 = passArray8ToWasm0(ret, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbg_newwithu8clampedarray_4799da77eec42ad7 = handleError(function(arg0, arg1, arg2) {
    var ret = new ImageData(getClampedArrayU8FromWasm0(arg0, arg1), arg2 >>> 0);
    return addHeapObject(ret);
});

module.exports.__wbg_newwithu8clampedarrayandsh_e53f440c9ae68467 = handleError(function(arg0, arg1, arg2, arg3) {
    var ret = new ImageData(getClampedArrayU8FromWasm0(arg0, arg1), arg2 >>> 0, arg3 >>> 0);
    return addHeapObject(ret);
});

module.exports.__wbg_setsrc_8344c3fd87c4000e = function(arg0, arg1, arg2) {
    getObject(arg0).src = getStringFromWasm0(arg1, arg2);
};

module.exports.__wbg_width_f19cefd2befc2573 = function(arg0) {
    var ret = getObject(arg0).width;
    return ret;
};

module.exports.__wbg_height_ef9e2e94b747d464 = function(arg0) {
    var ret = getObject(arg0).height;
    return ret;
};

module.exports.__wbg_new_f57d0c99c6a125c7 = handleError(function() {
    var ret = new Image();
    return addHeapObject(ret);
});

module.exports.__wbg_call_20c04382b27a4486 = handleError(function(arg0, arg1) {
    var ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
});

module.exports.__wbg_newnoargs_bfddd41728ab0b9c = function(arg0, arg1) {
    var ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_call_49bac88c9eff93af = handleError(function(arg0, arg1, arg2) {
    var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
});

module.exports.__wbg_new_f46e6afe0b8a862e = function() {
    var ret = new Object();
    return addHeapObject(ret);
};

module.exports.__wbg_new_261626435fed913c = function(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_242(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        var ret = new Promise(cb0);
        return addHeapObject(ret);
    } finally {
        state0.a = state0.b = 0;
    }
};

module.exports.__wbg_resolve_430b2f40a51592cc = function(arg0) {
    var ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_then_a9485ea9ef567f90 = function(arg0, arg1) {
    var ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_then_b114127b40814c36 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

module.exports.__wbg_self_944d201f31e01c91 = handleError(function() {
    var ret = self.self;
    return addHeapObject(ret);
});

module.exports.__wbg_window_993fd51731b86960 = handleError(function() {
    var ret = window.window;
    return addHeapObject(ret);
});

module.exports.__wbg_globalThis_8379563d70fab135 = handleError(function() {
    var ret = globalThis.globalThis;
    return addHeapObject(ret);
});

module.exports.__wbg_global_073eb4249a3a8c12 = handleError(function() {
    var ret = global.global;
    return addHeapObject(ret);
});

module.exports.__wbindgen_is_undefined = function(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
};

module.exports.__wbg_buffer_985803c87989344b = function(arg0) {
    var ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

module.exports.__wbg_newwithbyteoffsetandlength_3c83a6445776097f = function(arg0, arg1, arg2) {
    var ret = new Float32Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbg_set_6db0a4cb6e322f85 = handleError(function(arg0, arg1, arg2) {
    var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
});

module.exports.__wbg_random_5f96f58bd6257873 = typeof Math.random == 'function' ? Math.random : notDefined('Math.random');

module.exports.__wbg_new_59cb74e423758ede = function() {
    var ret = new Error();
    return addHeapObject(ret);
};

module.exports.__wbg_stack_558ba5917b466edd = function(arg0, arg1) {
    var ret = getObject(arg1).stack;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
    try {
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(arg0, arg1);
    }
};

module.exports.__wbindgen_boolean_get = function(arg0) {
    const v = getObject(arg0);
    var ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};

module.exports.__wbindgen_debug_string = function(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbindgen_memory = function() {
    var ret = wasm.memory;
    return addHeapObject(ret);
};

module.exports.__wbindgen_closure_wrapper430 = function(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 78, __wbg_adapter_24);
    return addHeapObject(ret);
};

const path = require('path').join(__dirname, 'neritics_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;
