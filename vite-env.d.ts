/// <reference types="vite/client" />

// Importa i tipi da R3F
import { ThreeElements } from '@react-three/fiber'

// Estensione per React 18 (Global JSX)
declare global {
    namespace JSX {
        interface IntrinsicElements extends ThreeElements { }
    }
}

// Estensione di sicurezza per React 19+ (React.JSX)
// Questo risolve il problema se @types/react v19 è ancora presente
declare module 'react' {
    namespace JSX {
        interface IntrinsicElements extends ThreeElements { }
    }
}