import {ref, watch} from 'vue'
import {TOWER_SEGMENTS_COUNT, GAME_STATE, type tGameState} from '@/constants/power-meter.constants.ts'
import {usePowerMeter} from '@/composables/use-power-meter.ts'
import delay from '@/utils/delay.ts'

const SEGMENT_FILL_DELAY = 150 // задержка между началом анимации у соседних сегментов силомера
const HAMMER_ANIMATION_TIME = 2100 // задержка выполнения кода, чтобы успела пройти анимация удара молотом (время анимации 2200)
const HAMMER_RESET_ANIMATION_TIME = 400
const HAMMER_STATE = {
  IDLE: 'idle',
  HIT: 'hit',
  RESET: 'reset'
} as const

type tHammerState = typeof HAMMER_STATE[keyof typeof HAMMER_STATE]

const {points, gameState, setGameState} = usePowerMeter()

export const usePowerMeterAnimation = () => {
  const currentHammerState = ref<tHammerState>(HAMMER_STATE.IDLE)
  const segmentsLit = ref(Array.from({length: TOWER_SEGMENTS_COUNT}, () => false))
  const summitLit = ref<boolean>(false)

  const animateHammerHit = async () => {
    currentHammerState.value = HAMMER_STATE.HIT
    await delay(HAMMER_ANIMATION_TIME)
    setGameState(GAME_STATE.PENDING_2)
  }
  const animateTowerSegmentsLit = async (points: number) => {
    for (let counter = 0; counter <= points; counter++) {
      segmentsLit.value[counter] = true
      await delay(SEGMENT_FILL_DELAY)
    }
  }
  const sumUpTheGame = async (points: number) => {
    if (points >= TOWER_SEGMENTS_COUNT) {
      summitLit.value = true
      setGameState(GAME_STATE.WIN)
    } else {
      setGameState(GAME_STATE.LOSS)
    }
  }

  const gameReset = (points: null | number) => {
    if (points !== null) return

    segmentsLit.value.fill(false)
    summitLit.value = false
    currentHammerState.value = HAMMER_STATE.RESET
    delay(HAMMER_RESET_ANIMATION_TIME).then(() => {
      if (currentHammerState.value !== HAMMER_STATE.HIT) currentHammerState.value = HAMMER_STATE.IDLE
    })
  }
  const runAnimationQueue = async (gameState: tGameState) => { // run animation queue
    if (gameState !== GAME_STATE.PENDING_1 || points.value === null) return

    await animateHammerHit()

    await animateTowerSegmentsLit(points.value)

    await sumUpTheGame(points.value)
  }

  watch(() => points.value, gameReset)
  watch(() => gameState.value, runAnimationQueue)

  return {currentHammerState, segmentsLit, summitLit}
}
