<template>
  <v-app>
    <div class="pre-meet">
      <div class="container content">
        <div class="box align-items-center justify-content-center">
          <div class="title">Sẵn sàng tham gia?</div>
          <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="joinMeetNow">
              <div class="form-input">
                <div class="mb-3">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Tên"
                    rules="required|max:50"
                  >
                    <v-text-field
                      label="Tên của bạn"
                      :error-messages="errors"
                      hide-details="auto"
                      v-model="displayName"
                      required
                    ></v-text-field>
                  </validation-provider>
                </div>
                <div class="mb-3">
                  <v-checkbox
                    v-model="devices"
                    :label="`Sử dụng micro`"
                    color="primary"
                    value="audio"
                    hide-details
                  ></v-checkbox>
                  <v-checkbox
                    v-model="devices"
                    :label="`Sử dụng Camera`"
                    color="primary"
                    value="camera"
                    hide-details
                  ></v-checkbox>
                </div>

                <v-btn
                  depressed
                  color="primary"
                  :disabled="invalid"
                  @click="joinMeetNow()"
                >
                  Tham gia
                </v-btn>
              </div>
            </form>
          </validation-observer>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import { required, max } from 'vee-validate/dist/rules'
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from 'vee-validate'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: '{_field_} không được để trống'
})

extend('max', {
  ...max,
  message: '{_field_} phải ít hơn {length} kýt tự'
})

export default {
  name: 'PreMeet',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  props: {},
  data() {
    return {
      devices : ["audio", "camera"],
      displayName: ''
    }
  },
  methods: {
    joinMeetNow() {
      this.$refs.observer.validate().then((result) => {
        if (result === true) {
          const obj = {
            displayName: this.displayName,
            useMicro: this.devices.includes("audio"),
            useCamera: this.devices.includes("camera")
          }

          this.$emit('joinNow', obj)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.pre-meet {
  .content {
    height: calc(100vh - 52px);

    .box {
      width: 600px;
      background: #ffffff;
      margin: auto;
      transform: translateY(50%);
      -webkit-box-shadow: 0 5px 12px 2px rgba(17, 17, 17, 0.5);
      box-shadow: 0 5px 12px 2px rgba(17, 17, 17, 0.5);
      border-radius: 4px;
      padding: 24px;
      .title {
        font-size: 22px;
        margin-bottom: 24px;
      }
    }
  }
}
</style>
