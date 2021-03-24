<template>
  <div class="home-page">
    <nav class="header navbar navbar-expand-lg">
      <div style="fontweight: 700; fontfamily: sans-serif" class="navbar-brand">
        Vidioc
      </div>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <!-- <font-awesome-icon :icon="['fas', 'bars']" /> -->
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav m-auto">
          <!-- <li class="nav-item active">
            <div class="nav-link">Home</div>
          </li>
          <li class="nav-item">
            <div class="nav-link">Link</div>
          </li>

          <li class="nav-item">
            <div class="nav-link">Movies & TV shows</div>
          </li>
          <li class="nav-item">
            <div class="nav-link">Blog</div>
          </li>
          <li class="nav-item">
            <div class="nav-link">Contact Us</div>
          </li> -->
        </ul>
        <button class="login-button" @click="login()" v-if="!isLogged">
          LOGIN
        </button>
        <div class="dropdown" v-if="isLogged">
          <button
            class="btn-logout"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          ></button>
          <div class="dropdown-menu" style="left: -105px" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item d-item" @click="logout()" 
              >Log out</a
            >
          </div>
        </div>
      </div>
    </nav>

    <div class="container-fluid main-content">
      <div class="row h-100 align-items-center justify-content-center">
        <div class="button-group-center flex-c-m">
          <!-- <button class="add-new-meet">
            <div style="margin-right: 8px">
              <i class="fa fa-video-camera" aria-hidden="true"></i>
            </div>
            <div>Cuộc họp mới</div>
          </button> -->

          <div class="typing-code flex-c-m">
            <input
              class="typing-input"
              type="text"
              placeholder="Nhập vào một mã"
              v-model="roomId"
              v-on:keyup.enter="joinRoom()"
            />
            <button class="btn-join" @click="joinRoom()">
              <!-- <font-awesome-icon :icon="['fa', 'arrow-right']" /> -->
            </button>
            <div class="icon-keyboard">
              <!-- <font-awesome-icon :icon="['fas', 'keyboard']" /> -->
            </div>
          </div>

          <div class="text-slide flex-c-m">
            <transition name="slide">
              <div class="text" v-if="showText">{{ slideSelected.text }}</div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="overlay">
      <transition name="fade">
        <img :src="firstSlide.imgSource" v-if="show" />
      </transition>
      <transition name="fade">
        <img :src="secondSlide.imgSource" v-if="!show" />
      </transition>
      <div class="cover"></div>
    </div> -->
  </div>
</template>

<script>
// import slide_0 from '../assets/images/slide1.jpg'
// import slide_1 from '../assets/images/slide2.jpg'
// import slide_2 from '../assets/images/slide3.jpg'
// import resize from 'vue-resize-directive'

