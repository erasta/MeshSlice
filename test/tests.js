function vec(x, y, z) { return new THREE.Vector3(x, y, z); }

QUnit.test("closest point between segments", function(assert) {
    var actual = new SegmentsClosestPoints(vec(0, 0, 0), vec(10, 0, 0), vec(5, 5, 5), vec(5, -5, 5));
    assert.deepEqual(actual.point1, vec(5, 0, 0));
    assert.deepEqual(actual.point2, vec(5, 0, 5));
    assert.deepEqual(actual.dist, 5);
});

QUnit.test("project point to mesh", function(assert) {
    var geom = new THREE.BoxGeometry(10, 10, 10);
    var actual = new ProjectToMesh(geom).projectPoint(vec(0, 1, 15));
    assert.deepEqual(actual.face, 8);
    assert.deepEqual(actual.point, vec(0, 1, 5));
    assert.deepEqual(actual.dist, 10);
});

QUnit.test("project line to triangle", function(assert) {
    var geom = new THREE.Geometry();
    geom.vertices.push(vec(0, 0, 0), vec(10, 0, 0), vec(0, 10, 0))
    geom.faces.push(new THREE.Face3(0, 1, 2));
    var actual = new ProjectToMesh(geom).projectPolyline([vec(1, 1, 1), vec(2, 2, 2)]);
    assert.deepEqual(actual, [vec(1, 1, 0), vec(2, 2, 0)]);
});

QUnit.test("project line to plane", function(assert) {
    var geom = new THREE.PlaneGeometry(10, 10);
    var actual = new ProjectToMesh(geom).projectPolyline([vec(-1, 1, 1), vec(-2, -4, 2)]);
    assert.deepEqual(actual, [vec(-1, 1, 0), vec(-1.5, -1.5, 0), vec(-2, -4, 0)]);
});

QUnit.test("project line to box", function(assert) {
    var geom = new THREE.BoxGeometry(10, 10, 10);
    var actual = new ProjectToMesh(geom).projectPolyline([vec(-1, -4, 15), vec(15, 3, -4)]);
    actual = actual.map(a => a.toArray().map(x => Math.round(x * 10000) / 10000));
    // console.log(actual.map(a => a.toArray()).join('], ['));
    assert.deepEqual(actual, [
        [-1, -4, 5],
        [5, -4, 5],
        [5, -0.5, 0.5],
        [5, 3, -4]
    ]);
});

QUnit.test("project line to sphere", function(assert) {
    var geom = new THREE.SphereGeometry(10);
    var actual = new ProjectToMesh(geom).projectPolyline([vec(1.5, 1, 11), vec(1.3, -8, 7)]);
    actual = actual.map(a => a.toArray().map(x => Math.round(x * 10000) / 10000));
    // console.log(actual.join('], ['));
    assert.deepEqual(actual, [
        [0.8706, 0.5929, 9.4805],
        [0.9806, 0, 9.5938],
        [1.0223, -0.8347, 9.3529],
        [1.2305, -5, 8.1506],
        [1.0794, -6.1175, 7.0957],
        [0.9417, -7.1351, 6.1351]
    ]);
});

QUnit.test("project polyline to box", function(assert) {
    var geom = new THREE.BoxGeometry(10, 10, 10);
    var actual = new ProjectToMesh(geom).projectPolyline([vec(-1, -4, 15), vec(15, 3, -4), vec(-1, -4, -15)]);
    actual = actual.map(a => a.toArray().map(x => Math.round(x * 10000) / 10000));
    // console.log(actual.join('], ['));
    assert.deepEqual(actual, [
        [-1, -4, 5],
        [5, -4, 5],
        [5, -0.5, 0.5],
        [5, 3, -4],
        [5, 3, -5],
        [1.3077, -1.3077, -5],
        [-1, -4, -5]
    ]);
});

QUnit.test("intersect box with plane", function(assert) {
    var geom = new THREE.BoxGeometry(10, 10, 10);
    var plane = new THREE.Plane();
    var actual = new MeshIntersectPlane(geom).sliceByPlane(plane);
    actual = actual.map(a => a.map(b => b.toArray()));
    assert.deepEqual(actual, [
        [
            [0, -5, 5],
            [0, 0, 5],
            [0, 5, 5],
            [0, 5, 0],
            [0, 5, -5],
            [0, 0, -5],
            [0, -5, -5],
            [0, -5, 0],
            [0, -5, 5]
        ]
    ]);
});
