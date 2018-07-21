/**
 * Finds the closest points on two 3D segments
 * Segments are given as pairs of THREE.Vector3
 * Members point1, point2 and dist will be set with the output
 * Adepted from http://geomalgorithms.com/a07-_distance.html
 */
 class SegmentsClosestPoints {
    constructor(seg1p1, seg1p2, seg2p1, seg2p2) {
        var u = seg1p2.clone().sub(seg1p1);
        var v = seg2p2.clone().sub(seg2p1);
        var w = seg1p1.clone().sub(seg2p1);
        var a = u.dot(u);         // always >= 0
        var b = u.dot(v);
        var c = v.dot(v);         // always >= 0
        var d = u.dot(w);
        var e = v.dot(w);
        var D = a * c - b * b;        // always >= 0
        var sc, sN, sD = D;       // sc = sN / sD, default sD = D >= 0
        var tc, tN, tD = D;       // tc = tN / tD, default tD = D >= 0

        // compute the line parameters of the two closest points
        if (D < 1e-6) { // the lines are almost parallel
            sN = 0.0;         // force using point P0 on segment S1
            sD = 1.0;         // to prevent possible division by 0.0 later
            tN = e;
            tD = c;
        } else {                 // get the closest points on the infinite lines
            sN = (b * e - c * d);
            tN = (a * e - b * d);
            if (sN < 0.0) {        // sc < 0 => the s=0 edge is visible
                sN = 0.0;
                tN = e;
                tD = c;
            } else if (sN > sD) {  // sc > 1  => the s=1 edge is visible
                sN = sD;
                tN = e + b;
                tD = c;
            }
        }

        if (tN < 0.0) {            // tc < 0 => the t=0 edge is visible
            tN = 0.0;
            // recompute sc for this edge
            if (-d < 0.0) {
                sN = 0.0;
            } else if (-d > a) {
                sN = sD;
            } else {
                sN = -d;
                sD = a;
            }
        } else if (tN > tD) {      // tc > 1  => the t=1 edge is visible
            tN = tD;
            // recompute sc for this edge
            if ((-d + b) < 0.0) {
                sN = 0;
            } else if ((-d + b) > a) {
                sN = sD;
            } else {
                sN = (-d + b);
                sD = a;
            }
        }
        // finally do the division to get sc and tc
        sc = ((Math.abs(sN) < 1e-6) ? 0.0 : sN / sD);
        tc = ((Math.abs(tN) < 1e-6) ? 0.0 : tN / tD);

        // get closest points
        u.multiplyScalar(sc);
        v.multiplyScalar(tc);
        this.point1 = u.add(seg1p1);
        this.point2 = v.add(seg2p1);
        this.dist = this.point1.distanceTo(this.point2);
    }
}

if (typeof module !== 'undefined') module.exports.SegmentsClosestPoints = SegmentsClosestPoints;
