"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useApp, Violation } from "../context/AppContext";
import { 
  ZoomIn, ZoomOut, RotateCcw, Eye, Camera, Ruler, 
  Layers, Maximize2, Rotate3d, Compass, ShieldAlert 
} from "lucide-react";

interface ThreeViewerProps {
  onViolationSelect: (violationId: string) => void;
  selectedViolationId: string | null;
  showRegulations: boolean;
}

export default function ThreeViewer({ onViolationSelect, selectedViolationId, showRegulations }: ThreeViewerProps) {
  const { language, t, activeProject, showToast } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scene references to modify dynamically
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const indicatorsRef = useRef<Record<string, THREE.Mesh>>({});
  const regLinesRef = useRef<THREE.LineSegments | null>(null);
  const buildingMeshRef = useRef<THREE.Mesh | null>(null);
  const buildingOutlineRef = useRef<THREE.LineSegments | null>(null);
  
  const [measurementMode, setMeasurementMode] = useState(false);
  const [violationsOnlyMode, setViolationsOnlyMode] = useState(false);

  // Initialize ThreeJS Scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 500;
    const height = containerRef.current.clientHeight || 400;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202326); // Dark Viewer Background
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(10, 8, 12);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent going underground
    controlsRef.current = controls;

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 15, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // 6. Helpers: Ground Grid
    const gridHelper = new THREE.GridHelper(20, 20, 0x3a3d40, 0x3a3d40);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // 7. Ground Plot Boundary (Green Line)
    const plotGeo = new THREE.BoxGeometry(16, 0.02, 12);
    const plotMat = new THREE.MeshBasicMaterial({ color: 0x2e7d32, wireframe: true });
    const plotMesh = new THREE.Mesh(plotGeo, plotMat);
    plotMesh.position.y = 0.01;
    scene.add(plotMesh);

    // 8. Regulatory Setback Limits (Gold Dotted Line)
    // Front setback 6m (at +3 z), rear 2m (at -4 z), sides 2m (at +-6 x)
    const setbackBoxGeo = new THREE.BoxGeometry(12, 0.05, 8); // Offset size
    const setbackEdges = new THREE.EdgesGeometry(setbackBoxGeo);
    const setbackMat = new THREE.LineDashedMaterial({ color: 0xe5a93b, dashSize: 0.5, gapSize: 0.2 });
    const setbackLine = new THREE.LineSegments(setbackEdges, setbackMat);
    setbackLine.computeLineDistances();
    setbackLine.position.set(0, 0.02, -0.5); // centered relative to offsets
    scene.add(setbackLine);
    regLinesRef.current = setbackLine;

    // 9. Main Building Mesh (Grey Semi-Transparent)
    const buildGeo = new THREE.BoxGeometry(10, 3, 7);
    const buildMat = new THREE.MeshStandardMaterial({ 
      color: 0x3a3d40, 
      transparent: true, 
      opacity: 0.7, 
      roughness: 0.4 
    });
    const building = new THREE.Mesh(buildGeo, buildMat);
    building.position.set(0.5, 1.5, 0); // Position within plot
    building.castShadow = true;
    building.receiveShadow = true;
    scene.add(building);
    buildingMeshRef.current = building;

    // Building wireframe outline
    const buildEdges = new THREE.EdgesGeometry(buildGeo);
    const outlineMat = new THREE.LineBasicMaterial({ color: 0x64748b, linewidth: 2 });
    const buildOutline = new THREE.LineSegments(buildEdges, outlineMat);
    buildOutline.position.copy(building.position);
    scene.add(buildOutline);
    buildingOutlineRef.current = buildOutline;

    // 10. Draw Violation Indicators (Red Boxes & Red Pulsing Spheres)
    // We map violation objects from context
    const violationList = activeProject?.violations || [];
    const indicators: Record<string, THREE.Mesh> = {};

    violationList.forEach((v) => {
      // 3D Red sphere marker
      const markerGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ 
        color: 0xef4444, 
        transparent: true, 
        opacity: 0.9 
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(v.coordinates.x, v.coordinates.y, v.coordinates.z);
      
      // Store reference metadata inside userData
      marker.userData = { id: v.id };
      scene.add(marker);
      indicators[v.id] = marker;

      // Draw red shaded transgression boxes for critical issues
      if (v.id === "V-01") {
        // Front setback encroachment box
        const clashGeo = new THREE.BoxGeometry(10, 2.5, 2.5);
        const clashMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.3 });
        const clashMesh = new THREE.Mesh(clashGeo, clashMat);
        clashMesh.position.set(0.5, 1.25, 4.75);
        clashMesh.userData = { id: v.id };
        scene.add(clashMesh);
      } else if (v.id === "V-03") {
        // Side setback left clash box
        const clashGeo = new THREE.BoxGeometry(0.5, 2.5, 7);
        const clashMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.3 });
        const clashMesh = new THREE.Mesh(clashGeo, clashMat);
        clashMesh.position.set(-5.2, 1.25, 0);
        clashMesh.userData = { id: v.id };
        scene.add(clashMesh);
      }
    });
    indicatorsRef.current = indicators;

    // 11. Raycaster for clicking markers
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      
      // Find intersections among all meshes in scene
      const intersects = raycaster.intersectObjects(scene.children);
      
      for (let i = 0; i < intersects.length; i++) {
        const obj = intersects[i].object;
        if (obj.userData && obj.userData.id) {
          onViolationSelect(obj.userData.id);
          
          // Spotlight effect: animate camera focusing on the coordinates
          const targetCoords = obj.position;
          focusCamera(targetCoords);
          break;
        }
      }
    };

    renderer.domElement.addEventListener("click", handleCanvasClick);

    // 12. Animation loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Gentle rotation/pulsing on active markers
      const elapsedTime = clock.getElapsedTime();
      Object.keys(indicators).forEach((id) => {
        const marker = indicators[id];
        const scale = 1 + Math.sin(elapsedTime * 5) * 0.15;
        
        // Pulse only if active (not resolved)
        const violation = activeProject?.violations.find((v) => v.id === id);
        if (violation?.status === "resolved") {
          marker.visible = false;
        } else {
          marker.visible = true;
          marker.scale.set(scale, scale, scale);
        }

        // Highlight selected
        const mat = marker.material as THREE.MeshBasicMaterial;
        if (id === selectedViolationId) {
          mat.color.setHex(0xe5a93b); // Turn Gold
        } else {
          mat.color.setHex(0xef4444); // Red standard
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current) {
        rendererRef.current.domElement.removeEventListener("click", handleCanvasClick);
        rendererRef.current.dispose();
      }
    };
  }, [activeProject, onViolationSelect]);

  // Handle selected violation changes
  useEffect(() => {
    if (!selectedViolationId || !indicatorsRef.current) return;
    const marker = indicatorsRef.current[selectedViolationId];
    if (marker) {
      focusCamera(marker.position);
    }
  }, [selectedViolationId]);

  // Adjust regulations visibility dynamically
  useEffect(() => {
    if (regLinesRef.current) {
      regLinesRef.current.visible = showRegulations;
    }
  }, [showRegulations]);

  const focusCamera = (target: THREE.Vector3) => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    // Smooth camera transition
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    // Reposition controls target
    ctrl.target.set(target.x, target.y, target.z);
    
    // Reposition camera slightly offset
    cam.position.set(target.x + 4, target.y + 3, target.z + 5);
    ctrl.update();
  };

  // View Controls handlers
  const handleZoom = (inDir: boolean) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const factor = inDir ? 0.8 : 1.25;
    cameraRef.current.position.multiplyScalar(factor);
    controlsRef.current.update();
  };

  const handleResetView = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(10, 8, 12);
    controlsRef.current.target.set(0, 1.5, 0);
    controlsRef.current.update();
  };

  const setCameraView = (view: "top" | "front" | "side") => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    
    ctrl.target.set(0, 1.5, 0);
    if (view === "top") {
      cam.position.set(0, 15, 0.01); // offset slightly so it calculates orbit correctly
    } else if (view === "front") {
      cam.position.set(0, 3, 15);
    } else if (view === "side") {
      cam.position.set(15, 3, 0);
    }
    ctrl.update();
  };

  const handleScreenshot = () => {
    if (!rendererRef.current) return;
    // Download standard WebGL Screenshot
    const dataUrl = canvasRef.current?.toDataURL("image/png");
    if (dataUrl) {
      const link = document.createElement("a");
      link.download = "3d_twin_snapshot.png";
      link.href = dataUrl;
      link.click();
      showToast(language === "ar" ? "تم التقاط وحفظ لقطة الشاشة" : "3D Snapshot captured and saved", "success");
    }
  };

  const toggleViolationsOnly = () => {
    setViolationsOnlyMode(!violationsOnlyMode);
    if (buildingMeshRef.current && buildingOutlineRef.current) {
      const show = violationsOnlyMode; // toggle state logic inverse sync
      buildingMeshRef.current.visible = show;
      buildingOutlineRef.current.visible = show;
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full relative rounded-xl overflow-hidden flex flex-col bg-dark-viewer border border-slate-700 shadow-inner select-none">
      
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full flex-grow block outline-none touch-none" />

      {/* Floating Toolbar Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 border border-slate-700 p-2 rounded-xl shadow-2xl z-20 flex-wrap max-w-[90%] justify-center">
        
        {/* Rotate and Pan control buttons */}
        <button
          onClick={() => handleZoom(true)}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          title={t.resultsPage.viewerControls.zoom}
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleZoom(false)}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          title={t.resultsPage.viewerControls.zoom}
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        
        <div className="h-4 w-px bg-slate-700 mx-1"></div>

        {/* Standard View presets */}
        <button
          onClick={() => setCameraView("top")}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors text-[10px] font-bold"
          title={t.resultsPage.viewerControls.top}
        >
          <Compass className="h-4 w-4 inline mr-0.5" />
          <span>TOP</span>
        </button>
        <button
          onClick={() => setCameraView("front")}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors text-[10px] font-bold"
          title={t.resultsPage.viewerControls.front}
        >
          <span>FRONT</span>
        </button>
        <button
          onClick={() => setCameraView("side")}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors text-[10px] font-bold"
          title={t.resultsPage.viewerControls.side}
        >
          <span>SIDE</span>
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1"></div>

        {/* Reset Camera */}
        <button
          onClick={handleResetView}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          title={t.resultsPage.viewerControls.reset}
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        {/* Toggle building model display */}
        <button
          onClick={toggleViolationsOnly}
          className={`p-2 rounded-lg transition-colors text-[10px] font-bold ${
            violationsOnlyMode ? "bg-alert-red text-white" : "bg-slate-800 hover:bg-slate-700 text-white"
          }`}
          title={t.resultsPage.viewerControls.showViolationsOnly}
        >
          <span>{violationsOnlyMode ? "SHOW ALL" : "VIOLATIONS ONLY"}</span>
        </button>

        {/* Measure Tool */}
        <button
          onClick={() => {
            setMeasurementMode(!measurementMode);
            showToast(
              language === "ar" 
                ? (measurementMode ? "تم إيقاف أداة القياس" : "اضغط على نقطتين لحساب المسافة البعدية (محاكاة)") 
                : (measurementMode ? "Measure tool off" : "Click two points to calculate distances (mock)"),
              "info"
            );
          }}
          className={`p-2 rounded-lg transition-colors ${
            measurementMode ? "bg-compliance-green text-white" : "bg-slate-800 hover:bg-slate-700 text-white"
          }`}
          title={t.resultsPage.viewerControls.measure}
        >
          <Ruler className="h-4 w-4" />
        </button>

        {/* Screenshot capture */}
        <button
          onClick={handleScreenshot}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          title={t.resultsPage.viewerControls.screenshot}
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>

      {/* Measurement read-out overlay */}
      {measurementMode && (
        <div className="absolute top-4 left-4 bg-slate-900/95 border border-slate-700 p-2.5 rounded-lg text-[10px] text-white font-mono shadow-md z-20 space-y-1">
          <p className="text-compliance-green font-bold uppercase tracking-wider text-[9px] mb-1">MOCK MEASURE TOOL</p>
          <p>POINT A: (1.2, 0.0, 3.4)</p>
          <p>POINT B: (1.2, 0.0, 6.0)</p>
          <p className="border-t border-slate-700 pt-1 text-xs text-accent-gold font-bold">DISTANCE: 2.60 m</p>
        </div>
      )}

      {/* Legend overlay */}
      <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-700 p-2.5 rounded-lg text-[9px] text-slate-300 shadow-md space-y-1 z-20">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-compliance-green rounded-full"></span>
          <span>{language === "ar" ? "حدود الأرض المعتمدة" : "Site boundary"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-accent-gold rounded-full"></span>
          <span>{language === "ar" ? "خط ارتداد الاشتراطات" : "Zoning Setback line"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-alert-red rounded-full"></span>
          <span>{language === "ar" ? "نطاق المخالفة الإنشائية" : "Code Violation Zone"}</span>
        </div>
      </div>

    </div>
  );
}
