import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function ModelViewer() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            mount.clientWidth / mount.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 3;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mount.appendChild(renderer.domElement);

        const ambient = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambient);
        const directional = new THREE.DirectionalLight(0xffffff, 2);
        directional.position.set(5, 5, 5);
        scene.add(directional);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        const loader = new GLTFLoader();
        loader.load(
            "/model.glb",
            (gltf) => {
                scene.add(gltf.scene);
                const box = new THREE.Box3().setFromObject(gltf.scene);
                const center = box.getCenter(new THREE.Vector3());
                gltf.scene.position.sub(center);
            },
            undefined,
            (error) => {
                console.error("Error loading model:", error);
            }
        );

        const onResize = () => {
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        const observer = new ResizeObserver(onResize);
        observer.observe(mount);

        let animId: number;
        const animate = () => {
            animId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(animId);
            observer.disconnect();
            controls.dispose();
            renderer.dispose();
            mount.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full" />;
}