import * as THREE from 'three'

// ─── High-res letter definitions (10×14 grid for smoother curves) ──
const LETTER_DEFS = {
    H: [
        '1100000011','1100000011','1100000011','1100000011',
        '1111111111','1111111111','1111111111',
        '1100000011','1100000011','1100000011','1100000011',
        '1100000011','1100000011','1100000011',
    ],
    A: [
        '0011111100','0111111110','1110000111','1100000011',
        '1100000011','1111111111','1111111111',
        '1100000011','1100000011','1100000011','1100000011',
        '1100000011','1100000011','1100000011',
    ],
    R: [
        '1111111000','1111111100','1110001110','1100000110',
        '1100000110','1111111100','1111111100',
        '1100011000','1100001100','1100000110','1100000110',
        '1100000110','1100000011','1100000011',
    ],
    Y: [
        '1100000011','1100000011','1100000011','0110000110',
        '0110000110','0011001100','0001111000',
        '0000110000','0000110000','0000110000','0000110000',
        '0000110000','0000110000','0000110000',
    ],
    J: [
        '0000000011','0000000011','0000000011','0000000011',
        '0000000011','0000000011','0000000011',
        '0000000011','0000000011','1100000011','1100000011',
        '0110000110','0111111100','0011111000',
    ],
    I: [
        '0011111100','0111111110','0001111000','0001111000',
        '0001111000','0001111000','0001111000',
        '0001111000','0001111000','0001111000','0001111000',
        '0001111000','0111111110','0011111100',
    ],
    N: [
        '1100000011','1110000011','1110000011','1111000011',
        '1111000011','1101100011','1101100011',
        '1100110011','1100110011','1100011011','1100011011',
        '1100001111','1100001111','1100000011',
    ],
    G: [
        '0011111100','0111111110','1110000000','1100000000',
        '1100000000','1100111110','1100111111',
        '1100000011','1100000011','1100000011','1100000011',
        '1110000011','0111000110','0011111100',
    ],
}

const BLOCK_SIZE = 0.37
const BLOCK_DEPTH = 0.35
const LETTER_SPACING = 0.35
const GRID_STEP = 0.37
const NAME = 'HARRY JIANG'

// Principle angles only: 30°, 45°, 60°, 90°
const PRINCIPLE_ANGLES = [
    30, 45, 60, 90,
    120, 135, 150, // 180 - above
    -30, -45, -60, -90,
    -120, -135, -150,
].map(a => a * Math.PI / 180)

const boxGeometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_DEPTH)

// ─── Seeded hash ─────────────────────────────────────────────
function hash(x, y, z, seed) {
    let h = seed + x * 374761393 + y * 668265263 + z * 1274126177
    h = (h ^ (h >> 13)) * 1103515245
    return ((h ^ (h >> 16)) & 0x7fffffff) / 0x7fffffff
}

function pickAngle(seedVal, idx) {
    return PRINCIPLE_ANGLES[Math.floor(hash(seedVal, idx, 0, 0) * PRINCIPLE_ANGLES.length) % PRINCIPLE_ANGLES.length]
}

// ─── Spatial occupancy grid ──────────────────────────────────
class OccupancyGrid {
    constructor(resolution = 0.25) {
        this.res = resolution
        this.cells = new Set()
    }

    _key(x, y, z) {
        return `${Math.round(x / this.res)},${Math.round(y / this.res)},${Math.round(z / this.res)}`
    }

    isFree(cx, cy, cz, hw, hh, hd) {
        for (let dx = -hw; dx <= hw + 0.001; dx += this.res * 0.5) {
            for (let dy = -hh; dy <= hh + 0.001; dy += this.res * 0.5) {
                for (let dz = -hd; dz <= hd + 0.001; dz += this.res * 0.5) {
                    if (this.cells.has(this._key(cx + dx, cy + dy, cz + dz))) return false
                }
            }
        }
        return true
    }

    occupy(cx, cy, cz, hw, hh, hd) {
        for (let dx = -hw; dx <= hw + 0.001; dx += this.res * 0.5) {
            for (let dy = -hh; dy <= hh + 0.001; dy += this.res * 0.5) {
                for (let dz = -hd; dz <= hd + 0.001; dz += this.res * 0.5) {
                    this.cells.add(this._key(cx + dx, cy + dy, cz + dz))
                }
            }
        }
    }
}

