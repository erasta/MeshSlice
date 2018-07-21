class MeshIntersectPlane {
    constructor(geometry) {
        this.geometry = geometry;
    }

    sliceByPlane(plane) {
        this.plane = plane;
        this.segments = [];
        for (let i = 0; i < this.geometry.faces.length; ++i) {
            const inter = this.intersectFace(i);
            if (inter instanceof Array) {
                this.segments.push(inter);
            }
        }
        return this.mergeSegments();
    }

    mergeSegments() {
        function tryMergeTwoSegments(seg1, seg2) {
            if (seg1[seg1.length - 1].distanceToManhattan(seg2[0]) < 1e-6) {
                return seg1.concat(seg2.slice(1));
            } else if (seg1[0].distanceToManhattan(seg2[seg2.length - 1]) < 1e-6) {
                return seg2.concat(seg1.slice(1));
            } else if (seg1[0].distanceToManhattan(seg2[0]) < 1e-6) {
                return seg2.reverse().concat(seg1.slice(1));
            } else if (seg1[seg1.length - 1].distanceToManhattan(seg2[seg2.length - 1]) < 1e-6) {
                return seg1.concat(seg2.reverse().slice(1));
            }
            return undefined;
        }

        let changed = true;
        while (changed && this.segments.length > 1) {
            changed = false;
            for (let i = 0; i < this.segments.length; ++i) {
                for (let j = i + 1; j < this.segments.length; ++j) {
                    const merged = tryMergeTwoSegments(this.segments[i], this.segments[j]);
                    if (merged) {
                        this.segments[i] = merged;
                        this.segments.splice(j--, 1);
                        changed = true;
                    }
                }
            }
        }
        return this.segments;
    }

    intersectFace(faceIndex) {
        const f = this.geometry.faces[faceIndex];
        this._line = (this._line || new THREE.Line3());
        const verts = this.geometry.vertices;
        let ab = this.plane.intersectLine(this._line.set(verts[f.a], verts[f.b]));
        let bc = this.plane.intersectLine(this._line.set(verts[f.b], verts[f.c]));
        let ca = this.plane.intersectLine(this._line.set(verts[f.c], verts[f.a]));
        if (ab && bc && ab.distanceToManhattan(bc) < 1e-6) bc = undefined;
        if (bc && ca && bc.distanceToManhattan(ca) < 1e-6) ca = undefined;
        if (ca && ab && ca.distanceToManhattan(ab) < 1e-6) ab = undefined;
        const count = (ab ? 1 : 0) + (bc ? 1 : 0) + (ca ? 1 : 0);
        if (count === 0) return undefined;
        if (count === 1) return (ab ? ab : (bc ? bc : ca));
        return (!ab ? [bc, ca] : (!bc ? [ca, ab] : [ab, bc]));
    }
}
