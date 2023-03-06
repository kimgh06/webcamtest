import React, { useState, useRef, Suspense, useEffect } from "react";
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; //3D 모델 불러오기 위한 로더
import * as THREE from 'three'; //three.js 불러오기
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import './Three.scss';
// import { BufferAttribute, BufferGeometry } from "three";

function Three() {
  const camposi = {
    position: [4, 7, -4],
  };
  return <div className="Three">
    <Canvas id="canvas" shadows={true} camera={camposi}>
      <ambientLight intensity={0.2} />
      <Suspense fallback={null}>
        <OrbitControls autoRotate={false} />
        <Box position={[0, 0, 3]} />
        <Box position={[3, 0, 0]} />
        <Platform position={[0, -1, 0]} />
        <Icosahedron />
        <Sun position={[-2, 5, -2]} />
        <axesHelper args={[5]} />
        <Tree position={[-6, 0, 6]} />
        <MovingOb />
      </Suspense>
    </Canvas>
  </div>;
}

function MovingOb(props) {
  const mesh = useRef(null);
  const [jump, setJump] = useState(0);
  const [isjump, setIsjump] = useState(false);
  const [x, setX] = useState(0);
  const [z, setZ] = useState(0);
  useFrame(e => {
    if (isjump) {
      setJump(e => Math.sin(mesh.current.position.y - 50));
      console.log(Math.asin(jump) * 180 / Math.PI);
    }
    else {
      setJump(e => Math.sin(0));
    }
  });
  function moveob(key) {
    const distance = 0.1;
    if (key === 'ArrowUp') {
      setZ(e => e - distance);
    }
    else if (key === 'ArrowDown') {
      setZ(e => e + distance);
    }
    else if (key === 'ArrowLeft') {
      setX(e => e - distance);
    }
    else if (key === 'ArrowRight') {
      setX(e => e + distance);
    }
    else if (key === ' ') {
      setIsjump(true);
      setTimeout(() => {
        setIsjump(false);
      }, 300); // 18프레임
    }
  }
  const movecam = e => {
    const mesh = new THREE.Mesh();
    mesh.lookAt([0, 0, 0]);
  };
  useEffect(e => {
    window.addEventListener('keydown', e => {
      moveob(e.key);
      movecam();
    });
    // eslint-disable-next-line
  }, []);
  return <mesh ref={mesh}
    position={[-2 + x, 0 + jump, -2 + z]}
    castShadow receiveShadow >
    <boxBufferGeometry args={[0.5, 1, 0.5]} />
    <meshStandardMaterial color={'blue'} />
  </mesh>;
}

function Tree(props) {
  const mesh = useRef(null);
  const x = props.position[0];
  const y = props.position[1];
  const z = props.position[2];
  return <mesh
    ref={mesh}
    receiveShadow
  >
    <ambientLight intensity={1} />
    <boxGeometry args={[1, 1, 1]} />
    <NoBox position={[x, y, z]} color={'brown'} />
    <NoBox position={[x, y + 1, z]} color={'brown'} />
    <NoBox position={[x, y + 2, z]} color={'brown'} />
    <NoBox position={[x, y + 3, z]} color={'brown'} />
    <NoBox position={[x, y + 5, z]} opacity={0.7} color={'darkgreen'} />
    <NoBox position={[x + 1, y + 3, z]} opacity={0.7} color={'darkgreen'} />
    <NoBox position={[x + 1, y + 4, z]} opacity={0.7} color={'darkgreen'} />
    <NoBox position={[x - 1, y + 3, z]} opacity={0.7} color={'darkgreen'} />
    <NoBox position={[x - 1, y + 4, z]} opacity={0.7} color={'darkgreen'} />
    <NoBox position={[x, y + 3, z + 1]} opacity={0.7} color={'darkgreen'} />
    <NoBox position={[x, y + 4, z + 1]} opacity={0.7} color={'darkgreen'} />
    <NoBox position={[x, y + 3, z - 1]} opacity={0.7} color={'darkgreen'} />
    <NoBox position={[x, y + 4, z - 1]} opacity={0.7} color={'darkgreen'} />
  </mesh>;
}

function NoBox(props) {
  return <mesh
    position={props.position}
  >
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial opacity={props.opacity} transparent color={props.color} />
  </mesh>;
}

function Platform(props) {
  const mesh = useRef(null);
  return <mesh
    ref={mesh}
    castShadow
    receiveShadow
    {...props}
  >
    <boxGeometry args={[15, 1, 15]} />
    <meshStandardMaterial color={'darkgreen'} />
  </mesh>;
}

function Icosahedron() {
  const mesh = useRef(null);
  useFrame(e => mesh.current.rotation.x = mesh.current.rotation.z += 0.01);
  const radius = 1;
  const detail = 1;
  const geometry = new THREE.IcosahedronGeometry(radius, detail);
  return (
    <mesh geometry={geometry}
      ref={mesh}
      position={[0, 2, 0]}
      castShadow
      receiveShadow>
      <meshStandardMaterial wireframe color={"blueviolet"} />
    </mesh>
  );
}

const Sun = props => {
  return (
    <mesh {...props}>
      <pointLight castShadow />
      <sphereBufferGeometry args={[0.3]} />
      <meshPhongMaterial emissive="darkyellow" />
    </mesh>
  );
};

function Box(props) {
  const mesh = useRef(null);
  useFrame(e => mesh.current.rotation.y = mesh.current.rotation.z += 0.01);
  const [modo, setModo] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [act, setAct] = useState(false);
  return <mesh
    ref={mesh}
    scale={act ? 1.5 : 1}
    {...props}
    onPointerOver={e => setHovered(true)}
    onPointerOut={e => setHovered(false)}
    onClick={e => setAct(e => !e)}
    onPointerDown={e => setModo(true)}
    onPointerUp={e => setModo(false)}
    castShadow
    receiveShadow
  >
    <ambientLight intensity={1} />
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial attach={'material'} color={modo ? 'hotpink' : hovered ? 'orange' : 'gray'} />
  </mesh>;
}

export default Three;