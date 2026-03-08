
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- WGS84 to GCJ-02 Conversion ---
// Constants
const x_pi = 3.14159265358979324 * 3000.0 / 180.0;
const a = 6378245.0;
const ee = 0.00669342162296594323;

function transformLat(x, y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
    return ret;
}

function transformLon(x, y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
    return ret;
}

function wgs84togcj02(lng, lat) {
    if (outOfChina(lng, lat)) {
        return [lng, lat];
    }
    let dLat = transformLat(lng - 105.0, lat - 35.0);
    let dLon = transformLon(lng - 105.0, lat - 35.0);
    const radLat = lat / 180.0 * Math.PI;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
    const mgLat = lat + dLat;
    const mgLon = lng + dLon;
    return [mgLon, mgLat];
}

function outOfChina(lng, lat) {
    return (lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271);
}

// --- Geometry Simplification (Douglas-Peucker) ---
function getSqSegDist(p, p1, p2) {
    let x = p1[0], y = p1[1], dx = p2[0] - x, dy = p2[1] - y;
    if (dx !== 0 || dy !== 0) {
        const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
        if (t > 1) {
            x = p2[0];
            y = p2[1];
        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }
    dx = p[0] - x;
    dy = p[1] - y;
    return dx * dx + dy * dy;
}

function simplifyDPStep(points, first, last, sqTolerance, simplified) {
    let maxSqDist = sqTolerance, index = -1;
    for (let i = first + 1; i < last; i++) {
        const sqDist = getSqSegDist(points[i], points[first], points[last]);
        if (sqDist > maxSqDist) {
            index = i;
            maxSqDist = sqDist;
        }
    }
    if (maxSqDist > sqTolerance) {
        if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
        simplified.push(points[index]);
        if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
    }
}

function simplify(points, tolerance) {
    if (points.length <= 2) return points;
    const sqTolerance = tolerance * tolerance;
    const simplified = [points[0]];
    simplifyDPStep(points, 0, points.length - 1, sqTolerance, simplified);
    simplified.push(points[points.length - 1]);
    return simplified;
}

// --- Health Generation ---
function generateHealth() {
    // Weighted random: 
    // 60% Excellent (90-100)
    // 25% Good (80-89)
    // 10% Medium (60-79)
    // 5% Poor (0-59)
    const rand = Math.random();
    if (rand < 0.6) { // Excellent
        return { score: Math.floor(Math.random() * 11) + 90, status: '优秀' };
    } else if (rand < 0.85) { // Good
        return { score: Math.floor(Math.random() * 10) + 80, status: '良好' };
    } else if (rand < 0.95) { // Medium
        return { score: Math.floor(Math.random() * 20) + 60, status: '中度' };
    } else { // Poor
        return { score: Math.floor(Math.random() * 60), status: '严重' };
    }
}

// --- Main Process ---

const INPUT_FILE = path.resolve(__dirname, '../hangzhouv2.geojson');
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/cachedRoadPaths.json');

console.log(`Reading GeoJSON from: ${INPUT_FILE}`);

try {
    const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
    const geoJSON = JSON.parse(rawData);

    if (!geoJSON.features) {
        throw new Error('Invalid GeoJSON format: No features array found.');
    }

    console.log(`Found ${geoJSON.features.length} features.`);

    const processedRoads = [];
    let processedCount = 0;

    // Shuffle array to get random roads if we limit the count, otherwise simple iteration
    // For "random" sampling if we want to limit size, but here just linear scan

    for (const feature of geoJSON.features) {
        // Validation: Must be a LineString, have a Name
        if (feature.geometry.type !== 'LineString') continue;
        const name = feature.properties.name || feature.properties['name:zh'];
        if (!name) continue;

        // Limit removed to process all available roads
        // if (processedCount > 800) break; 

        // Convert Coordinates
        let path = feature.geometry.coordinates.map(coord => {
            // coord is [lng, lat]
            return wgs84togcj02(coord[0], coord[1]);
        });

        // Simplify Geometry (Optimize for performance)
        // 0.00005 degrees is roughly 5 meters, good balance for city scale
        path = simplify(path, 0.00005);

        // Generate Stats
        const { score, status } = generateHealth();

        processedRoads.push({
            id: feature.id || `road_${processedCount}`,
            name: name,
            health: score,
            status: status,
            path: path
        });

        processedCount++;
    }

    console.log(`Processed ${processedRoads.length} road segments.`);

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(processedRoads, null, 2), 'utf8');
    console.log(`Successfully wrote to ${OUTPUT_FILE}`);

} catch (err) {
    console.error('Error processing GeoJSON:', err);
}
