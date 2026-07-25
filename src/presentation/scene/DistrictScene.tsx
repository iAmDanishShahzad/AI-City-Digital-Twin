import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import type {
  DistrictProjection,
  ProjectedLandmark,
  ProjectedRoad,
} from '../projection/district-projection';
import styles from './DistrictScene.module.css';

const groundSize = 72;
const groundY = -0.06;
const roadHeight = 0.08;
const roadY = 0.02;
const markerRadius = 0.38;
const markerHeight = 0.22;
const markerY = 0.11;
const landmarkWidth = 3.4;
const landmarkDepth = 2.8;
const orbitTarget: readonly [number, number, number] = [18, 0, 0];
const cameraPosition: readonly [number, number, number] = [38, 34, 44];
const cameraFieldOfView = 44;
const cameraNear = 0.1;
const cameraFar = 160;

type DistrictSceneProps = {
  readonly projection: DistrictProjection;
};

export function DistrictScene({ projection }: DistrictSceneProps) {
  return (
    <section className={styles.scene} aria-label={`${projection.label} district scene`}>
      <Canvas
        camera={{
          position: cameraPosition,
          fov: cameraFieldOfView,
          near: cameraNear,
          far: cameraFar,
        }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <StaticDistrictScene projection={projection} />
      </Canvas>
    </section>
  );
}

export function StaticDistrictScene({ projection }: DistrictSceneProps) {
  return (
    <>
      <color attach="background" args={['#dbeafe']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[18, 28, 14]} intensity={1.2} />
      <mesh position={[18, groundY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[groundSize, groundSize]} />
        <meshStandardMaterial color="#bfd3c1" />
      </mesh>

      {projection.roads.map((road) => (
        <RoadMesh key={road.id} road={road} />
      ))}

      {projection.intersections.map((intersection) => (
        <mesh
          key={intersection.id}
          position={[
            intersection.position.x,
            markerY + intersection.position.y,
            intersection.position.z,
          ]}
        >
          <cylinderGeometry args={[markerRadius, markerRadius, markerHeight, 20]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      ))}

      {projection.landmarks.map((landmark) => (
        <LandmarkBlock key={landmark.id} landmark={landmark} />
      ))}

      <OrbitControls target={orbitTarget} minDistance={20} maxDistance={86} />
    </>
  );
}

type RoadMeshProps = {
  readonly road: ProjectedRoad;
};

function RoadMesh({ road }: RoadMeshProps) {
  return (
    <mesh
      position={[road.center.x, road.center.y + roadY, road.center.z]}
      rotation={[0, -road.rotationY, 0]}
    >
      <boxGeometry args={[road.length, roadHeight, road.width]} />
      <meshStandardMaterial color="#334155" />
    </mesh>
  );
}

type LandmarkBlockProps = {
  readonly landmark: ProjectedLandmark;
};

function LandmarkBlock({ landmark }: LandmarkBlockProps) {
  return (
    <mesh
      position={[
        landmark.position.x,
        landmark.position.y + landmark.height / 2,
        landmark.position.z,
      ]}
    >
      <boxGeometry args={[landmarkWidth, landmark.height, landmarkDepth]} />
      <meshStandardMaterial color="#d97706" />
    </mesh>
  );
}
