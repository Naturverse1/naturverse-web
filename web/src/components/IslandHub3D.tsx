import React, { Suspense, useEffect, useState } from "react";

const ClientScene: React.FC = () => {
  const [SceneImpl, setSceneImpl] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // Lazy load three + fiber only in the browser
      const [{ Canvas }, THREE, { OrbitControls }] = await Promise.all([
        import("@react-three/fiber"),
        import("three"),
        import("@react-three/drei"),
      ]);

      const Scene: React.FC = () => (
        <Canvas
          camera={{ position: [3, 2, 5], fov: 50 }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 6, 2]} intensity={1} />
          {/* a tiny “island” made of simple primitives so bundle stays small */}
          <mesh rotation={[-0.3, 0.4, 0]}>
            <icosahedronGeometry args={[1.2, 1]} />
            <meshStandardMaterial color={"#79d28b"} roughness={0.8} />
          </mesh>
          <mesh position={[0, -1.2, 0]}>
            <cylinderGeometry args={[1.3, 1.4, 0.4, 24]} />
            <meshStandardMaterial color={"#8b5e3c"} />
          </mesh>
          <Suspense>
            <OrbitControls enablePan={false} enableZoom={false} />
          </Suspense>
        </Canvas>
      );

      if (mounted) setSceneImpl(() => Scene);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!SceneImpl) return <div style={{ width: "100%", height: 360 }} />;
  return <SceneImpl />;
};

const IslandHub3D: React.FC = () => {
  // ensure a fixed height region
  return (
    <div
      style={{
        width: "100%",
        height: 360,
        borderRadius: 16,
        overflow: "hidden",
        background:
          "radial-gradient(1000px 600px at 10% -10%, rgba(251, 241, 146, 0.06), transparent 60%), radial-gradient(900px 700px at 110% 0%, rgba(36, 180, 70, 0.08), transparent 55%), linear-gradient(108deg, #0b1028, #101a38 55%)",
        boxShadow: "0 20px 60px rgba(0,0,0,.25)",
      }}
    >
      <Suspense fallback={<div style={{ width: "100%", height: 360 }} />}>
        <ClientScene />
      </Suspense>
    </div>
  );
};

export default IslandHub3D;
