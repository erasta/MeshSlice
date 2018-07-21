class PolylineToCurve {
    static go(poly) {
        let path = new THREE.CurvePath();
        for (let i = 1; i < poly.length; ++i) {
            path.curves.push(new THREE.LineCurve3(poly[i - 1], poly[i]));
        }
        return path;
    }
}
