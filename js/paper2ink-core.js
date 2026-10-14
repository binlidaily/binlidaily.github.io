/* Browser/worker core compiled from the validated Paper2Ink TypeScript implementation. */
(function(root){
"use strict";
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
/** Carbo-inspired reduced grayscale closing and zero-map fill. */
function paperBackground(gray, w, h) {
    const sw = Math.max(1, Math.floor(w / 8)), sh = Math.max(1, Math.floor(h / 8));
    const small = new Float32Array(sw * sh);
    // Area sampling preserves thin marks without sampling only their centers.
    for (let y = 0; y < sh; y++)
        for (let x = 0; x < sw; x++) {
            const left = x * w / sw, right = (x + 1) * w / sw;
            const top = y * h / sh, bottom = (y + 1) * h / sh;
            let sum = 0;
            for (let yy = Math.floor(top); yy < Math.ceil(bottom); yy++)
                for (let xx = Math.floor(left); xx < Math.ceil(right); xx++) {
                    const area = (Math.min(right, xx + 1) - Math.max(left, xx)) * (Math.min(bottom, yy + 1) - Math.max(top, yy));
                    sum += gray[Math.min(h - 1, yy) * w + Math.min(w - 1, xx)] * area;
                }
            small[y * sw + x] = Math.round(sum / ((right - left) * (bottom - top)));
        }
    const morph = (source, dilate) => {
        const out = new Float32Array(source.length);
        for (let y = 0; y < sh; y++)
            for (let x = 0; x < sw; x++) {
                let v = dilate ? 0 : 255;
                for (let yy = Math.max(0, y - 3); yy <= Math.min(sh - 1, y + 3); yy++)
                    for (let xx = Math.max(0, x - 3); xx <= Math.min(sw - 1, x + 3); xx++)
                        v = dilate ? Math.max(v, source[yy * sw + xx]) : Math.min(v, source[yy * sw + xx]);
                out[y * sw + x] = v;
            }
        return out;
    };
    const closed = morph(morph(small, true), false), mw = sw + 1, mh = sh + 1;
    const map = new Float32Array(mw * mh), valid = [];
    for (let y = 0; y < mh; y++)
        for (let x = 0; x < mw; x++)
            map[y * mw + x] = closed[Math.min(y, sh - 1) * sw + Math.min(x, sw - 1)];
    for (let x = 0; x < sw; x++) {
        let first = -1;
        for (let y = 0; y < sh; y++)
            if (map[y * mw + x] > 0) {
                first = y;
                break;
            }
        if (first < 0)
            continue;
        valid.push(x);
        let last = map[first * mw + x];
        for (let y = 0; y < mh; y++) {
            if (y < first || map[y * mw + x] === 0)
                map[y * mw + x] = last;
            else
                last = map[y * mw + x];
        }
    }
    if (!valid.length)
        return null;
    for (let x = 0, previous = valid[0]; x < sw; x++) {
        if (valid.includes(x))
            previous = x;
        else
            for (let y = 0; y < mh; y++)
                map[y * mw + x] = map[y * mw + previous];
    }
    for (let y = 0; y < mh; y++)
        map[y * mw + sw] = map[y * mw + sw - 1];
    const background = new Float32Array(w * h);
    for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
            const fx = clamp((x + .5) * mw / w - .5, 0, mw - 1), fy = clamp((y + .5) * mh / h - .5, 0, mh - 1);
            const x0 = Math.floor(fx), y0 = Math.floor(fy), x1 = Math.min(mw - 1, x0 + 1), y1 = Math.min(mh - 1, y0 + 1);
            const dx = fx - x0, dy = fy - y0;
            background[y * w + x] = (map[y0 * mw + x0] * (1 - dx) + map[y0 * mw + x1] * dx) * (1 - dy)
                + (map[y1 * mw + x0] * (1 - dx) + map[y1 * mw + x1] * dx) * dy;
        }
    return background;
}
function integral(values, w, h, squared = false) {
    const out = new Float64Array((w + 1) * (h + 1));
    for (let y = 1; y <= h; y++) {
        let row = 0;
        for (let x = 1; x <= w; x++) {
            const v = values[(y - 1) * w + x - 1];
            row += squared ? v * v : v;
            out[y * (w + 1) + x] = out[(y - 1) * (w + 1) + x] + row;
        }
    }
    return out;
}
function boxMean(sum, w, h, x, y, r) {
    const x0 = Math.max(0, x - r), x1 = Math.min(w, x + r + 1);
    const y0 = Math.max(0, y - r), y1 = Math.min(h, y + r + 1), stride = w + 1;
    return (sum[y1 * stride + x1] - sum[y0 * stride + x1] - sum[y1 * stride + x0] + sum[y0 * stride + x0]) / ((x1 - x0) * (y1 - y0));
}
function otsu(values) {
    const hist = new Uint32Array(256);
    for (const v of values)
        hist[v]++;
    let totalSum = 0;
    for (let i = 0; i < 256; i++)
        totalSum += i * hist[i];
    let count = 0, sum = 0, best = -1, threshold = 0;
    for (let i = 0; i < 256; i++) {
        count += hist[i];
        sum += i * hist[i];
        if (!count || count === values.length)
            continue;
        const score = count * (values.length - count) * (sum / count - (totalSum - sum) / (values.length - count)) ** 2;
        if (score > best) {
            best = score;
            threshold = i;
        }
    }
    return threshold;
}
/** Remove isolated dust by area, keeping tiny dots close to larger handwriting. */
function cleanComponents(mask, gray, w, h, cleanup) {
    if (!cleanup)
        return;
    const seen = new Uint8Array(mask.length), substantial = new Uint8Array(mask.length);
    const small = [], minArea = 2 + Math.floor(cleanup / 25);
    for (let start = 0; start < mask.length; start++) {
        if (!mask[start] || seen[start])
            continue;
        const pixels = [start];
        seen[start] = 1;
        for (let at = 0; at < pixels.length; at++) {
            const p = pixels[at], x = p % w, y = Math.floor(p / w);
            for (let dy = -1; dy <= 1; dy++)
                for (let dx = -1; dx <= 1; dx++) {
                    const xx = x + dx, yy = y + dy, q = yy * w + xx;
                    if (xx >= 0 && xx < w && yy >= 0 && yy < h && mask[q] && !seen[q]) {
                        seen[q] = 1;
                        pixels.push(q);
                    }
                }
        }
        // Two-pixel dark marks survive even when isolated; pale scanner dust does not.
        if (pixels.length >= minArea || (pixels.length >= 2 && pixels.some(p => gray[p] < 100))) {
            for (const p of pixels)
                substantial[p] = 1;
        }
        else
            small.push(pixels);
    }
    const radius = Math.max(4, Math.round(Math.max(w, h) / 160));
    for (const pixels of small) {
        let nearText = false;
        for (const p of pixels) {
            const x = p % w, y = Math.floor(p / w);
            for (let yy = Math.max(0, y - radius); yy <= Math.min(h - 1, y + radius) && !nearText; yy++)
                for (let xx = Math.max(0, x - radius); xx <= Math.min(w - 1, x + radius); xx++)
                    if (substantial[yy * w + xx]) {
                        nearText = true;
                        break;
                    }
            if (nearText)
                break;
        }
        if (!nearText)
            for (const p of pixels)
                mask[p] = 0;
    }
}
/** Clockwise pixel-boundary loops. A right turn splits diagonal-only contacts. */
function traceShapes(mask, w, h) {
    const outgoing = new Map(), stride = w + 1;
    const key = (x, y) => y * stride + x;
    const ink = (x, y) => x >= 0 && x < w && y >= 0 && y < h && !!mask[y * w + x];
    const add = (start, end, direction) => {
        const list = outgoing.get(start) || [];
        list.push({ end, direction });
        outgoing.set(start, list);
    };
    let edges = 0;
    for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
            if (!ink(x, y))
                continue;
            if (!ink(x, y - 1)) {
                add(key(x, y), key(x + 1, y), 0);
                edges++;
            }
            if (!ink(x + 1, y)) {
                add(key(x + 1, y), key(x + 1, y + 1), 1);
                edges++;
            }
            if (!ink(x, y + 1)) {
                add(key(x + 1, y + 1), key(x, y + 1), 2);
                edges++;
            }
            if (!ink(x - 1, y)) {
                add(key(x, y + 1), key(x, y), 3);
                edges++;
            }
        }
    const loops = [];
    while (outgoing.size) {
        const start = outgoing.keys().next().value;
        let current = start, previousDirection = -1;
        const loop = [];
        for (let guard = 0; guard <= edges; guard++) {
            loop.push({ x: current % stride, y: Math.floor(current / stride) });
            const list = outgoing.get(current);
            if (!list?.length)
                throw new Error('Invalid pixel boundary');
            let selected = 0;
            if (previousDirection >= 0 && list.length > 1) {
                const rank = (d) => [1, 0, 3, 2][(d - previousDirection + 4) % 4];
                for (let j = 1; j < list.length; j++)
                    if (rank(list[j].direction) < rank(list[selected].direction))
                        selected = j;
            }
            const [edge] = list.splice(selected, 1);
            if (!list.length)
                outgoing.delete(current);
            current = edge.end;
            previousDirection = edge.direction;
            if (current === start)
                break;
        }
        if (loop.length >= 4)
            loops.push(loop);
    }
    return loops;
}
function rdp(points, epsilon) {
    if (points.length < 3)
        return points;
    const keep = new Uint8Array(points.length);
    keep[0] = keep[points.length - 1] = 1;
    const stack = [[0, points.length - 1]];
    while (stack.length) {
        const [start, end] = stack.pop(), a = points[start], b = points[end];
        const dx = b.x - a.x, dy = b.y - a.y, den = dx * dx + dy * dy;
        let best = epsilon * epsilon, index = -1;
        for (let i = start + 1; i < end; i++) {
            const p = points[i], t = den ? clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / den, 0, 1) : 0;
            const d = (p.x - a.x - t * dx) ** 2 + (p.y - a.y - t * dy) ** 2;
            if (d > best) {
                best = d;
                index = i;
            }
        }
        if (index >= 0) {
            keep[index] = 1;
            stack.push([start, index], [index, end]);
        }
    }
    return points.filter((_, i) => keep[i]);
}
function simplifyLoop(points, epsilon) {
    let split = 1, farthest = 0;
    for (let i = 1; i < points.length; i++) {
        const d = (points[i].x - points[0].x) ** 2 + (points[i].y - points[0].y) ** 2;
        if (d > farthest) {
            farthest = d;
            split = i;
        }
    }
    const a = rdp(points.slice(0, split + 1), epsilon);
    const b = rdp([...points.slice(split), points[0]], epsilon);
    const result = [...a.slice(0, -1), ...b.slice(0, -1)];
    // A tiny island must survive even when epsilon is larger than its radius.
    return result.length >= 3 ? result : points;
}
/** Pure processing entry point; RGBA input is composited over white. Coordinates use the existing 1200 × 800 stage. */
function vectorizePixels(rgba, w, h, smoothness = 68, options = {}) {
    if (!Number.isInteger(w) || !Number.isInteger(h) || w < 1 || h < 1 || rgba.length !== w * h * 4)
        throw new Error('Expected positive dimensions and width × height × 4 RGBA values');
    const cleanup = clamp(options.backgroundCleanup ?? 55, 0, 100), gray = new Uint8Array(w * h);
    for (let i = 0; i < gray.length; i++) {
        const a = rgba[i * 4 + 3] / 255;
        gray[i] = Math.round((.299 * rgba[i * 4] + .587 * rgba[i * 4 + 1] + .114 * rgba[i * 4 + 2]) * a + 255 * (1 - a));
    }
    const sum = integral(gray, w, h), normalized = new Uint8Array(gray.length);
    const broadRadius = Math.max(24, Math.round(Math.max(w, h) * .08));
    const shadow = options.shadowRemoval ? paperBackground(gray, w, h) : null;
    const power = 2 ** (clamp(options.inkStrength ?? 0, -50, 50) / 50);
    for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
            const background = shadow ? shadow[y * w + x] : Math.max(boxMean(sum, w, h, x, y, 12), boxMean(sum, w, h, x, y, broadRadius));
            const ratio = clamp(gray[y * w + x] / Math.max(1, background), 0, 1);
            normalized[y * w + x] = Math.round(255 * ratio ** power);
        }
    const local = integral(normalized, w, h), squares = integral(normalized, w, h, true);
    const globalThreshold = clamp(otsu(normalized) + 1, 70, 200);
    // Absolute dark-ink branch retains the interior of large filled regions, where any local ratio is near 1.
    const rawThreshold = otsu(gray);
    let darkThreshold = Math.min(110, rawThreshold);
    // A clean two-tone scan can contain gray ink too. Only relax the dark floor
    // when both intensity classes are tight; a gradual paper shadow is not ink.
    if (rawThreshold > 110) {
        const counts = [0, 0], sums = [0, 0], sums2 = [0, 0];
        for (const v of gray) {
            const c = v <= rawThreshold ? 0 : 1;
            counts[c]++;
            sums[c] += v;
            sums2[c] += v * v;
        }
        if (counts[0] && counts[1]) {
            const means = sums.map((s, c) => s / counts[c]);
            const deviations = sums2.map((s, c) => Math.sqrt(Math.max(0, s / counts[c] - means[c] ** 2)));
            if (means[1] - means[0] > 40 && deviations.every(d => d < 8))
                darkThreshold = rawThreshold;
        }
    }
    const mask = new Uint8Array(gray.length), k = .10 + cleanup * .002;
    for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
            const i = y * w + x, mean = boxMean(local, w, h, x, y, 12);
            const std = Math.sqrt(Math.max(0, boxMean(squares, w, h, x, y, 12) - mean * mean));
            const adaptive = mean * (1 + k * (std / 128 - 1));
            mask[i] = (!shadow && gray[i] <= darkThreshold) || normalized[i] < Math.min(globalThreshold, adaptive) ? 1 : 0;
        }
    cleanComponents(mask, gray, w, h, cleanup);
    const epsilon = .3 + clamp(smoothness, 0, 100) / 100 * 1.2;
    const scale = Math.min(1200 / w, 800 / h), offsetX = (1200 - w * scale) / 2, offsetY = (800 - h * scale) / 2;
    const contours = traceShapes(mask, w, h).map(loop => simplifyLoop(loop, epsilon).map(p => ({ x: p.x * scale + offsetX, y: p.y * scale + offsetY })));
    return { strokes: [], shapes: contours.length ? [{ contours, color: '#171915' }] : [], sourceWidth: w, sourceHeight: h };
}
async function vectorizeImage(file, smoothness = 68, options = {}) {
    const bitmap = await createImageBitmap(file);
    try {
        const maxEdge = clamp(options.maxEdge ?? 1600, 1, 4096), ratio = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
        const w = Math.max(1, Math.round(bitmap.width * ratio)), h = Math.max(1, Math.round(bitmap.height * ratio));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx)
            throw new Error('Unable to create image-processing canvas');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(bitmap, 0, 0, w, h);
        return vectorizePixels(ctx.getImageData(0, 0, w, h).data, w, h, smoothness, options);
    }
    finally {
        bitmap.close();
    }
}

root.Paper2InkCore={vectorizePixels:vectorizePixels,vectorizeImage:vectorizeImage};
})(typeof self!=="undefined"?self:globalThis);
