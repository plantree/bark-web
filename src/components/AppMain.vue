<template>
  <main class="text-left">
    <h1 class="py-5 text-center text-3xl font-bold">Send notifications to your iPhone easily from now.</h1>
    <div class="w-3/4 md:w-1/2 mx-auto">

      <!-----------Form------------>
      <div class="form">
        <div v-show="showCache">
          <div class="form-bg-success form-color-success rounded py-2 px-3 my-4">
            <p>Restore from cache. <span @click="clearCache" class="underline hover:cursor-pointer">Clear?</span></p>
            <p class="mt-2" v-if="clearStatus">Clear cache successfully. Please refresh the page.</p>
          </div>
        </div>
        <FormKit type="form" @submit="sendNotification">

          <FormKit type="url" v-model="form.server" label="Server URL" placeholder="https://api.day.app/"
            help="Public server or your private server" validation="url" />

          <FormKit type="text" v-model="form.device" label="Register Device (Required)" placeholder="Device code"
            validation="required|length:22" />

          <FormKit type="text" label="Title" placeholder="WeBark" v-model="form.title" />
          <FormKit type="textarea" label="Body (Required)"  v-model="form.body" validation="required" />

          <FormKit type="checkbox" label="Schedule time" v-model="hasSchedule" />
          <FormKit v-if="hasSchedule" type="datetime-local" v-model="form.scheduleTime" name="Schedule time"
            validation="required|date_after" validation-visibility="live" />

          <FormKit type="checkbox" label="Level" v-model="hasLevel" />
          <FormKit v-if="hasLevel" v-model="form.level" type="select" :options="{
            active: 'active',
            timeSensitive: 'timeSensitive',
            passive: 'passive'
          }" />

          <FormKit type="checkbox" label="Badge" v-model="hasBadge" />
          <FormKit v-if="hasBadge" v-model="form.badge" type="number" />

          <FormKit type="checkbox" label="Group" v-model="hasGroup" />
          <FormKit v-if="hasGroup" v-model="form.group" type="text" />

          <FormKit type="checkbox" label="Icon" v-model="hasIcon" />
          <FormKit v-if="hasIcon" v-model="form.icon" type="url" validation="url"
            placeholder="e.g. https://example.com" />

          <FormKit type="checkbox" label="Text to copy" v-model="hasCopy" />
          <FormKit v-if="hasCopy" v-model="form.copy" type="text" />

          <FormKit type="checkbox" label="URL to open" v-model="hasUrl" />
          <FormKit v-if="hasUrl" v-model="form.url" type="url" validation="url"
            placeholder="e.g. https://example.com" />
        </FormKit>
        <div v-show="showSchedule">
          <div class="bg-gray-400/75 rounded form-radius-input form-text form-mb-gutter py-2 px-3 mt-4">
            <p>Time remains to send notification:</p>
            <p>{{ timeRemains }}</p>
          </div>
        </div>
        <div v-show="showStatus">
          <div v-if="status"
            class="form-bg-success form-color-success rounded form-radius-input form-text form-mb-gutter py-2 px-3 mt-4">
            Send notification successfully.
          </div>
          <div v-else
            class="form-bg-danger form-color-danger rounded form-radius-input form-text form-mb-gutter py-2 px-3 mt-4">
            Send notification failed.
          </div>
        </div>
      </div>
      <!-----------/Form------------>
    </div>
  </main>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import axios from 'axios'

function prepareData(self) {
  let formData = self.form
  let device = formData['device']
  let title = formData['title']
  let body = formData['body']
  let level = formData['level']
  let badge = formData['badge']
  let group = formData['group']
  let icon = formData['icon']
  let copy = formData['copy']
  let url = formData['url']
  // request data
  let requestData = {
    title: title,
    body: body,
    device_key: device
  }
  if (self.hasLevel) {
    requestData['level'] = level
  }
  if (self.hasBadge) {
    requestData['badge'] = badge
  }
  if (self.hasGroup) {
    requestData['group'] = group
  }
  if (self.hasIcon) {
    requestData['icon'] = icon
  }
  if (self.hasCopy) {
    requestData['copy'] = copy
  }
  if (self.hasUrl) {
    requestData['url'] = url
  }
  return requestData
}

