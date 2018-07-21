class AppProject {
    init() {
        this.x1 = 2;
        this.y1 = 15;
        this.z1 = 5;
        this.x2 = 2;
        this.y2 = -13;
        this.z2 = 15;
        this.x3 = 15;
        this.y3 = 3;
        this.z3 = 1;

        this.initGui();

        this.mesh = new THREE.Mesh(new THREE.SphereGeometry(10), new THREE.MeshStandardMaterial({ color: 'red', transparent: true, opacity: 0.3 }));
        // this.mesh = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshStandardMaterial({ color: 'red', transparent: true, opacity: 0.3 }));
        this.sceneManager.scene.add(this.mesh);
        this.sceneManager.scene.add(new THREE.Mesh(this.mesh.geometry, new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true })));

        this.applyGuiChanges();
    }

    addLine(poly, color) {
        const out = new THREE.Line(new THREE.Geometry(), new THREE.LineBasicMaterial({ color: color }));
        out.geometry.vertices = poly;
        this.sceneManager.scene.add(out);
        return out;
    }

    applyGuiChanges() {
        const v1 = new THREE.Vector3(this.x1, this.y1, this.z1);
        const v2 = new THREE.Vector3(this.x2, this.y2, this.z2);
        const v3 = new THREE.Vector3(this.x3, this.y3, this.z3);

        this.sceneManager.scene.remove(this.line);
        this.line = this.addLine([v1, v2, v3], 'blue');

        var actual = new ProjectToMesh(this.mesh.geometry).projectPolyline([v1, v2, v3]);
        this.sceneManager.scene.remove(this.out);
        this.out = this.addLine(actual, 'green');
        // console.log('*****');actual.forEach(a => console.log(a.toArray()));
    }

    initGui() {
        this.applyGuiChanges = this.applyGuiChanges.bind(this);
        this.gui = new dat.GUI({ autoPlace: true, width: 500 });
        this.app = 'Project';
        this.gui.add(this, 'app', apps).onChange(() => {window.location.href = window.location.origin + window.location.pathname + '?' + this.app});
        this.gui.add(this, 'x1').min(-15).max(15).step(0.01).onChange(this.applyGuiChanges);
        this.gui.add(this, 'y1').min(-15).max(15).step(0.01).onChange(this.applyGuiChanges);
        this.gui.add(this, 'z1').min(-15).max(15).step(0.01).onChange(this.applyGuiChanges);
        this.gui.add(this, 'x2').min(-15).max(15).step(0.01).onChange(this.applyGuiChanges);
        this.gui.add(this, 'y2').min(-15).max(15).step(0.01).onChange(this.applyGuiChanges);
        this.gui.add(this, 'z2').min(-15).max(15).step(0.01).onChange(this.applyGuiChanges);
        this.gui.add(this, 'x3').min(-15).max(15).step(0.01).onChange(this.applyGuiChanges);
        this.gui.add(this, 'y3').min(-15).max(15).step(0.01).onChange(this.applyGuiChanges);
        this.gui.add(this, 'z3').min(-15).max(15).step(0.01).onChange(this.applyGuiChanges);
    }
}
