import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Eye, RefreshCw, ZoomIn, ZoomOut, Check, 
  Layers, Maximize2, Sparkles, Box, Compass, Info, AlertTriangle, MessageSquare
} from 'lucide-react';
import { useEnquiry } from '../context/EnquiryContext';
import { Product } from '../types';

export interface Hotspot {
  id: string;
  name: string;
  code: string;
  category: string;
  price: number;
  position: THREE.Vector3;
  specs: string;
  dimensions: string;
  product: Product;
}

export interface Bathroom3DSceneProps {
  onSelectProduct?: (hotspot: Hotspot) => void;
  selectedId?: string | null;
  onFinishChange?: (finish: string) => void;
}

export const Bathroom3DScene: React.FC<Bathroom3DSceneProps> = ({ 
  onSelectProduct, 
  selectedId,
  onFinishChange 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [finish, setFinish] = useState<'white' | 'matte-black' | 'ivory' | 'slate'>('white');
  const [activeView, setActiveView] = useState<'suite' | 'ewc' | 'basin' | 'cistern'>('suite');
  const [loading, setLoading] = useState(true);
  const [webGLError, setWebGLError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const { openEnquiry } = useEnquiry();

  // Three.js internal references for runtime controls
  const ceramicMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const sphericalRef = useRef({ radius: 6.8, theta: 0.85, phi: 1.15 });
  const targetSphericalRef = useRef({ radius: 6.8, theta: 0.85, phi: 1.15 });
  const lookTargetRef = useRef(new THREE.Vector3(0, 1.1, -0.6));
  const targetLookRef = useRef(new THREE.Vector3(0, 1.1, -0.6));

  // Pre-configured Hotspots matching Aqua Ceramics verified catalog
  const hotspotProducts: Hotspot[] = [
    {
      id: 'ewc',
      name: 'Aqua Luxe Rimless Wall-Hung EWC',
      code: 'AC-EWC-101',
      category: 'Western Toilets / EWC',
      price: 12490,
      position: new THREE.Vector3(-1.2, 0.85, -1.3),
      specs: 'Vitreous china wall-hung toilet with rimless 360° cyclone flush, nano-glaze antibacterial shield, and soft-close ergonomic UF seat.',
      dimensions: '530 x 360 x 360 mm',
      product: {
        id: 1,
        code: 'AC-EWC-101',
        name: 'Aqua Luxe Rimless Wall-Hung EWC',
        category: 'Western Toilets / EWC',
        brand: 'Aqua Ceramics',
        price: 12490,
        stock: 45,
        availability: 'In Stock',
        description: 'Premium vitreous china wall-hung Western toilet with rimless hygiene technology and ultra-quiet soft-close seat cover.',
        dimensions: '530 x 360 x 360 mm',
        image_url: '/images/products/wall-hung-toilet.jpg',
        is_featured: 1,
        is_published: 1
      }
    },
    {
      id: 'basin',
      name: 'Aqua Crystal Table-Top Wash Basin',
      code: 'AC-WB-201',
      category: 'Wash Basins',
      price: 5490,
      position: new THREE.Vector3(1.2, 1.35, -1.4),
      specs: 'Ultra-thin rim designer ceramic vessel basin with deep splash-free bowl, smooth glazed drain opening, and stain-resistant glaze.',
      dimensions: '480 x 370 x 130 mm',
      product: {
        id: 5,
        code: 'AC-WB-201',
        name: 'Aqua Crystal Ceramic Table-Top Wash Basin',
        category: 'Wash Basins',
        brand: 'Aqua Ceramics',
        price: 5490,
        stock: 50,
        availability: 'In Stock',
        description: 'Elegant rectangular counter-top wash bowl with smooth curved edges and deep basin depth to eliminate water splash.',
        dimensions: '480 x 370 x 130 mm',
        image_url: '/images/products/table-top-basin.jpg',
        is_featured: 1,
        is_published: 1
      }
    },
    {
      id: 'cistern',
      name: 'Aqua Smart Concealed Dual-Flush Cistern',
      code: 'AC-ST-301',
      category: 'Other Sanitaryware',
      price: 4890,
      position: new THREE.Vector3(-1.2, 1.6, -1.9),
      specs: 'High-density insulated in-wall water reservoir with structural steel frame, acoustic insulation pad, and chrome dual pneumatic actuator plate.',
      dimensions: '500 x 120 x 1100 mm',
      product: {
        id: 9,
        code: 'AC-ST-301',
        name: 'Aqua Smart Concealed Dual-Flush Cistern',
        category: 'Other Sanitaryware',
        brand: 'Aqua Ceramics',
        price: 4890,
        stock: 70,
        availability: 'In Stock',
        description: 'In-wall concealed water tank with heavy-duty structural steel mounting frame for wall-hung EWCs.',
        dimensions: '500 x 120 x 1100 mm',
        image_url: '/images/products/concealed-tank.jpg',
        is_featured: 1,
        is_published: 1
      }
    }
  ];

  // Helper function to focus camera on specific fixture
  const focusView = useCallback((viewType: 'suite' | 'ewc' | 'basin' | 'cistern') => {
    setActiveView(viewType);
    if (viewType === 'suite') {
      targetSphericalRef.current = { radius: 6.8, theta: 0.85, phi: 1.15 };
      targetLookRef.current = new THREE.Vector3(0, 1.1, -0.6);
    } else if (viewType === 'ewc') {
      targetSphericalRef.current = { radius: 3.6, theta: 0.65, phi: 1.25 };
      targetLookRef.current = new THREE.Vector3(-1.2, 0.55, -1.3);
      const hp = hotspotProducts.find(h => h.id === 'ewc');
      if (hp) {
        setSelectedHotspot(hp);
        onSelectProduct?.(hp);
      }
    } else if (viewType === 'basin') {
      targetSphericalRef.current = { radius: 3.5, theta: 1.05, phi: 1.2 };
      targetLookRef.current = new THREE.Vector3(1.2, 0.95, -1.4);
      const hp = hotspotProducts.find(h => h.id === 'basin');
      if (hp) {
        setSelectedHotspot(hp);
        onSelectProduct?.(hp);
      }
    } else if (viewType === 'cistern') {
      targetSphericalRef.current = { radius: 3.2, theta: 0.45, phi: 1.2 };
      targetLookRef.current = new THREE.Vector3(-1.2, 1.5, -1.9);
      const hp = hotspotProducts.find(h => h.id === 'cistern');
      if (hp) {
        setSelectedHotspot(hp);
        onSelectProduct?.(hp);
      }
    }
  }, [onSelectProduct]);

  // Sync external selectedId prop to camera focus
  useEffect(() => {
    if (selectedId) {
      if (selectedId === 'ewc' || selectedId === 'AC-EWC-101' || selectedId === 'AQ-EWC-101') {
        focusView('ewc');
      } else if (selectedId === 'basin' || selectedId === 'AC-WB-201' || selectedId === 'AQ-WB-201') {
        focusView('basin');
      } else if (selectedId === 'cistern' || selectedId === 'AC-ST-301' || selectedId === 'AQ-SAN-301') {
        focusView('cistern');
      }
    }
  }, [selectedId, focusView]);

  // Main Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Calculate dimensions with fallback
    const getDims = () => {
      const w = container.clientWidth || container.parentElement?.clientWidth || 800;
      const h = container.clientHeight || container.parentElement?.clientHeight || 620;
      return {
        width: Math.max(w, 320),
        height: Math.max(h, 450)
      };
    };

    const { width: initWidth, height: initHeight } = getDims();

    // 2. Initialize Three.js Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090d16); // Deep slate-navy aesthetic

    // 3. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, initWidth / initHeight, 0.1, 100);
    cameraRef.current = camera;
    
    // Initial camera position from spherical coordinates
    const s = sphericalRef.current;
    camera.position.set(
      s.radius * Math.sin(s.phi) * Math.sin(s.theta),
      s.radius * Math.cos(s.phi),
      s.radius * Math.sin(s.phi) * Math.cos(s.theta)
    );
    camera.lookAt(lookTargetRef.current);

    // 4. WebGL Renderer with Error Handling
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false
      });
    } catch (e) {
      console.warn('Three.js WebGL initialization error:', e);
      setWebGLError(true);
      setLoading(false);
      return;
    }

    rendererRef.current = renderer;
    renderer.setSize(initWidth, initHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Attach canvas to container safely
    container.innerHTML = '';
    const domElem = renderer.domElement;
    domElem.style.width = '100%';
    domElem.style.height = '100%';
    domElem.style.display = 'block';
    domElem.style.touchAction = 'none'; // Critical for smooth mobile touch gestures
    container.appendChild(domElem);

    // 5. Lighting Design (Luxury Architectural Studio)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    // Key Light (Warm daylight through ceiling wash)
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
    keyLight.position.set(4, 7, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Soft Blue Fill Light (Corporate Aqua Ceramics tone)
    const aquaFillLight = new THREE.PointLight(0x0284c7, 3.2, 12);
    aquaFillLight.position.set(-2.5, 3.5, -0.5);
    scene.add(aquaFillLight);

    // Warm Mirror Backlight
    const mirrorBacklight = new THREE.PointLight(0xfef08a, 2.8, 5);
    mirrorBacklight.position.set(1.2, 2.6, -1.8);
    scene.add(mirrorBacklight);

    // Soft Ceiling Spot
    const ceilingSpot = new THREE.SpotLight(0xffffff, 2.0);
    ceilingSpot.position.set(0, 5, 0);
    ceilingSpot.angle = Math.PI / 4;
    ceilingSpot.penumbra = 0.5;
    ceilingSpot.target.position.set(0, 0, -1);
    scene.add(ceilingSpot);
    scene.add(ceilingSpot.target);

    // 6. Architectural Materials
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.18,
      metalness: 0.1
    });

    const backWallMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.35,
      metalness: 0.05
    });

    const accentWallMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f4c81, // Premium Aqua Navy
      roughness: 0.25,
      metalness: 0.15
    });

    const woodVanityMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.45,
      metalness: 0.05
    });

    const chromeMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.08
    });

    const mirrorMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.01
    });

    // Vitreous China Ceramic Material (updated on finish switch)
    const ceramicMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.04
    });
    ceramicMaterialsRef.current = [ceramicMaterial];

    // 7. Room Architecture
    // Floor
    const floorGeo = new THREE.PlaneGeometry(9, 9);
    const floor = new THREE.Mesh(floorGeo, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Back Wall
    const backWallGeo = new THREE.PlaneGeometry(9, 6);
    const backWall = new THREE.Mesh(backWallGeo, backWallMaterial);
    backWall.position.set(0, 3, -2.1);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left Feature Wall
    const leftWallGeo = new THREE.PlaneGeometry(9, 6);
    const leftWall = new THREE.Mesh(leftWallGeo, accentWallMaterial);
    leftWall.position.set(-3.0, 3, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Floor Baseboard trim
    const trimGeo = new THREE.BoxGeometry(9, 0.12, 0.04);
    const trim = new THREE.Mesh(trimGeo, woodVanityMaterial);
    trim.position.set(0, 0.06, -2.08);
    scene.add(trim);

    // 8. Sanitaryware Fixtures
    // A. WALL-HUNG TOILET (EWC)
    const toiletGroup = new THREE.Group();
    toiletGroup.position.set(-1.2, 0.48, -1.3);

    // Vitreous China Bowl Body
    const bowlGeo = new THREE.CylinderGeometry(0.25, 0.19, 0.38, 36);
    const bowlMesh = new THREE.Mesh(bowlGeo, ceramicMaterial);
    bowlMesh.castShadow = true;
    bowlMesh.receiveShadow = true;
    toiletGroup.add(bowlMesh);

    // Inner Bowl Basin Cavity
    const innerBowlGeo = new THREE.CylinderGeometry(0.21, 0.13, 0.34, 32);
    const innerBowlMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.2 });
    const innerBowl = new THREE.Mesh(innerBowlGeo, innerBowlMat);
    innerBowl.position.y = 0.03;
    toiletGroup.add(innerBowl);

    // Soft-Close Seat & Lid
    const seatGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.035, 36);
    const seatMesh = new THREE.Mesh(seatGeo, ceramicMaterial);
    seatMesh.position.y = 0.21;
    seatMesh.castShadow = true;
    toiletGroup.add(seatMesh);

    // Wall-Mounting Bracket Box
    const mountGeo = new THREE.BoxGeometry(0.38, 0.36, 0.28);
    const mountMesh = new THREE.Mesh(mountGeo, ceramicMaterial);
    mountMesh.position.set(0, 0.04, -0.22);
    mountMesh.castShadow = true;
    toiletGroup.add(mountMesh);

    // Chrome Seat Hinge Caps
    const hingeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.04, 16);
    const hinge1 = new THREE.Mesh(hingeGeo, chromeMaterial);
    hinge1.position.set(-0.1, 0.23, -0.15);
    const hinge2 = hinge1.clone();
    hinge2.position.set(0.1, 0.23, -0.15);
    toiletGroup.add(hinge1);
    toiletGroup.add(hinge2);

    scene.add(toiletGroup);

    // Concealed Cistern Flush Plate (Chrome on wall)
    const plateGroup = new THREE.Group();
    plateGroup.position.set(-1.2, 1.45, -2.06);

    const plateGeo = new THREE.BoxGeometry(0.32, 0.22, 0.02);
    const plateMesh = new THREE.Mesh(plateGeo, chromeMaterial);
    plateGroup.add(plateMesh);

    const btn1Geo = new THREE.CylinderGeometry(0.04, 0.04, 0.025, 24);
    btn1Geo.rotateX(Math.PI / 2);
    const btn1 = new THREE.Mesh(btn1Geo, new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 }));
    btn1.position.set(-0.06, 0, 0.01);
    plateGroup.add(btn1);

    const btn2 = btn1.clone();
    btn2.scale.set(1.2, 1.2, 1.2);
    btn2.position.set(0.06, 0, 0.01);
    plateGroup.add(btn2);

    scene.add(plateGroup);

    // B. DESIGNER FLOATING VANITY & TABLE-TOP BASIN
    const vanityGroup = new THREE.Group();
    vanityGroup.position.set(1.2, 0.78, -1.4);

    // Floating Counter Drawer Cabinet
    const counterGeo = new THREE.BoxGeometry(1.5, 0.38, 0.7);
    const counterMesh = new THREE.Mesh(counterGeo, woodVanityMaterial);
    counterMesh.castShadow = true;
    counterMesh.receiveShadow = true;
    vanityGroup.add(counterMesh);

    // Counter Top Quartz Slab
    const slabGeo = new THREE.BoxGeometry(1.54, 0.04, 0.74);
    const slabMesh = new THREE.Mesh(slabGeo, new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1 }));
    slabMesh.position.y = 0.21;
    slabMesh.castShadow = true;
    vanityGroup.add(slabMesh);

    // Table-Top Ceramic Vessel Basin
    const basinGeo = new THREE.CylinderGeometry(0.32, 0.26, 0.18, 36);
    const basinMesh = new THREE.Mesh(basinGeo, ceramicMaterial);
    basinMesh.position.set(0, 0.32, 0.03);
    basinMesh.castShadow = true;
    basinMesh.receiveShadow = true;
    vanityGroup.add(basinMesh);

    // Basin Inner Bowl Depression
    const basinInnerGeo = new THREE.CylinderGeometry(0.29, 0.22, 0.17, 32);
    const basinInner = new THREE.Mesh(basinInnerGeo, new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.1 }));
    basinInner.position.set(0, 0.33, 0.03);
    vanityGroup.add(basinInner);

    // Chrome Clicker Waste Pop-Up
    const wasteGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16);
    const waste = new THREE.Mesh(wasteGeo, chromeMaterial);
    waste.position.set(0, 0.26, 0.03);
    vanityGroup.add(waste);

    // Chrome Tall Basin Mixer Faucet
    const faucetPillarGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.3, 20);
    const faucetPillar = new THREE.Mesh(faucetPillarGeo, chromeMaterial);
    faucetPillar.position.set(0, 0.52, -0.22);
    faucetPillar.castShadow = true;
    vanityGroup.add(faucetPillar);

    const faucetSpoutGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.16, 16);
    const faucetSpout = new THREE.Mesh(faucetSpoutGeo, chromeMaterial);
    faucetSpout.rotation.x = Math.PI / 2.6;
    faucetSpout.position.set(0, 0.65, -0.15);
    faucetSpout.castShadow = true;
    vanityGroup.add(faucetSpout);

    const faucetLeverGeo = new THREE.BoxGeometry(0.02, 0.01, 0.09);
    const faucetLever = new THREE.Mesh(faucetLeverGeo, chromeMaterial);
    faucetLever.position.set(0, 0.68, -0.22);
    vanityGroup.add(faucetLever);

    scene.add(vanityGroup);

    // C. LED BACKLIT ILLUMINATED VANITY MIRROR
    const mirrorGroup = new THREE.Group();
    mirrorGroup.position.set(1.2, 2.45, -2.04);

    // Mirror Glass Surface
    const mirrorGeo = new THREE.BoxGeometry(1.0, 1.3, 0.02);
    const mirrorMesh = new THREE.Mesh(mirrorGeo, mirrorMaterial);
    mirrorGroup.add(mirrorMesh);

    // Glowing LED Border Aura Frame
    const auraGeo = new THREE.BoxGeometry(1.06, 1.36, 0.015);
    const auraMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    auraMesh.position.z = -0.01;
    mirrorGroup.add(auraMesh);

    scene.add(mirrorGroup);

    // D. Chrome Towel Rail on Left Accent Wall
    const railGroup = new THREE.Group();
    railGroup.position.set(-2.94, 1.4, 0.5);
    railGroup.rotation.y = Math.PI / 2;

    const barGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.8, 16);
    barGeo.rotateZ(Math.PI / 2);
    const barMesh = new THREE.Mesh(barGeo, chromeMaterial);
    railGroup.add(barMesh);

    const postGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.12, 16);
    postGeo.rotateX(Math.PI / 2);
    const post1 = new THREE.Mesh(postGeo, chromeMaterial);
    post1.position.set(-0.38, 0, -0.06);
    const post2 = post1.clone();
    post2.position.set(0.38, 0, -0.06);
    railGroup.add(post1);
    railGroup.add(post2);

    scene.add(railGroup);

    // 9. Interactive 3D Hotspot Pins (High-visibility pulsing markers)
    const hotspotMeshes: THREE.Group[] = [];
    hotspotProducts.forEach((hp) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.copy(hp.position);

      // Core Glowing Pin Sphere
      const coreGeo = new THREE.SphereGeometry(0.08, 24, 24);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x0284c7,
        emissiveIntensity: 0.9,
        roughness: 0.2
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      pinGroup.add(coreMesh);

      // Outer Pulsating Halo Ring
      const ringGeo = new THREE.RingGeometry(0.12, 0.17, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.userData = { isHalo: true };
      pinGroup.add(ringMesh);

      // Store hotspot metadata on parent and child for raycaster hits
      pinGroup.userData = { hotspot: hp };
      coreMesh.userData = { hotspot: hp };
      ringMesh.userData = { hotspot: hp };

      scene.add(pinGroup);
      hotspotMeshes.push(pinGroup);
    });

    // 10. Smooth Pointer & Touch Interaction
    let isPointerDown = false;
    let startX = 0;
    let startY = 0;
    let hasMoved = false;

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      startX = e.clientX;
      startY = e.clientY;
      hasMoved = false;
      try {
        domElem.setPointerCapture?.(e.pointerId);
      } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      // Hover feedback cursor on pins
      const rect = domElem.getBoundingClientRect();
      const hx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const hy = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      const hoverRay = new THREE.Raycaster();
      hoverRay.setFromCamera(new THREE.Vector2(hx, hy), camera);
      const hoverHits = hoverRay.intersectObjects(hotspotMeshes, true);
      domElem.style.cursor = hoverHits.length > 0 ? 'pointer' : (isPointerDown ? 'grabbing' : 'grab');

      if (!isPointerDown) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        hasMoved = true;
      }

      // Smooth spherical angle updates
      targetSphericalRef.current.theta -= deltaX * 0.005;
      targetSphericalRef.current.phi = Math.max(
        0.35, 
        Math.min(Math.PI / 2.05, targetSphericalRef.current.phi - deltaY * 0.005)
      );

      startX = e.clientX;
      startY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      try {
        domElem.releasePointerCapture?.(e.pointerId);
      } catch {}

      // Click raycast if user didn't drag
      if (!hasMoved) {
        const rect = domElem.getBoundingClientRect();
        const clickMouse = new THREE.Vector2();
        clickMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        clickMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(clickMouse, camera);
        const intersects = raycaster.intersectObjects(hotspotMeshes, true);

        if (intersects.length > 0) {
          let clickedObj: THREE.Object3D | null = intersects[0].object;
          while (clickedObj && !clickedObj.userData?.hotspot && clickedObj.parent) {
            clickedObj = clickedObj.parent;
          }
          if (clickedObj?.userData?.hotspot) {
            const hp = clickedObj.userData.hotspot as Hotspot;
            setSelectedHotspot(hp);
            onSelectProduct?.(hp);
            focusView(hp.id as any);
          }
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetSphericalRef.current.radius = Math.max(
        3.0, 
        Math.min(9.5, targetSphericalRef.current.radius + e.deltaY * 0.004)
      );
    };

    domElem.addEventListener('pointerdown', onPointerDown);
    domElem.addEventListener('pointermove', onPointerMove);
    domElem.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('pointercancel', onPointerUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    // 11. Render Animation Loop with Smooth Interpolation
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera spherical lerp
      const sRef = sphericalRef.current;
      const tsRef = targetSphericalRef.current;
      sRef.theta += (tsRef.theta - sRef.theta) * 0.08;
      sRef.phi += (tsRef.phi - sRef.phi) * 0.08;
      sRef.radius += (tsRef.radius - sRef.radius) * 0.08;

      camera.position.x = sRef.radius * Math.sin(sRef.phi) * Math.sin(sRef.theta);
      camera.position.y = sRef.radius * Math.cos(sRef.phi);
      camera.position.z = sRef.radius * Math.sin(sRef.phi) * Math.cos(sRef.theta);

      // Smooth look-target lerp
      lookTargetRef.current.lerp(targetLookRef.current, 0.08);
      camera.lookAt(lookTargetRef.current);

      // Pulsing hotspot pins & billboard halo rings toward camera
      hotspotMeshes.forEach((group, idx) => {
        const floatOffset = Math.sin(elapsed * 2.8 + idx * 1.5) * 0.02;
        group.position.y = hotspotProducts[idx].position.y + floatOffset;

        const halo = group.children.find(c => c.userData?.isHalo) as THREE.Mesh;
        if (halo) {
          halo.lookAt(camera.position);
          const scale = 1.0 + Math.sin(elapsed * 4 + idx) * 0.25;
          halo.scale.set(scale, scale, scale);
        }
      });

      renderer.render(scene, camera);
    };

    animate();
    setLoading(false);

    // 12. Dynamic Container Resizing via ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: rw, height: rh } = entry.contentRect;
        if (rw > 0 && rh > 0) {
          camera.aspect = rw / rh;
          camera.updateProjectionMatrix();
          renderer.setSize(rw, rh);
        }
      }
    });
    resizeObserver.observe(container);

    const handleWindowResize = () => {
      const { width: nw, height: nh } = getDims();
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleWindowResize);

    // Cleanup resources on unmount
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      domElem.removeEventListener('pointerdown', onPointerDown);
      domElem.removeEventListener('pointermove', onPointerMove);
      domElem.removeEventListener('pointerup', onPointerUp);
      domElem.removeEventListener('pointercancel', onPointerUp);
      domElem.removeEventListener('wheel', onWheel);
      renderer.dispose();
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [focusView, onSelectProduct]);

  // Handle Ceramic Finish Change
  const handleFinishChange = (newFinish: 'white' | 'matte-black' | 'ivory' | 'slate') => {
    setFinish(newFinish);
    onFinishChange?.(newFinish);

    ceramicMaterialsRef.current.forEach((mat) => {
      if (newFinish === 'white') {
        mat.color.setHex(0xffffff);
        mat.roughness = 0.08;
        mat.metalness = 0.04;
      } else if (newFinish === 'matte-black') {
        mat.color.setHex(0x18181b);
        mat.roughness = 0.65;
        mat.metalness = 0.12;
      } else if (newFinish === 'ivory') {
        mat.color.setHex(0xfbf7ed);
        mat.roughness = 0.1;
        mat.metalness = 0.05;
      } else if (newFinish === 'slate') {
        mat.color.setHex(0x334155);
        mat.roughness = 0.45;
        mat.metalness = 0.15;
      }
    });
  };

  // Zoom controls
  const handleZoomIn = () => {
    targetSphericalRef.current.radius = Math.max(3.0, targetSphericalRef.current.radius - 0.8);
  };

  const handleZoomOut = () => {
    targetSphericalRef.current.radius = Math.min(9.5, targetSphericalRef.current.radius + 0.8);
  };

  const handleReset = () => {
    focusView('suite');
    setSelectedHotspot(null);
  };

  return (
    <div className={`relative w-full ${fullscreen ? 'fixed inset-0 z-50 h-screen rounded-none' : 'h-[620px] rounded-3xl'} bg-slate-950 overflow-hidden border border-slate-800 shadow-2xl transition-all duration-300`}>
      {/* Three.js Canvas Mount */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing outline-hidden"
      />

      {/* Loading Overlay */}
      {loading && !webGLError && (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-4 z-40">
          <div className="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin"></div>
          <div className="text-sm font-bold text-slate-300">
            Initializing Aqua Ceramics 3D Suite...
          </div>
        </div>
      )}

      {/* WebGL Fallback Card (in case browser context fails) */}
      {webGLError && (
        <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-8 text-center z-40 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white font-serif">
            Hardware Accelerated 3D View Unavailable
          </h3>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            Your browser or device has WebGL hardware acceleration disabled. You can still inspect our architectural sanitaryware models in high resolution below.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl pt-2">
            {hotspotProducts.map((hp) => (
              <div 
                key={hp.id}
                onClick={() => {
                  setSelectedHotspot(hp);
                  onSelectProduct?.(hp);
                }}
                className="p-3 bg-slate-800 rounded-xl border border-slate-700 hover:border-sky-500 cursor-pointer text-left transition-all"
              >
                <div className="text-xs font-bold text-white truncate">{hp.name}</div>
                <div className="text-[10px] text-slate-400 mt-1">Model: {hp.code}</div>
                <div className="text-xs font-bold text-sky-400 mt-1">₹{hp.price.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Floating Controls Overlay */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 flex flex-wrap items-center gap-2 sm:gap-3 max-w-[90%] pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl px-3.5 py-2.5 text-white shadow-xl">
          <div className="text-[11px] font-extrabold text-sky-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Interactive 3D Suite
          </div>
          <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">
            Aqua Ceramics Architectural Bathroom
          </div>
        </div>

        {/* Ceramic Finish Switcher */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl p-1.5 flex items-center gap-1.5 text-white text-xs shadow-xl">
          <span className="text-slate-400 font-medium px-2 hidden md:inline text-[11px]">Finish:</span>
          
          <button
            onClick={() => handleFinishChange('white')}
            title="Alpine White Finish"
            className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs ${
              finish === 'white' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-400"></span>
            <span className="hidden sm:inline">White</span>
          </button>

          <button
            onClick={() => handleFinishChange('matte-black')}
            title="Matte Charcoal Black Finish"
            className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs ${
              finish === 'matte-black' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-600"></span>
            <span className="hidden sm:inline">Matte Black</span>
          </button>

          <button
            onClick={() => handleFinishChange('ivory')}
            title="Gloss Luxury Ivory Finish"
            className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs ${
              finish === 'ivory' ? 'bg-amber-100 text-amber-950 shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-200 border border-amber-300"></span>
            <span className="hidden sm:inline">Ivory</span>
          </button>

          <button
            onClick={() => handleFinishChange('slate')}
            title="Architectural Slate Grey Finish"
            className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs ${
              finish === 'slate' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600 border border-slate-400"></span>
            <span className="hidden sm:inline">Slate</span>
          </button>
        </div>
      </div>

      {/* Floating Viewpoint Navigation Toolbar (Top Right / Center) */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex items-center gap-2 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl p-1 flex items-center gap-1 text-xs text-white shadow-xl">
          <button
            onClick={() => focusView('suite')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeView === 'suite' ? 'bg-sky-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
            title="Overview View"
          >
            Suite View
          </button>
          <button
            onClick={() => focusView('ewc')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeView === 'ewc' ? 'bg-sky-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
            title="Inspect Toilet"
          >
            EWC
          </button>
          <button
            onClick={() => focusView('basin')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeView === 'basin' ? 'bg-sky-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
            title="Inspect Basin"
          >
            Basin
          </button>
          <button
            onClick={() => focusView('cistern')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeView === 'cistern' ? 'bg-sky-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
            title="Inspect Cistern"
          >
            Cistern
          </button>
        </div>

        {/* Viewport Zoom & Reset Action Buttons */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl p-1 flex items-center gap-1 text-slate-300 shadow-xl">
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
            title="Reset View"
            aria-label="Reset view"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-1.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
            title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            aria-label="Toggle fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Helper Interaction Guide Bar (Bottom Left) */}
      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-20 text-[11px] text-slate-400 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800/80 hidden sm:flex items-center gap-3 shadow-lg pointer-events-none">
        <span className="flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-sky-400" /> Click + Drag to rotate 360°
        </span>
        <span className="text-slate-600">•</span>
        <span>Scroll to zoom</span>
        <span className="text-slate-600">•</span>
        <span className="text-sky-300 font-semibold">Click glowing pins to inspect fixtures</span>
      </div>

      {/* Hotspot Floating Quick Product Inspector Modal */}
      {selectedHotspot && (
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-30 w-80 sm:w-88 bg-slate-900/95 backdrop-blur-xl rounded-2xl p-5 border border-sky-500/40 shadow-2xl animate-in fade-in slide-in-from-bottom duration-300 pointer-events-auto">
          <div className="flex items-start justify-between">
            <span className="text-[10px] font-extrabold text-sky-400 uppercase tracking-widest bg-sky-950/80 border border-sky-500/30 px-2.5 py-0.5 rounded-md">
              {selectedHotspot.category}
            </span>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="text-slate-400 hover:text-white text-xs font-bold p-1 rounded-md hover:bg-slate-800 transition-colors"
              aria-label="Close inspector"
            >
              ✕
            </button>
          </div>

          <h3 className="font-bold text-white text-base mt-2 mb-0.5">
            {selectedHotspot.name}
          </h3>
          <div className="text-xs text-slate-400 mb-2">
            Model: <strong className="text-slate-200 font-mono">{selectedHotspot.code}</strong> • {selectedHotspot.dimensions}
          </div>

          <div className="text-xl font-extrabold text-sky-400 mb-2.5">
            ₹{selectedHotspot.price.toLocaleString('en-IN')}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
            {selectedHotspot.specs}
          </p>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`/products/${selectedHotspot.product.id}`}
              className="px-3 py-2 text-center text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
            >
              View Specs
            </a>
            <button
              onClick={() => {
                openEnquiry({
                  product: selectedHotspot.name,
                  code: selectedHotspot.code,
                  type: '3D Bathroom Studio'
                });
              }}
              className="px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Enquire Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
