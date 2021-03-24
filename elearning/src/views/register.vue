<template>
  <v-app>
    <div class="register-component">
      <div class="container content">
        <div class="box align-items-center justify-content-center">
          <div class="login-title">Đăng ký tài khoản</div>
          <span v-if="message" class="invalid-msg">{{ message }}</span>
          <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="register">
              <div class="form-input">
                <div class="mb-6 mt-6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Tài khoản"
                    rules="required|max:50"
                  >
                    <v-text-field
                      label="Nhập tài khoản"
                      :error-messages="errors"
                      hide-details="auto"
                      v-model="userName"
                      required
                    ></v-text-field>
                  </validation-provider>
                </div>
                <div class="mb-6 mt-6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Họ và tên"
                    rules="required|max:50"
                  >
                    <v-text-field
                      label="Nhập họ và tên"
                      :error-messages="errors"
                      hide-details="auto"
                      v-model="fullName"
                      required
                    ></v-text-field>
                  </validation-provider>
                </div>
                <div class="mb-6 mt-6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Email"
                    rules="required|max:50|email"
                  >
                    <v-text-field
                      label="Nhập email"
                      :error-messages="errors"
                      hide-details="auto"
                      v-model="email"
                      required
                    ></v-text-field>
                  </validation-provider>
                </div>
                <div class="mb-6 mt-6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Mật khẩu"
                    rules="required|min:6"
                  >
                    <v-text-field
                      :append-icon="showP ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showP ? 'text' : 'password'"
                      label="Nhập mật khẩu"
                      hint="Ít nhất 6 ký tự"
                      v-model="passWord"
                      :error-messages="errors"
                      required
                      :ref="'password'"
                      @click:append="showP = !showP"
                    ></v-text-field>
                  
                  </validation-provider>
                </div>
                <div class="mb-6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Nhập lại mật khẩu"
                    rules="required|min:6"
                  >
                    <v-text-field
                      :append-icon="showRe ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showRe ? 'text' : 'password'"
                      name="input-10-2"
                      label="Nhập lại mật khẩu"
                      hint="Ít nhất 6 ký tự"
                      v-model="rePassWord"
                      :error-messages="errors"
                      required
                      @click:append="showRe = !showRe"
                    ></v-text-field>
                  </validation-provider>
                </div>
                <v-btn
                  depressed
                  class="mt-1"
                  color="primary"
                  type="submit"
                  :disabled="invalid"
                  :loading="isRegister"
                >
                  Đăng ký
                </v-btn>
              </div>
            </form>
          </validation-observer>

          <div class="bottom">
            Đã có tài khoản
            <router-link class="ml-1" to="/login">Đăng nhập</router-link>
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import axios from 'axios'

import { required, email, max, min,confirmed } from 'vee-validate/dist/rules'
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
  localeChanged,
} from 'vee-validate'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: '{_field_} không được để trống',
})

extend('max', {
  ...max,
  message: '{_field_} phải ít hơn {length} ký tự',
})

extend('min', {
  ...min,
  message: '{_field_} phải nhiều hơn {length} ký tự',
})
extend('email', {
  ...email,
  message: 'Email phải đúng định dạng',
})

extend('confirmed', {
  ...confirmed,
  message: 'Mật khẩu không khớp',
})
export default {
  name: 'PreMeet',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {},
  data() {
    return {
      userName: '',
      passWord: '',
      fullName: '',
      email: '',
      rePassWord: '',
      isRegister: false,
      message: '',
      showP: false,
      showRe: false,
      groupCode : 'G6'
    }
  },
  methods: {
    register() {
      this.message = ''
      this.$refs.observer.validate().then((result) => {
        if (result === true) {
          const obj = {
            userName: this.userName,
            password: this.passWord,
            name: this.fullName,
            groupCode: this.groupCode,
            email: this.email
          }

          this.isRegister = true
          axios
            .post(`${this.$axios.defaults.baseURL}intergrates/register`, obj)
            .then((resAuthen) => {
              if (resAuthen.data && resAuthen.data.code == 200) {
                this.$router.push('/login')
              }else{
              
                this.message = resAuthen.data.message
              }
              this.isRegister = false
            })
            .catch((err) => {
              console.log(err)
              this.message = 'Đăng ký thất bại'
              this.isRegister = false
            })
        }
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.register-component {
  height: 100vh;
  width: 100vw;
  background: url('../assets/images/login.jpg');
  .content {
    height: calc(100vh - 52px);
    position: relative;
    z-index: 2;
    .box {
      width: 500px;
      background: #ffffff;
      margin: auto;
      transform: translateY(50%);
      -webkit-box-shadow: 0 5px 12px 2px rgba(17, 17, 17, 0.5);
      box-shadow: 0 5px 12px 2px rgba(17, 17, 17, 0.5);
      border-radius: 4px;
      padding: 24px;
      .login-title {
        font-size: 22px;
        font-weight: 500;
      }
      .invalid-msg {
        font-size: 13px;
        color: red;
      }
      .bottom {
        font-size: 14px;
        font-weight: 500;
        display: flex;
        justify-content: flex-end;
        margin-top: 12px;
      }
    }
  }
  &::after {
    width: 100vw;
    height: 100vh;
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    background: #000000;
    opacity: 0.5;
    z-index: 1;
  }
}
</style>