// ─── Detail geometry ─────────────────────────────────────────
function detailGeo(type, s) {
    switch (type) {
        case 0: return new THREE.BoxGeometry(s, s, s)
        case 1: return new THREE.BoxGeometry(s * 1.8, s * 0.25, s * 0.25)  // bar
        case 2: return new THREE.BoxGeometry(s * 1.3, s * 1.3, s * 0.15)   // plate
        case 3: return new THREE.TorusGeometry(s * 0.7, s * 0.12, 4, 8)    // ring
        case 4: return new THREE.CylinderGeometry(s * 0.5, s * 0.5, s * 0.4, 6)
        case 5: return new THREE.BoxGeometry(s * 0.12, s * 1.0, s * 0.2)   // clamp tooth
        case 6: return new THREE.BoxGeometry(s * 0.25, s * 0.25, s * 0.25)
        case 7: return new THREE.BoxGeometry(s * 2.2, s * 0.35, s * 0.1)   // strap
        case 8: return new THREE.ConeGeometry(s * 0.4, s * 0.6, 4)
        case 9: return new THREE.BoxGeometry(s * 0.1, s * 0.5, s * 0.1)
        default: return new THREE.BoxGeometry(s, s, s * 0.12)
    }
}

// ─── Flood a single block's 6 faces ──────────────────────────
function floodBlock(group, material, bx, by, bz, seed, occGrid) {
    const half = BLOCK_SIZE / 2
    const halfD = BLOCK_DEPTH / 2
    const step = 0.3 // spacing between detail placements on a face

    // 6 faces: each is a plane with origin, and u/v axes
    const faces = [
        // front  +Z
        { origin: [bx, by, bz + halfD + 0.02], u: 'x', v: 'y', uRange: [-half, half], vRange: [-half, half] },
        // back   -Z
        { origin: [bx, by, bz - halfD - 0.02], u: 'x', v: 'y', uRange: [-half, half], vRange: [-half, half] },
        // top    +Y
        { origin: [bx, by + half + 0.02, bz],  u: 'x', v: 'z', uRange: [-half, half], vRange: [-halfD, halfD] },
        // bottom -Y
        { origin: [bx, by - half - 0.02, bz],  u: 'x', v: 'z', uRange: [-half, half], vRange: [-halfD, halfD] },
        // left   -X
        { origin: [bx - half - 0.02, by, bz],  u: 'z', v: 'y', uRange: [-halfD, halfD], vRange: [-half, half] },
        // right  +X
        { origin: [bx + half + 0.02, by, bz],  u: 'z', v: 'y', uRange: [-halfD, halfD], vRange: [-half, half] },
    ]

    let idx = 0

    for (const face of faces) {
        const [u0, u1] = face.uRange
        const [v0, v1] = face.vRange

        for (let u = u0; u <= u1 + 0.001; u += step) {
            for (let v = v0; v <= v1 + 0.001; v += step) {
                // Compute world position
                const pos = [...face.origin]
                if (face.u === 'x') pos[0] += u; if (face.u === 'y') pos[1] += u; if (face.u === 'z') pos[2] += u
                if (face.v === 'x') pos[0] += v; if (face.v === 'y') pos[1] += v; if (face.v === 'z') pos[2] += v

                const type = Math.floor(hash(idx, 3, 0, seed) * 10)
                const sizeBase = 0.15 + hash(idx, 4, 0, seed) * 0.45

                // Half-extents for collision (approximate, depends on type)
                const hw = sizeBase * (type === 1 ? 0.9 : type === 7 ? 1.1 : 0.5)
                const hh = sizeBase * (type === 1 ? 0.12 : type === 7 ? 0.17 : 0.5)
                const hd = sizeBase * 0.2

                // Only place if space is free
                if (!occGrid.isFree(pos[0], pos[1], pos[2], hw * 0.5, hh * 0.5, hd * 0.5)) continue

                // Rotation: principle angle in the plane of the face
                const rx = face.u === 'x' || face.v === 'x' ? 0 : pickAngle(idx, 5)
                const ry = 0
                const rz = pickAngle(idx, 6)

                const geo = detailGeo(type, sizeBase)
                const m = new THREE.Mesh(geo, material)
                m.position.set(pos[0], pos[1], pos[2])
                m.rotation.set(rx, ry, rz)
                group.add(m)

                occGrid.occupy(pos[0], pos[1], pos[2], hw * 0.55, hh * 0.55, hd * 0.55)

                idx++
            }
        }
    }

    // ─── Secondary protruding wave (front/back only) ─────────
    for (const fi of [0, 1]) {
        const face = faces[fi]
        const [u0, u1] = face.uRange
        const [v0, v1] = face.vRange
        const protrude = fi === 0 ? 0.12 : -0.12

        for (let u = u0; u <= u1 + 0.001; u += step * 1.5) {
            for (let v = v0; v <= v1 + 0.001; v += step * 1.5) {
                if (hash(Math.round(u * 100), Math.round(v * 100), fi, seed + 500) < 0.3) continue

                const pos = [...face.origin]
                pos[2] += protrude
                if (face.u === 'x') pos[0] += u; if (face.u === 'y') pos[1] += u; if (face.u === 'z') pos[2] += u
                if (face.v === 'x') pos[0] += v; if (face.v === 'y') pos[1] += v; if (face.v === 'z') pos[2] += v

                const type = Math.floor(hash(idx, 10, 0, seed) * 10)
                const sizeBase = 0.1 + hash(idx, 11, 0, seed) * 0.3

                const hw = sizeBase * (type === 1 ? 0.9 : 0.5)
                const hh = sizeBase * (type === 1 ? 0.12 : 0.5)
                const hd = sizeBase * 0.2

                if (!occGrid.isFree(pos[0], pos[1], pos[2], hw * 0.5, hh * 0.5, hd * 0.5)) continue

                const geo = detailGeo(type, sizeBase)
                const m = new THREE.Mesh(geo, material)
                m.position.set(pos[0], pos[1], pos[2])
                m.rotation.set(0, 0, pickAngle(idx, 12))
                group.add(m)

                occGrid.occupy(pos[0], pos[1], pos[2], hw * 0.55, hh * 0.55, hd * 0.55)

                idx++
            }
        }
    }

    return idx
}

