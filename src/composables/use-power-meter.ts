import {ref} from 'vue'
import getRandomInt from '@/utils/get-random-int.ts'
import {GAME_STATE} from '@/constants/power-meter.constants.ts'
import type {tGameState} from '@/constants/power-meter.constants.ts'

const MAX_SCALE_HEIGHT = 144 // общая высота шкалы силы в пикселях
const MIN_SCALE_HEIGHT = 0
const POINT_COST = 18 // высота одного деления шкалы силы в пикселях
const MIN_TIME = 250 // минимальное время заполнения/опустошения шкалы силы
const MAX_TIME = 1500 // максимальное время заполнения/опустошения шкалы силы

const gameState = ref<tGameState>(GAME_STATE.IDLE)
const points = ref<number | null>(null)
const currentHeight = ref<number>(0)
export const usePowerMeter = () => {
  let direction: 1 | -1 = 1
  let timeToCharge = getRandomInt(MIN_TIME, MAX_TIME) // случайно выбранное время заполнения/опустошения шкалы силы
  let speed = MAX_SCALE_HEIGHT / timeToCharge
  let rafId: number | null = null
  let lastTime: number | null = null

  const setGameState = (state: tGameState) => {
    gameState.value = state
  }

  const loopedFluctuation = (now: number): void => {
    if (lastTime === null) lastTime = now

    const deltaTime = now - lastTime
    lastTime = now

    const uncroppedHeight = currentHeight.value + direction * speed * deltaTime

    if (uncroppedHeight >= MAX_SCALE_HEIGHT || uncroppedHeight <= MIN_SCALE_HEIGHT) {
      direction = -direction as 1|-1
      currentHeight.value = Math.min(Math.max(uncroppedHeight, MIN_SCALE_HEIGHT), MAX_SCALE_HEIGHT)

      timeToCharge = getRandomInt(MIN_TIME, MAX_TIME)
      speed = MAX_SCALE_HEIGHT / timeToCharge
    } else {
      currentHeight.value = uncroppedHeight
    }

    rafId = requestAnimationFrame(loopedFluctuation)
  }

  const toPlaying = (): void => {
    rafId = requestAnimationFrame(loopedFluctuation)

    setGameState(GAME_STATE.PLAYING)
  }
  const toPending = (): void => {
    if (rafId) cancelAnimationFrame(rafId)

    points.value = Math.floor(currentHeight.value / POINT_COST)
    lastTime = null

    setGameState(GAME_STATE.PENDING_1)
  }
  const toReset = (): void => {
    direction = 1
    timeToCharge = getRandomInt(MIN_TIME, MAX_TIME)
    speed = MAX_SCALE_HEIGHT / timeToCharge
    currentHeight.value = 0
    points.value = null

    setGameState(GAME_STATE.RESET)
  }

  const transitionsByUser: Record<tGameState, () => void> = {
    idle: toPlaying,
    reset: toPlaying,
    playing: toPending,
    'pending-1': () => {},
    'pending-2': () => {},
    win: toReset,
    loss: toReset
  }

  return {
    transitionsByUser,
    currentHeight,
    points,
    gameState,
    setGameState
  }
}
