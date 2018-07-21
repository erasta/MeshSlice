class AppSlice {
    init() {
        this.x = 0;
        this.y = 0;
        this.z = 1;
        this.delta = 1;

        this.initGui();

        this.mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(10, 3, 128, 32), new THREE.MeshStandardMaterial({ color: 'red', transparent: true, opacity: 0.3 }));
        // this.mesh = new THREE.Mesh(new THREE.TorusGeometry(10, 4, 128, 32), new THREE.MeshStandardMaterial({ color: 'red', transparent: true, opacity: 0.3 }));
        this.sceneManager.scene.add(this.mesh);
        // this.sceneManager.scene.add(new THREE.Mesh(this.mesh.geometry, new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true })));

        this.applyGuiChanges();
    }

    applyGuiChanges() {
        const normal = new THREE.Vector3(this.x, this.y, this.z).normalize();
        if (isNaN(normal.x)) normal.set(0,0,1);
        const lines = new MeshSlicer(this.mesh.geometry).slice(this.delta, normal);
        this.sceneManager.scene.remove(this.lines);
        this.sceneManager.scene.add(this.lines = new THREE.Object3D());
        lines.forEach(l => {
            const out = new THREE.Line(new THREE.Geometry(), new THREE.LineBasicMaterial({ color: 'green' }));
            out.geometry.vertices = l;
            this.lines.add(out);
        })
    }

    initGui() {
        this.applyGuiChanges = this.applyGuiChanges.bind(this);
        this.gui = new dat.GUI({ autoPlace: true, width: 500 });
        this.app = 'Slice';
        this.gui.add(this, 'app', apps).onChange(() => {window.location.href = window.location.origin + window.location.pathname + '?' + this.app});
        this.gui.add(this, 'x').min(-1).max(1).step(0.01).onChange(this.applyGuiChanges);
        this.gui.add(this, 'y').min(-1).max(1).step(0.01).onChange(this.applyGuiChanges);
        this.gui.add(this, 'z').min(-1).max(1).step(0.01).onChange(this.applyGuiChanges);
        this.gui.add(this, 'delta').min(0.01).max(3).step(0.01).onChange(this.applyGuiChanges);
    }
}
