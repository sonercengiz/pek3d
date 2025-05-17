// src/PreviewModelProvider.tsx
import React, {
  createContext,
  useRef,
  useEffect,
  ReactNode,
  CSSProperties,
} from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export interface PreviewModelContextValue {
  register: (
    el: HTMLElement,
    setupScene: (
      scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      controls: OrbitControls
    ) => void
  ) => number
  unregister: (id: number) => void
}

export const PreviewModelContext = createContext<PreviewModelContextValue>({
  register: () => 0,
  unregister: () => { }
})

interface PreviewModelProviderProps {
  children: ReactNode
  /** İsteğe bağlı olarak FPS’i dışardan kontrol etmek için */
  fps?: number
}

interface SceneEntry {
  el: HTMLElement
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  controls: OrbitControls
}

export const PreviewModelProvider: React.FC<PreviewModelProviderProps> = ({
  children,
  fps = 30
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scenesRef = useRef<SceneEntry[]>([])

  const register = (
    el: HTMLElement,
    setupScene: (
      scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      controls: OrbitControls
    ) => void
  ): number => {
    // 1) Yeni sahne + kamera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000)
    camera.position.set(0, 0, 5)

    // 2) Kontrolleri oluştur
    const controls = new OrbitControls(camera, el)
    controls.enablePan = false
    controls.enableZoom = false
    controls.minDistance = 1
    controls.maxDistance = 20

    // 3) Kullanıcı sahneyi doldursun (örn. model + autofit kodu)
    setupScene(scene, camera, controls)

    // 4) Varsayılan aydınlatma
    scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444, 3))
    const dl = new THREE.DirectionalLight(0xffffff, 5)
    dl.position.set(1, 1, 1)
    scene.add(dl)

    // 5) Kaydet ve bir id döndür
    const id = scenesRef.current.length
    scenesRef.current.push({ el, scene, camera, controls })
    return id
  }

  const unregister = (id: number) => {
    const entry = scenesRef.current[id]
    if (!entry) return
    entry.controls.dispose()
    scenesRef.current.splice(id, 1)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // WebGLRenderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'low-power'
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0, 0)

    let frameId: number
    let lastTime = 0
    const interval = 1000 / fps

    const renderLoop = (time = 0) => {
      frameId = requestAnimationFrame(renderLoop)

      // FPS throttling
      const delta = time - lastTime
      if (delta < interval) return
      lastTime = time - (delta % interval)

      // sayfa gizliyse veya sahne yoksa çizme
      if (document.hidden || scenesRef.current.length === 0) return

      // resize ihtiyacı varsa güncelle
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (canvas.width !== w || canvas.height !== h) {
        renderer.setSize(w, h, false)
      }

      renderer.clear()
      renderer.setScissorTest(true)
      const canvasRect = canvas.getBoundingClientRect()

      scenesRef.current.forEach(({ el, scene, camera }) => {
        const rect = el.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) return

        // camera aspect
        camera.aspect = rect.width / rect.height
        camera.updateProjectionMatrix()

        // bütün modeli döndür
        const t = time * 0.001
        const root = scene.userData.modelRoot as THREE.Object3D | undefined
        if (root) root.rotation.y = t

        // scissor & viewport
        const x = rect.left - canvasRect.left
        const y = rect.top - canvasRect.top
        const w2 = rect.width
        const h2 = rect.height

        renderer.setViewport(
          x,
          canvasRect.height - y - h2,
          w2,
          h2
        )
        renderer.setScissor(
          x,
          canvasRect.height - y - h2,
          w2,
          h2
        )
        renderer.render(scene, camera)
      })
    }

    renderLoop()

    return () => {
      cancelAnimationFrame(frameId)
      renderer.dispose()
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
    }
  }, [fps])

  return (
    <PreviewModelContext.Provider value={{ register, unregister }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
      {children}
    </PreviewModelContext.Provider>
  )
}
