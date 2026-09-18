/**
 * The 3D state machine (§4.2). ONE identity object whose sub-systems (core, layers, lattice, network,
 * blocks, satellites, fragments) are always mounted; each section only changes their *weights* and motion.
 * Transitions interpolate by fractional section index — never a hard cut, never a mesh swap.
 *
 * Section → visual metaphor:
 *  Hero            pearl blob, calm                           → identity at rest
 *  About           organic, breathing surface                 → a person, not a product
 *  Specializations core fractures into faceted fragments      → many disciplines from one center
 *  Experience      core flattens into stacked layers          → accumulated, ordered history
 *  QA              precise lattice + verification tick        → structure, checking, correctness
 *  Skills          node network with connecting edges         → interlinked capabilities
 *  Projects        modular blocks assembling as you scroll    → things built from parts
 *  Education       simplified, ascending rings                → foundations rising
 *  Certifications  champagne satellites orbiting              → external recognitions around the core
 *  Contact         returns to calm pearl                      → closure, openness
 */
export type SceneTarget = {
  color: string; accent: string; lightColor: string; lightIntensity: number;
  noise: number;      // surface displacement amplitude
  facet: number;      // flat-shading weight
  coreScale: number;  // core size (shrinks when accents dominate)
  squash: number;     // 1 = sphere, <1 = flattened disc (Experience)
  fragments: number;  // faceted shards orbiting (Specializations)
  layers: number;     // stacked discs (Experience)
  lattice: number;    // wire grid + tick (QA)
  nodes: number;      // network spheres + edges (Skills)
  blocks: number;     // modular cubes (Projects)
  rings: number;      // ascending rings (Education)
  satellites: number; // orbiting glints (Certifications)
  rotSpeed: number; y: number; metal: number; wobble: number;
  rotMode: 'spin' | 'step' | 'still' | 'sway'; // motion signature per section (§4.2 "Motion" column)
  zoom: number;   // camera distance multiplier (closer = intimate, farther = overview)
  tilt: number;   // resting X tilt of the whole identity
  lightPos: [number, number, number];
};
const T = (o: Partial<SceneTarget>): SceneTarget => ({
  color: '#D8CBEA', accent: '#E3C9A3', lightColor: '#FFF6EA', lightIntensity: 1.1,
  noise: 0.15, facet: 0, coreScale: 1, squash: 1, fragments: 0, layers: 0, lattice: 0, nodes: 0, blocks: 0, rings: 0, satellites: 0,
  rotSpeed: 0.12, y: 0, metal: 0.25, wobble: 1, rotMode: 'spin', zoom: 1, tilt: 0, lightPos: [2, 2.5, 2.5], ...o,
});
export const SCENE_TARGETS: SceneTarget[] = [
  T({ color: '#DCD1EA', accent: '#F1E6D2', noise: 0.16 }),                                                                       // Hero
  T({ color: '#F5EFE6', accent: '#E3C9A3', lightColor: '#FFEFD9', noise: 0.5, coreScale: 1.08, rotSpeed: 0.08, wobble: 1.6, rotMode: 'sway', zoom: 0.85, lightPos: [-2, 1.5, 3] }),  // About
  T({ color: '#E3C9A3', accent: '#CDAA74', noise: 0.05, facet: 1, coreScale: 0.55, fragments: 1, rotSpeed: 0.35, zoom: 1.15, lightPos: [3, 3, 1] }),              // Specializations
  T({ color: '#C4B3DB', accent: '#3B2547', lightColor: '#E9DDF5', noise: 0.02, coreScale: 0.9, squash: 0.28, layers: 1, rotSpeed: 0.05, wobble: 0, rotMode: 'still', tilt: 0.55, zoom: 1.05, lightPos: [0, 4, 2] }), // Experience
  T({ color: '#EDE7F4', accent: '#8FB8D8', lightColor: '#E4F0FA', lightIntensity: 1.3, noise: 0, facet: 1, coreScale: 0.42, lattice: 1, rotSpeed: 0.04, wobble: 0, rotMode: 'step', tilt: 0.3, zoom: 1.1, lightPos: [0, 0.5, 4] }), // QA
  T({ color: '#B99CD6', accent: '#DCD1EA', noise: 0.03, coreScale: 0.36, nodes: 1, metal: 0.8, rotSpeed: 0.18, tilt: -0.2, zoom: 1.1, lightPos: [-3, 2, 2] }),               // Skills
  T({ color: '#9A78C2', accent: '#E3C9A3', noise: 0, facet: 1, coreScale: 0.3, blocks: 1, rotSpeed: 0.1, metal: 0.5, wobble: 0, rotMode: 'sway', tilt: 0.35, zoom: 1.15, lightPos: [3, 1, 3] }), // Projects
  T({ color: '#F5EFE6', accent: '#DCD1EA', noise: 0.1, coreScale: 0.7, rings: 1, y: 0.5, rotSpeed: 0.08, tilt: 0.25, zoom: 0.95, lightPos: [0, 5, 1] }),                     // Education
  T({ color: '#EDE7F4', accent: '#CDAA74', lightColor: '#FFF1DC', noise: 0.1, coreScale: 0.85, satellites: 1, rotSpeed: 0.14, zoom: 1.1, lightPos: [2, -1, 3] }), // Certifications
  T({ color: '#DCD1EA', accent: '#F1E6D2', noise: 0.15, rotSpeed: 0.05, zoom: 0.9, rotMode: 'sway' }),                                                        // Contact
];
export function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
