<template>
  <v-app>
    <div class="login-component">
      <div class="container content">
        <div class="box align-items-center justify-content-center">
          <div class="login-title">Đăng nhập hệ thống</div>
          <span v-if="message" class="invalid-msg">{{ message }}</span>
          <validation-observer ref="observer" v-slot="{ invalid }">
            <form @submit.prevent="login">
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
                <div class="mb-6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Mật khẩu"
                    rules="required|min:6"
                  >
                    <v-text-field
                      :append-icon="showP ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showP ? 'text' : 'password'"
                      label="Nhập mật khẩu"
                      :error-messages="errors"
                      hide-details="auto"
                      v-model="passWord"
                      required
                      @click:append="showP = !showP"
                    ></v-text-field>
                  </validation-provider>
                </div>
                <v-btn
                  depressed
                  class="mt-1"
                  color="primary"
                  type="submit"
                  :disabled="invalid"
                  :loading="isLogin"
                >
                  Đăng nhập
                </v-btn>
              </div>
            </form>
          </validation-observer>

          <div class="bottom">
            Chưa có tài khoản
            <router-link class="ml-1" to="/register">Đăng ký</router-link>
          </div>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import axios from "axios";

import { required, max, min } from "vee-validate/dist/rules";
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode,
} from "vee-validate";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "{_field_} không được để trống",
});

extend("max", {
  ...max,
  message: "{_field_} phải ít hơn {length} ký tự",
});

extend("min", {
  ...min,
  message: "{_field_} phải nhiều hơn {length} ký tự",
});

export default {
  name: "PreMeet",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {},
  data() {
    return {
      userName: "",
      passWord: "",
      isLogin: false,
      message: "",
      showP: false,
    };
  },
  beforeMount() {
    // var token = localStorage.getItem('token')
    // if (token !== null && typeof token !== undefined && token !== '') {
    //   var reqContent = {
    //     method: 'post',
    //     url: `${this.$axios.defaults.baseURL}intergrates/authen`,
    //     headers: {
    //       Authorization: 'Bearer ' + token,
    //       'Content-Type': 'application/json',
    //     },
    //   }
    //   axios(reqContent)
    //     .then((result) => {
    //       if (result.status == 200) {
    //         this.$router.push('/')
    //       } else {
    //         this.$router.push({ name: 'login' })
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //       this.$router.push({ name: 'login' })
    //     })
    // } else {
    //   this.$router.push({ name: 'login' })
    // }
  },
  methods: {
    login() {
      this.message = "";
      let roomId = this.$route.query.roomId;
      this.$refs.observer.validate().then((result) => {
        if (result === true) {
          const obj = {
            UserEmail: this.userName,
            Password: this.passWord,
          };
          this.isLogin = true;
          axios
            .post(`https://localhost:44320/api/Users/authenticate`, obj)
            .then((res) => {
              if (res.data && res.data.code == 200 && res.data.data) {
                window.localStorage.setItem("token", res.data.data.token);
                if (roomId) {
                  this.$router.push({
                    name: "room",
                    query: { roomId: roomId },
                  });
                } else {
                  this.$router.push("/");
                }
                // const sid = res.data.data.sid
                // axios
                //   .get(
                //     `${this.$axios.defaults.baseURL}intergrates/token?sid=${sid}`
                //   )
                //   .then((resAuthen) => {
                //     if (
                //       resAuthen.data &&
                //       resAuthen.data.code == 200 &&
                //       resAuthen.data.data
                //     ) {
                //       window.localStorage.setItem(
                //         'token',
                //         resAuthen.data.data.token
                //       )
                //       if (roomId) {
                //         this.$router.push({
                //           name: 'room',
                //           query: { roomId: roomId },
                //         })
                //       } else {
                //         this.$router.push('/')
                //       }
                //     }
                //   })
                //   .catch((err) => {
                //     console.log(err)
                //     this.message = 'Đăng nhập thất bại'
                //     this.isLogin = false
                //   })
              }
              this.isLogin = false;
            })
            .catch((err) => {
              console.log(err);
              this.message = "Đăng nhập thất bại";
              this.isLogin = false;
            });
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.login-component {
  height: 100vh;
  width: 100vw;
  // background: url("../assets/images/login.jpg");
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

        margin-top: 12px;

        display: flex;
        justify-content: flex-end;
      }
    }
  }
  &::after {
    width: 100vw;
    height: 100vh;
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    background: #000000;
    opacity: 0.5;
    z-index: 1;
  }
}
</style>
