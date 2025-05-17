import * as THREE from 'three';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, MeshReflectorMaterial } from '@react-three/drei';
import { Suspense } from 'react';

// Fayans zemin bileşeni
export const Floor = () => {
  // Fayans dokusunu yükleyin (dosya yolunu kendi projenizdeki yol ile değiştirin)
  const tileTexture = useLoader(THREE.TextureLoader, '/textures/floor.jpg');

  // Tekrarlama ayarlarını yapın
  tileTexture.wrapS = tileTexture.wrapT = THREE.RepeatWrapping;
  tileTexture.repeat.set(100, 100); // İstediğiniz değerleri ayarlayabilirsiniz

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[500, 500]} />
      <MeshReflectorMaterial
        // Dokuyu malzemenin diffuse (renk) haritası olarak kullanıyoruz
        map={tileTexture}
        blur={[300, 100]}          // Yansımanın bulanıklığı
        resolution={1024}          // Yansıma dokusunun çözünürlüğü
        mixBlur={1}                // Blur karışım gücü
        mixStrength={2}            // Yansımaların yoğunluğu
        depthScale={1}             // Derinlik ölçeği
        minDepthThreshold={0.4}    // Minimum derinlik eşik değeri
        maxDepthThreshold={1.25}   // Maksimum derinlik eşik değeri
        color="#888"               // Genel zemin rengi (tile dokusuyla karışacak)
        metalness={0.5}            // Metalik parlaklık
        roughness={1}              // Yüzey pürüzlülüğü
      />
    </mesh>
  );
};