// ─── Build a letter ──────────────────────────────────────────
function buildLetter(char, material, seed) {
    const def = LETTER_DEFS[char.toUpperCase()]
    if (!def) return null

    const group = new THREE.Group()
    const blocks = []

    // First pass: create all blocks
    for (let row = 0; row < def.length; row++) {
        for (let col = 0; col < def[row].length; col++) {
            if (def[row][col] === '1') {
                const bx = col * GRID_STEP
                const by = -(row * GRID_STEP)
                const bz = 0

                const mesh = new THREE.Mesh(boxGeometry, material)
                mesh.position.set(bx, by, bz)
                group.add(mesh)
                blocks.push({ bx, by, bz, row, col })
            }
        }
    }

    // Shared occupancy grid for the entire letter
    const occGrid = new OccupancyGrid(0.25)

    // Second pass: flood each block with details
    for (const { bx, by, bz, row, col } of blocks) {
        floodBlock(group, material, bx, by, bz, seed + row * 100 + col, occGrid)
    }

    return group
}

export default {
    build(material) {
        const nameGroup = new THREE.Group()
        let xOffset = 0

        const chars = NAME.split('')
        let letterIdx = 0
        for (const char of chars) {
            if (char === ' ') {
                xOffset += LETTER_SPACING * 2
                continue
            }

            const letterGroup = buildLetter(char, material, letterIdx * 1337 + 42)
            if (!letterGroup) continue

            letterGroup.position.x = xOffset
            nameGroup.add(letterGroup)

            const def = LETTER_DEFS[char.toUpperCase()]
            xOffset += (def[0].length * GRID_STEP) + LETTER_SPACING
            letterIdx++
        }

        const box = new THREE.Box3().setFromObject(nameGroup)
        const center = box.getCenter(new THREE.Vector3())
        nameGroup.position.sub(center)

        return nameGroup
    },
}