async function send(self, server, requestData) {
  try {
    let response = await axios.post(server, requestData)
    if (response.status === 200 && response.data.code === 200) {
      // success
      self.showStatus = true
      self.status = true
      return response
    }
  } catch (e) {
    console.log(e)
  }
  // fail
  self.showStatus = true
  self.status = false
}

function addZero(i) {
  return i < 10 ? "0" + i : i + ""
}

function countDown(self, targetTime) {
  let nowTime = new Date()
  let endTime = new Date(targetTime)
  let timeDelta = parseInt((endTime.getTime() - nowTime.getTime()) / 1000)
  let d = parseInt(timeDelta / (24 * 60 * 60))
  let h = parseInt(timeDelta / (60 * 60) % 24)
  let m = parseInt(timeDelta / 60 % 60)
  let s = parseInt(timeDelta % 60)
  d = addZero(d)
  h = addZero(h)
  m = addZero(m)
  s = addZero(s)
  self.timeRemains = `${d}d ${h}h ${m}m ${s}s`
  console.log(self.timeRemains)
  if (timeDelta <= 0) {
    self.timeRemains = '0'
    return;
  }
  setTimeout(countDown, 1000, self, targetTime)
}

function formatNow() {
  let d = new Date()
  let year = d.getFullYear()
  let month = d.getMonth() + 1
  month = addZero(month)
  let date = d.getDate()
  date = addZero(date)
  let hour = d.getHours()
  hour = addZero(hour)
  let min = d.getMinutes()
  min = addZero(min)
  let sec = d.getSeconds()
  sec = addZero(min)
  return `${year}-${month}-${date}T${hour}:${min}:${sec}`
}

export default {
  data() {
    return {
      labelPosition: 'top',
      form: {
        server: 'https://api.day.app/',
        device: '',
        title: 'WeBark',
        body: '',
        scheduleTime: '',
        level: 'active',
        badge: 1,
        group: '',
        icon: '',
        copy: '',
        url: ''
      },
      // form status
      hasSchedule: false,
      hasLevel: false,
      hasBadge: false,
      hasGroup: false,
      hasIcon: false,
      hasCopy: false,
      hasUrl: false,
      // global status
      showCache: false,
      clearStatus: false,
      showStatus: false,
      status: false,
      showSchedule: false,
      timeRemains: ''
    }
  },
  mounted() {
    let obj = JSON.parse(sessionStorage.getItem('REGISTRATION'))
    console.log(obj)
    if (obj !== null && obj.device !== null && obj.device !== '') {
      this.showCache = true
      this.form = obj
    } else {
      this.showCache = false
    }
    this.form.scheduleTime = formatNow()
  },
  watch: {
    form: {
      handler(newValue, oldValue) {
        this.$store.commit('UPDATE_FROM_DATA', {
          data: this.form
        })
      },
      deep: true
    }
  },
  methods: {
    clearCache() {
      sessionStorage.removeItem('REGISTRATION')
      this.clearStatus = true
    },
    sendNotification() {
      // prepare data
      let requestData = prepareData(this)
      let server = this.form.server + 'push'
      if (!this.hasSchedule) {
        this.showSchedule = false
        send(this, server, requestData)
      } else {
        // schedule to the given time      
        let schedule = this.form.scheduleTime
        let delay = new Date(schedule) - new Date()
        if (delay > 0) {
          setTimeout(send, delay, this, server, requestData)
          this.showSchedule = true
          countDown(this, schedule)
        }
      }
    }
  }
}
</script>

<style>
.form-bg-success {
  background-color: var(--vf-success-lighter);
}

.form-color-success {
  color: var(--vf-color-success);
}

.form-bg-danger {
  background-color: var(--vf-danger-lighter);
}

.form-color-danger {
  color: var(--vf-color-danger);
}

:root {
  --fk-color-primary: #646cff;
  --vf-success-lighter: #dcfce7;
  --vf-color-success: #22c55e;
  --vf-danger-lighter: #fee2e2;
  --vf-color-danger: #ef4444;
  --fk-max-width-input: 40em;
}
</style>