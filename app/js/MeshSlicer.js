class MeshSlicer {
    constructor(geometry) {
        this.geometry = geometry;
        this.intersect = new MeshIntersectPlane(geometry);
    }

    slice(delta, planeNormal) {
        this.geometry.computeBoundingSphere();
        const plane = new THREE.Plane();
        plane.setFromNormalAndCoplanarPoint(planeNormal, this.geometry.boundingSphere.center);
        const origConstant = plane.constant, rad = this.geometry.boundingSphere.radius;
        let polylines = [];
        for (plane.constant = origConstant - rad + delta; plane.constant < origConstant + rad; plane.constant += delta){
            this.intersect.sliceByPlane(plane).forEach(poly => polylines.push(poly));
        }
        return polylines;
    }
}
