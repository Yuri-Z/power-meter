<script lang="ts" setup>
import VPowerMeterTower from '@/components/powerMeter/v-power-meter-tower.vue'
import {usePowerMeter} from '@/composables/use-power-meter.ts'
import {GAME_STATE} from '@/constants/power-meter.constants.ts'
import {computed} from 'vue'

const CONTROLS_TEXT = {
  button: {
    idle: 'Начать',
    playing: 'Удар!',
    loss: 'Новая игра',
    win: 'Новая игра',
    reset: 'Начать',
    'pending-1': '',
    'pending-2': '',
  },
  message: {
    idle: ['Привет!', 'Проверим твою силу!'],
    playing: ['Жми на кнопку', 'в нужный момент!'],
    loss: ['Неплохо!', 'Попробуй ещё раз'],
    win: ['ВОТ ЭТО СИЛА!', 'Ты выбил главный приз!', 'Рубин'],
    reset: ['Начинай, когда', 'приготовишься!'],
    'pending-1': [],
    'pending-2': [],
  }
}

const {currentHeight, gameState, transitionsByUser} = usePowerMeter()

const handleButtonClick = () => transitionsByUser[gameState.value]?.()

const buttonIsVisible = computed(() => {
  switch (gameState.value) {
    case GAME_STATE.PENDING_1:
    case GAME_STATE.PENDING_2:
      return false
    default:
      return true
  }
})
const buttonClass = computed(() => ['pm__button', `pm__button_${gameState.value}`])
const robotClass = computed(() => ['pm__robot', `pm__robot_${gameState.value}`])
</script>

<template>
  <div class="pm">
    <div class="pm__background"/>
    <v-power-meter-tower/>
    <div class="pm__interactive-panel">
      <div class="pm__force-bar">
        <div class="pm__force-bar-background"/>
        <div class="pm__force-bar-scale" :style="{height: `${currentHeight}px`}"/>
        <div class="pm__force-bar-foreground"/>
      </div>
      <div class="pm__controls" v-if="buttonIsVisible">
        <div class="pm__message">
          <div v-for="(line, i) in CONTROLS_TEXT.message[gameState]" :key="i">{{line}}</div>
        </div>
        <button :class="buttonClass" @click="handleButtonClick">{{ CONTROLS_TEXT.button[gameState] }}</button>
      </div>
      <div :class="robotClass" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/power-meter/force-bar";
@use "@/styles/power-meter/controls";
@use "@/styles/power-meter/robot";
.pm {
  position: relative;
  display: flex;
  justify-content: flex-end;
  flex-flow: column;
  width: 360px;
  height: 640px;
  overflow: hidden;
  background: #0B0F71;
  
  &__background {
    position: absolute;
    top: 75px;
    z-index: 0;
    width: 100%;
    height: 100%;
    background-image: url("@/assets/images/bg_top.png");
    background-repeat: no-repeat;
    background-size: contain;
  }
  &__interactive-panel {
    z-index: 10;
    display: flex;
    align-items: end;
    justify-content: space-between;
    margin: 28px 13px;
  }
}
</style>
