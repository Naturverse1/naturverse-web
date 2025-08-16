import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, invalidate } from "@react-three/fiber";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

interface Props {
  reduced: boolean;
  active?: string | null;
  onActiveChange?: (key: string | null) => void;
}

const portalData = [
  {
    key: "naturversity",
    color: "#7dd3fc",
    position: [-1.2, 0.5, 0.8],
    route: "/zones/naturversity",
  },
  {
    key: "music",
    color: "#a78bfa",
    position: [1.3, 0.4, -0.5],
    route: "/zones/music",
  },
  {
    key: "wellness",
    color: "#34d399",
    position: [0.6, 0.5, 1.2],
    route: "/zones/wellness",
  },
  {
    key: "creator",
    color: "#f472b6",
    position: [-0.7, 0.4, -1.2],
    route: "/zones/creator-lab",
  },
];

function Island({ reduced }: { reduced: boolean }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.4, 1);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const vec = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      vec.fromBufferAttribute(pos, i);
      const n = Math.sin(vec.x * 12.9898 + vec.y * 78.233 + vec.z * 37.719) * 43758.5453;
      const offset = (n - Math.floor(n)) * 0.15;
      vec.addScaledVector(vec.normalize(), offset);
      pos.setXYZ(i, vec.x, vec.y, vec.z);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (reduced) return;
    mesh.current.rotation.y += 0.08 * delta;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
  });

  return (
    <mesh ref={mesh} geometry={geometry} position={[0, 0, 0]}>
      <meshStandardMaterial color="#93c5fd" metalness={0} roughness={0.9} />
    </mesh>
  );
}

function Trees() {
  const group = useRef<THREE.Group>(null!);
  const positions = useMemo(() => [
    [0.8, 0.7, 0.2],
    [-0.6, 0.6, -0.4],
    [0.2, 0.8, -0.5],
    [-0.3, 0.7, 0.6],
    [0.4, 0.6, 0.5],
  ], []);
  return (
    <group ref={group}>
      {positions.map((p, i) => {
        const color = i % 2 === 0 ? "#34d399" : "#38d9a9";
        return (
          <group key={i} position={p as any}>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.05, 0.06, 0.4, 6]} />
              <meshStandardMaterial color="#92400e" />
            </mesh>
            <mesh position={[0, 0.55, 0]}>
              <coneGeometry args={[0.25, 0.6, 6]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Water() {
  return (
    <mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[3, 40]} />
      <meshBasicMaterial color="#0ea5e9" transparent opacity={0.15} />
    </mesh>
  );
}

function Portal({ data, active, reduced, onActive }: { data: any; active: boolean; reduced: boolean; onActive: (key: string | null) => void; }) {
  const ref = useRef<THREE.Mesh>(null!);
  const navigate = useNavigate();
  useFrame(() => {
    if (ref.current) {
      const target = active ? 1.08 : 1;
      ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, target, 0.1));
    }
  });
  return (
    <mesh
      ref={ref}
      position={data.position as any}
      onPointerOver={(e) => { e.stopPropagation(); onActive(data.key); if (reduced) invalidate(); }}
      onPointerOut={(e) => { e.stopPropagation(); onActive(null); if (reduced) invalidate(); }}
      onClick={(e) => { e.stopPropagation(); navigate(data.route); }}
    >
      <torusGeometry args={[0.3, 0.02, 8, 24]} />
      <meshStandardMaterial color={data.color} />
    </mesh>
  );
}

export default function IslandHub3D({ reduced, active, onActiveChange }: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 2.2, 5], fov: 50 }}
      frameloop={reduced ? "demand" : "always"}
    >
      <ambientLight intensity={0.5} />
      <hemisphereLight intensity={0.7} />
      <directionalLight intensity={0.8} position={[5, 5, 5]} />
      <Island reduced={reduced} />
      <Water />
      <Trees />
      {portalData.map((p) => (
        <Portal
          key={p.key}
          data={p}
          active={active === p.key}
          reduced={reduced}
          onActive={(k) => onActiveChange?.(k)}
        />
      ))}
    </Canvas>
  );
}
