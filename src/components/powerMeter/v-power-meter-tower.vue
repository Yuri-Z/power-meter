<script lang="ts" setup>
import {TOWER_SEGMENTS_COUNT} from '@/constants/power-meter.constants.ts'
import {usePowerMeter} from '@/composables/use-power-meter.ts'
import {usePowerMeterAnimation} from '@/composables/use-power-meter-animation.ts'
import {computed} from 'vue'

const {gameState} = usePowerMeter()
const {currentHammerState, segmentsLit, summitLit} = usePowerMeterAnimation()

const segments = computed(() => [...Array(TOWER_SEGMENTS_COUNT).keys()].reverse())

</script>

<template>
  <div class="pm__tower">
    <div class="pm__tower-inner">
      <div class="pm__tower-summit" :class="{'pm__tower-summit_active': summitLit}">
        <div class="pm__tower-summit-crown" :class="{'pm__tower-summit-crown_active': summitLit}"/>
      </div>
      
      <div v-for="index in segments" :class="[
        'pm__tower-segment',
        `pm__tower-segment-${index}`,
        {[`pm__tower-segment-${index}_active`]: segmentsLit[index]}
      ]"/>
    </div>
  </div>
  <div :class="[`pm__striking-pad_${gameState}`]" class="pm__striking-pad"/>
  <div :class="['pm__hammer', `pm__hammer_${currentHammerState}`]" />
</template>

<style lang="scss" scoped>
@use "@/styles/power-meter/tower-segments";
@use "@/styles/power-meter/tower-summit";
@use "@/styles/power-meter/hammer";
.pm__tower {
  position: absolute;
  top: 92px;
  left: 50%;
  width: 170px;
  height: 324px;
  background-image: url("@/assets/images/measure_main.png");
  background-repeat: no-repeat;
  background-size: contain;
  transform: translate(-50%, 0);
  
  &-inner {
    position: absolute;
    bottom: 8px;
    left: 50%;
    width: 74px;
    transform: translate(-50%, 0);
  }
}
</style>
