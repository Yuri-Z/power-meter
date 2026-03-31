export const TOWER_SEGMENTS_COUNT = 7 // количество сегментов у башни-силомера (не считая вершины с рубином)

export const GAME_STATE = {
  IDLE: 'idle',
  PLAYING: 'playing',
  PENDING_1: 'pending-1', // анимация удара
  PENDING_2: 'pending-2', // анимация "набора очков" после удара
  WIN: 'win',
  LOSS: 'loss',
  RESET: 'reset'
} as const

export type tGameState = typeof GAME_STATE[keyof typeof GAME_STATE]
