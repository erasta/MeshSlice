class ProjectToMesh {
    constructor(geometry) {
        this.geometry = geometry;
    }

    /**
     * Finds the closest point on the mesh to a given point
     **/
    projectPoint(point) {
        this.tri = this.tri || new THREE.Triangle();
        this.candPoint = this.candPoint || new THREE.Vector3();
        const verts = this.geometry.vertices;
        let closest = new THREE.Vector3(),
            closestFace, dist = 1e10;
        for (let i = 0; i < this.geometry.faces.length; ++i) {
            const f = this.geometry.faces[i];
            this.tri.set(verts[f.a], verts[f.b], verts[f.c]);
            this.tri.closestPointToPoint(point, this.candPoint);
            const candDist = point.distanceTo(this.candPoint);
            // console.log(Math.round(candDist*100)/100,this.candPoint.toArray(), '==', verts[f.a].toArray(), verts[f.b].toArray(), verts[f.c].toArray());
            if (candDist < dist) {
                // console.log('yes');
                dist = candDist;
                closest.copy(this.candPoint);
                closestFace = i;
            }
        }
        return { face: closestFace, point: closest, dist: dist };
    }

    findPointOnPolyline(polyline, point) {
        this.line = this.line || new THREE.Line3();
        this.point = this.point || new THREE.Vector3();
        for (let i = 1; i < polyline.length; ++i) {
            this.line.set(polyline[i - 1], polyline[i]);
            if (this.line.closestPointToPoint(point, true, this.point).distanceToManhattan(point) < 1e-6) {
                return i - 1;
            }
        }
        return undefined;
    }

    findSubPolyline(polyline, fromPoint, toPoint) {
        let start = this.findPointOnPolyline(polyline, fromPoint);
        let end = this.findPointOnPolyline(polyline, toPoint);
        let isCyclic = polyline[0].distanceToManhattan(polyline[polyline.length - 1]) < 1e-6;
        if (start === undefined || end === undefined) return undefined;
        if (!isCyclic || Math.abs(start - end) < polyline.length / 2) {
            if (start < end) {
                return polyline.slice(start + 1, end + 1);
            } else {
                return polyline.slice(end + 1, start + 1).reverse();
            }
        } else {
            if (start > end) {
                return polyline.slice(start + 1).concat(polyline.slice(0, end + 1));
            } else {
                return polyline.slice(end + 1).concat(polyline.slice(0, start + 1)).reverse();
            }
        }
    }

    projectPolyline(poly) {
        if (poly.length === 0) return [];
        this.inter = new MeshIntersectPlane(this.geometry);
        this.plane = this.plane || new THREE.Plane();
        let last = this.projectPoint(poly[0]);
        let pointsOnMesh = [last.point];
        for (let i = 1; i < poly.length; ++i) {
            let next = this.projectPoint(poly[i]);
            if (next.face !== last.face) {
                // debugger
                this.plane.setFromCoplanarPoints(last.point, next.point, poly[i]);
                const lines = this.inter.sliceByPlane(this.plane);
                for (let j = 0; j < lines.length; ++j) {
                    let subpoly = this.findSubPolyline(lines[j], last.point, next.point);
                    if (subpoly) {
                        pointsOnMesh = pointsOnMesh.concat(subpoly);
                        break;
                    }
                }
            }
            pointsOnMesh.push(next.point);
            last = next;
        }
        return pointsOnMesh;
    }
}

if (typeof module !== 'undefined') module.exports.ProjectToMesh = ProjectToMesh;
