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
        ]" />
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
<div class="flex col-span-6">
  <div class="basis-1/2">
        <ButtonElement  name="submit" button-label="Send" :submits="true" />
  </div>
  <span v-show="show">
      <span v-if="status" class="inline-block transition form-shadow-btn bg-green-600/75 form-color-btn form-border-color-btn form-p-btn form-radius-btn form-text cursor-pointer transition-transform ease-linear transform">Success</span>
        <span v-else class="inline-block transition form-shadow-btn bg-red-600/75 form-color-btn form-border-color-btn form-p-btn form-radius-btn form-text cursor-pointer transition-transform ease-linear transform">Failed</span>
  </span>
  
      
</div>
      </Vueform>
    </div>
  </main>
</template>

<script>
import axios from 'axios'

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
export default {
  data() {
    return {
      show: false,
      status: false
    }
  },
  methods: {
    async sendNotifications(data, form$) {
      // prepare data
      data = prepareData(form$)
      let server = data['server']
      let requestDataList = data['requestDataList']
      let schedule = data['schedule']
      for (let requestData of requestDataList) {
        try {
          let response = await axios.post(server, requestData)
          if (response.status === 200 && response.data.code === 200) {
            // success
            this.show = true
            this.status = true
            return response
          }
        } catch (e) {
          console.log(e)
        }
        // fail
        this.show = true
        this.status = false
      }
    }
  }
}
</script>