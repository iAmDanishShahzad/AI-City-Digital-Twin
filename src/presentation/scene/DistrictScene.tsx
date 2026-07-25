import { Html, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import type {
  DistrictProjection,
  ProjectedLandmark,
  ProjectedRoad,
} from '../projection/district-projection';
import styles from './DistrictScene.module.css';

const groundSize = 48;
const groundY = -0.06;
const groundCenter: readonly [number, number, number] = [18, groundY, -5];
const gridDivisions = 18;
const roadHeight = 0.12;
const roadY = 0.02;
const markerRadius = 0.52;
const markerHeight = 0.28;
const markerY = 0.14;
const landmarkWidth = 3.4;
const landmarkDepth = 2.8;
const labelY = 0.7;
const landmarkLabelPadding = 0.5;
const orbitTarget: readonly [number, number, number] = [18, 0, -5];
const cameraPosition: readonly [number, number, number] = [18, 52, -5];
const cameraUp: readonly [number, number, number] = [0, 0, -1];
const cameraFieldOfView = 42;
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
          up: cameraUp,
          fov: cameraFieldOfView,
          near: cameraNear,
          far: cameraFar,
        }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <StaticDistrictScene projection={projection} />
      </Canvas>
      <aside className={styles.legend} aria-label="Road hierarchy">
        <span className={styles.primaryRoad}>Primary corridor</span>
        <span className={styles.secondaryRoad}>Alternative streets</span>
      </aside>
    </section>
  );
}

export function StaticDistrictScene({ projection }: DistrictSceneProps) {
  return (
    <>
      <color attach="background" args={['#dbeafe']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[18, 28, 14]} intensity={1.2} />
      <mesh position={groundCenter} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[groundSize, groundSize]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      <gridHelper
        args={[groundSize, gridDivisions, '#94a3b8', '#cbd5e1']}
        position={groundCenter}
      />

      {projection.roads.map((road) => (
        <RoadMesh key={road.id} road={road} />
      ))}

      {projection.intersections.map((intersection) => (
        <group key={intersection.id}>
          <mesh
            position={[
              intersection.position.x,
              markerY + intersection.position.y,
              intersection.position.z,
            ]}
          >
            <cylinderGeometry args={[markerRadius, markerRadius, markerHeight, 20]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <Html
            center
            position={[
              intersection.position.x,
              intersection.position.y + labelY,
              intersection.position.z,
            ]}
          >
            <span className={styles.nodeLabel}>{intersection.label}</span>
          </Html>
        </group>
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
      <meshStandardMaterial color={road.category === 'primary' ? '#1e3a5f' : '#0f766e'} />
    </mesh>
  );
}

type LandmarkBlockProps = {
  readonly landmark: ProjectedLandmark;
};

function LandmarkBlock({ landmark }: LandmarkBlockProps) {
  return (
    <group>
      <mesh
        position={[
          landmark.position.x,
          landmark.position.y + landmark.height / 2,
          landmark.position.z,
        ]}
      >
        <boxGeometry args={[landmarkWidth, landmark.height, landmarkDepth]} />
        <meshStandardMaterial color={landmark.color} />
      </mesh>
      <Html
        center
        position={[
          landmark.position.x,
          landmark.position.y + landmark.height + landmarkLabelPadding,
          landmark.position.z,
        ]}
      >
        <span className={styles.landmarkLabel}>{landmark.label}</span>
      </Html>
    </group>
  );
}
