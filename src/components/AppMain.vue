<template>
  <main class="text-left">
    <h1 class="py-5 text-center text-3xl font-bold">Send notifications to your iPhone easily from now.</h1>
    <div class="md:w-1/2 mx-auto">
      <Vueform validate-on="step|change" add-class="vf-my-form" :endpoint="sendNotifications">
        <TextElement name="server" input-type="url" :rules="[
          'nullable',
          'url',
        ]" placeholder="https://api.day.app/" :floating="false" label="Server" />
        <ListElement name="devices" label="Register Devices (required)" :rules="[
          'required',
        ]">
          <template #default="{ index }">
            <ObjectElement :name="index">
              <TextElement name="device" :rules="[
                'required',
                'min:22',
                'max:22',
              ]" placeholder="Device code" />
            </ObjectElement>
          </template>
        </ListElement>
        <TextElement name="title" label="Title (required)" placeholder="WeBark" />
        <TextareaElement name="body" label="Body (required)" :rules="[
          'required',
          'min:1',
        ]" />
        <CheckboxElement name="schedule" text="Schedule time (optional)" />
        <DateElement name="schedule-input" :time="true" :conditions="[
          ['schedule', '==', true]
        ]" :rules="[compareByNow]" />
        <CheckboxElement name="level" text="Level (optional)" />
        <SelectElement name="level-input" :items="[
          {
            value: 'active',
            label: 'active',
          },
          {
            value: 'timeSensitive',
            label: 'timeSensitive',
          },
          {
            value: 'passive',
            label: 'passive',
          },
        ]" :search="true" :native="false" input-type="search" autocomplete="off" :conditions="[
  ['level', '==', true]
]" />
        <CheckboxElement name="badge" text="Badge (optional)" />
        <TextElement name="badge-input" input-type="number" :rules="[
          'nullable',
          'numeric',
        ]" autocomplete="off" :conditions="[
  ['badge', '==', true]
]" />
        <CheckboxElement name="group" text="Group (optional)" />
        <TextElement name="group-input" :conditions="[
          ['group', '==', true]
        ]" />
        <CheckboxElement name="icon" text="Icon (optional)" />
        <TextElement name="icon-input" input-type="url" :rules="[
          'nullable',
          'url',
        ]" placeholder="eg. http(s)://domain.com" :floating="false" :conditions="[
  ['icon', '==', true]
]" />
        <CheckboxElement name="copy" text="Copy as text (optional)" />
        <TextElement name="copy-input" :conditions="[
          ['copy', '==', true]
        ]" />
        <CheckboxElement name="url" text="URL to open (optional)" />
        <TextElement name="url-input" input-type="url" :rules="[
          'nullable',
          'url',
        ]" placeholder="eg. http(s)://domain.com" :floating="false" :conditions="[
  ['url', '==', true]
]" />
        <ButtonElement name="submit" button-label="Send" :submits="true" />
      </Vueform>
      <div v-show="showSchedule">
        <div
          class="bg-gray-400/75 rounded form-radius-input form-text form-mb-gutter py-2 px-3 mt-4">
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
  </main>
</template>

<script>
import axios from 'axios'
import { Validator } from '@vueform/vueform'

const compareByNowRule = class extends Validator {
  get message() {
    return 'The schedule time must ahead now'
  }
  check(value) {
    let given = new Date(value)
    let now = new Date()
    return now < given
  }
}

function prepareData(form$) {
  let formData = form$.data
  let devices = []
  for (let item of formData['devices']) {
    devices.push(item['device'])
  }
  let server = formData['server'] === null ? 'https://api.day.app/push' : formData['server']
  let title = formData['title'] === null ? 'WeBark' : formData['title']
  let body = formData['body']
  let schedule = formData['schedule-input']
  let level = formData['level-input']
  let badge = formData['badge-input']
  let group = formData['group-input']
  let icon = formData['incon-input']
  let copy = formData['copy-input']
  let url = formData['url-input']
  // request data
  let requestDataList = []
  for (let device of devices) {
    let requestData = {
      title: title,
      body: body,
      device_key: device
    }
    if (level !== null) {
      requestData['level'] = level
    }
    if (badge !== null) {
      requestData['badge'] = badge
    }
    if (group !== null) {
      requestData['group'] = group
    }
    if (icon !== null) {
      requestData['icon'] = icon
    }
    if (copy !== null) {
      requestData['copy'] = copy
    }
    if (url !== null) {
      requestData['url'] = url
    }
    requestDataList.push(requestData)
  }
  return {
    server: server,
    requestDataList: requestDataList,
    schedule: schedule
  }
}
async function send(self, server, requestDataList) {
  for (let requestData of requestDataList) {
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
export default {
  data() {
    return {
      showStatus: false,
      status: false,
      showSchedule: false,
      timeRemains: '',
      compareByNow: compareByNowRule
    }
  },
  methods: {

    async sendNotifications(data, form$) {
      // prepare data
      data = prepareData(form$)
      let server = data['server']
      let requestDataList = data['requestDataList']
      let schedule = data['schedule']
      if (schedule === null) {
        this.showSchedule = false
        send(this, server, requestDataList)
      } else {
        // schedule to the given time
        let delay = new Date(schedule) - new Date()
        if (delay > 0) {
          setTimeout(send, delay, this, server, requestDataList)
          this.showSchedule = true
          countDown(this, schedule)
        }
      }
    }
  }
}
</script>