export default {
  name: 'Home',
  // directives: {
  //   resize,
  // },
  components: {},
  data() {
    return {
      roomId: '',
      carousel: 2,
      slidePos: 0,
      firstSlide: null,

      secondSlide: null,
      show: true,
      slideSelected: null,
      showText: false,
      slides: [
        // {
        //   sortOrder: 1,
        //   text: 'Tạo cuộc gọi dễ dàng ',
        //   imgSource: slide_0,
        // },
        // {
        //   sortOrder: 2,
        //   text: 'Tất cả đều miễn phí',
        //   imgSource: slide_1,
        // },
        // {
        //   sortOrder: 3,
        //   text: 'Hình ảnh, âm thanh sắc nét',
        //   imgSource: slide_2,
        // },
      ],
      testshow: true,
      testshow1: false,
      isLogged: false,
    }
  },
  props: {},
  beforeMount() {
    const token = localStorage.getItem('token')
    if (token) {
      this.isLogged = true
    } else {
      this.isLogged = false
    }

    // this.firstSlide = this.slides[this.slidePos]
    // this.secondSlide = this.slides[(this.slidePos + 1) % this.slides.length]
    // this.slideSelected = this.firstSlide

    // this.runCarousel() 
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    login() {
      this.testshow = !this.testshow
      this.$router.push('/login')
    },
    runCarousel() {
      if (this.interval) {
        clearInterval(this.interval)
      }
      this.runTextChange()

      this.interval = setInterval(() => {
        this.runTextChange()

        this.slidePos++
        if (this.slidePos > 2) {
          this.slidePos = 0
        }

        this.show = !this.show

        if (this.show == true) {
          this.firstSlide = this.slides[this.slidePos]
          this.secondSlide = this.slides[
            (this.slidePos + 1) % this.slides.length
          ]
          this.slideSelected = this.firstSlide
        } else {
          this.secondSlide = this.slides[this.slidePos]
          this.firstSlide = this.slides[
            (this.slidePos + 1) % this.slides.length
          ]
          this.slideSelected = this.secondSlide
        }
      }, 10000)
    },

    runTextChange() {
      if (this.timeoutShow) {
        this.timeoutShow = 0
      }

      this.timeoutShow = setTimeout(() => {
        if (this.timeoutHide) {
          this.timeoutHide = 0
        }
        this.showText = true
        this.timeoutHide = setTimeout(() => {
          this.showText = false
        }, 6000)
      }, 2000)
    },
    joinRoom() {
      this.$router.push({ name: "room", query: { roomId: this.roomId } });
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.home-page {
  color: #ffffff;
  position: relative;
  height: 100vh;
  background: wheat;

  .header {
    position: relative;
    z-index: 3;

    .left {
      font-size: 20px;
      font-weight: 600;
    }

    .center {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .login-button {
      height: 35px;
      width: 100px;
      border: none;
      border-radius: 4px;
      background: #0b64a4;
      cursor: pointer;
      outline: 0;
      padding: 0 15px;
      position: relative;
      font-weight: 600;
      border: 0;
      -webkit-transition: all 0.5s ease;
      transition: all 0.5s ease;
    }

    .login-button:hover {
      -webkit-filter: brightness(113%);
      filter: brightness(113%);
    }
  }

  .main-content {
    position: relative;
    z-index: 2;
    height: calc(100% - 56px);

    .button-group-center {
      height: 50px;
      display: flex;
      flex-wrap: wrap;
      position: relative;
      width: 650px;
      z-index: 2;
      .add-new-meet {
        height: 48px;
        font-size: 17px;
        width: 155px;

        font-weight: 600;
        margin-right: 24px;
        background-color: #0b64a4;
        border: none;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        outline: none;
      }

      .add-new-meet:hover {
        -webkit-filter: brightness(113%);
        filter: brightness(113%);
      }

      .typing-code {
        position: relative;
        width: auto;
        min-width: 270px;
        .icon-keyboard {
          position: absolute;
          top: 22px;
          left: 12px;
          color: #ffffff;
        }
        .typing-input {
          height: 60px;
          width: 400px;
          border: solid 1px #e9e9e9;
          font-size: 17px;
          border-radius: 4px;
          padding: 0px 40px;
          color: #ffffff;
          margin-right: 8px;
        }

        .typing-input:hover {
          border: solid 1px #0b64a4;

          outline: none;
        }

        .typing-input:focus {
          border: solid 1px #0b64a4;
          outline: none;
        }

        .btn-join {
          height: 60px;
          color: white;
          width: 60px;
          font-size: 28px;
          font-weight: 600;
          background-color: #0b64a4;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-join:hover {
          color: white;
          background-color: #0a5e9b;
        }

        .btn-join:focus {
          outline: none;
        }
      }
    }
    @media (max-width: 576px) {
      .button-group-center {
        .add-new-meet {
          height: 36px;
          font-size: 13px;
          width: 100%;
          min-width: 270px;
          font-weight: 600;
          margin: 0px 0px 8px 0px;
        }
        .typing-code {
          position: relative;
          .icon-keyboard {
            position: absolute;
            top: 10px;
            left: 12px;
            color: #5f6368;
          }
          .typing-input {
            min-width: 226px;
            padding-left: 40px;
            width: calc(100% - 44px);
            height: 36px;
            border: solid 1px #e9e9e9;
            font-size: 17px;
            color: #3c4043;
          }

          .btn-join {
            height: 36px;
            width: 36px;
            font-size: 13px;
            cursor: pointer;
          }
        }
      }
    }
  }
  .text-slide {
    position: absolute;
    top: -70px;
    width: 1000px;
    overflow: hidden;
    height: 65px;
    .text {
      font-size: 60px;
      position: absolute;

      z-index: 5;
      color: rgb(255, 255, 255);
      font-weight: 900;
      visibility: inherit;
      text-align: inherit;
      line-height: 60px;
      border-width: 0px;
      margin: 0px;
      padding: 0px;
      letter-spacing: 0px;
      white-space: nowrap;
      min-height: 0px;
      min-width: 0px;
      max-height: none;
      max-width: none;
      opacity: 1;
      transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      transform-origin: 50% 50% 0px;
    }
  }
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 1;
      position: absolute;
      top: 0px;
      left: 0px;
    }

    .cover {
      background-color: black;
      opacity: 0.7;
      width: 100%;
      height: 100%;
      z-index: 2;
      position: fixed;
      top: 0;
      left: 0;
    }
  }

  .list-slide {
    position: absolute;
    top: 48%;
    right: 40px;
    z-index: 5;

    .slide {
      position: relative;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      border: solid 2px grey;
      margin-bottom: 16px;
      box-shadow: 0 0 0 2px transparent;
      -webkit-transition: box-shadow 0.3s ease;
      transition: box-shadow 0.3s ease;
      cursor: pointer;
      .slide-inner {
        background-color: rgba(255, 255, 255, 0.7);
        -webkit-transition: background-color 0.3s ease,
          -webkit-transform 0.3s ease;
        transition: background-color 0.3s ease, transform 0.3s ease;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        outline: none;
        border-radius: 50%;
        background-color: #fff;
        background-color: rgba(255, 255, 255, 0.3);
        text-indent: -999em;
        cursor: pointer;
        position: absolute;
      }
    }
    .slide:hover {
      border: solid 2px #ffffff;
    }
    .slide:hover .slide-inner {
      -webkit-transform: scale(0.4);
      transform: scale(0.4);
      background-color: #fff;
    }

    .slide-active {
      border: solid 2px #ffffff;
    }

    .slide-active .slide-inner {
      -webkit-transform: scale(0.4);
      transform: scale(0.4);
      background-color: #fff;
    }
  }
}

button {
  color: #ffffff;
}

@media (max-width: 1000px) {
  .text {
    font-size: 6vw !important;
  }
  .button-group-center {
    width: 65vw !important;
  }
  .typing-input {
    width: 50vw !important;
  }
  .add-new-meet {
    width: 55vw !important;
    margin: 0px 0px 8px 0px !important;
  }
}

.nav-link {
  cursor: pointer;
}
.nav-link:hover {
  color: #dcdcdc;
}

.slide-enter-active {
  -moz-transition-duration: 1s;
  -webkit-transition-duration: 1s;
  -o-transition-duration: 1s;
  transition-duration: 1s;
  -moz-transition-timing-function: ease-in-out;
  -webkit-transition-timing-function: ease-in-out;
  -o-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
}

.slide-leave-active {
  -moz-transition-duration: 1s;
  -webkit-transition-duration: 1s;
  -o-transition-duration: 1s;
  transition-duration: 1s;
  -moz-transition-timing-function: ease-in-out;
  -webkit-transition-timing-function: ease-in-out;
  -o-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
}

.slide-enter-to,
.slide-leave {
  top: 0px;
}

.slide-enter,
.slide-leave-to {
  top: 60px;
}

.fade-enter-active {
  -moz-transition-duration: 2s;
  -webkit-transition-duration: 2s;
  -o-transition-duration: 2s;
  transition-duration: 2s;
  -moz-transition-timing-function: ease-in-out;
  -webkit-transition-timing-function: ease-in-out;
  -o-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
}

.fade-leave-active {
  -moz-transition-duration: 2s;
  -webkit-transition-duration: 2s;
  -o-transition-duration: 2s;
  transition-duration: 2s;
  -moz-transition-timing-function: ease-in-out;
  -webkit-transition-timing-function: ease-in-out;
  -o-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.btn-logout {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  // background: url('../assets/icons/user.png');
  background-size: 100px 100px;
  background-position: -30px -31px;
}
.d-item {
  cursor: pointer;
  // &:hover{
  //   background: #005abd;
  // }
}
</style>
