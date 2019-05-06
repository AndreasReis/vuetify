import './VTimePickerTitle.sass'

// Utils
import { pad } from '../VDatePicker/util'
import { genPickerButton } from '../VPicker'

import { PropValidator } from 'vue/types/options'
import Vue, { VNode } from 'vue'
import { Time, SelectMode } from './VTime'

export default Vue.extend({
  name: 'v-time-picker-title',

  inheritAttrs: false,

  props: {
    isAmPm: Boolean,
    disabled: Boolean,
    period: {
      type: String,
      validator: period => period === 'am' || period === 'pm'
    } as PropValidator<'am' | 'pm'>,
    readonly: Boolean,
    useSeconds: Boolean,
    selectMode: Number as PropValidator<SelectMode>,
    time: Object as PropValidator<Time>
  },

  methods: {
    genTime () {
      let hour = this.time ? this.time.hour : null
      if (hour != null && this.isAmPm) {
        hour = (hour - 1) % 12 + 1
      }

      const displayedHour = hour == null ? '--' : this.isAmPm ? String(hour) : pad(hour)
      const displayedMinute = this.time && this.time.minute != null ? pad(this.time.minute) : '--'
      const titleContent = [
        genPickerButton(
          this.$createElement,
          displayedHour,
          () => this.$emit('update:selectMode', SelectMode.Hour),
          this.selectMode === SelectMode.Hour,
          this.disabled
        ),
        this.$createElement('span', ':'),
        genPickerButton(
          this.$createElement,
          displayedMinute,
          () => this.$emit('update:selectMode', SelectMode.Minute),
          this.selectMode === SelectMode.Minute,
          this.disabled
        )
      ]

      if (this.useSeconds) {
        const displayedSecond = this.time.second == null ? '--' : pad(this.time.second)
        titleContent.push(this.$createElement('span', ':'))
        titleContent.push(genPickerButton(
          this.$createElement,
          displayedSecond,
          () => this.$emit('update:selectMode', SelectMode.Second),
          this.selectMode === SelectMode.Second,
          this.disabled
        ))
      }
      return this.$createElement('div', {
        'class': 'v-time-picker-title__time'
      }, titleContent)
    },
    genAmPm () {
      return this.$createElement('div', {
        staticClass: 'v-time-picker-title__ampm'
      }, [
        genPickerButton(
          this.$createElement,
          'AM',
          () => this.$emit('update:period', 'am'),
          this.period === 'am',
          this.disabled || this.readonly
        ),
        genPickerButton(
          this.$createElement,
          'PM',
          () => this.$emit('update:period', 'pm'),
          this.period === 'pm',
          this.disabled || this.readonly
        )
      ])
    }
  },

  render (h): VNode {
    const children = [this.genTime()]

    this.isAmPm && children.push(this.genAmPm())

    return h('div', {
      staticClass: 'v-time-picker-title'
    }, children)
  }
})
