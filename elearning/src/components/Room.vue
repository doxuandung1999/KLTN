<template>
  <transition appear>
    <div data-component="Room">
      <Notifications />

      <!-- <div class="state">
        <div class="icon" :class="room.state" />
        <p class="text" :class="room.state">{{ room.state }}</p>
      </div> -->

      <!-- <div class="room-link-wrapper">
        <div class="room-link">
          <a
            class="link"
            :href="room.url"
            target="_blank"
            rel="noopener noreferrer"
            @click="onInvitationLinkClick"
          >
            invitation link
          </a>
        </div>
      </div> -->
      <Peers v-if="roomClientReady" :room-client="roomClient" />

      <div class="me-container" :class="{ 'active-speaker': amActiveSpeaker }">
        <Me
          v-if="roomClientReady"
          :room-client="roomClient"
          @onDetailClick="showRightBar"
        />
      </div>
      <div class="chat-input-container">
        <ChatInput v-if="roomClientReady" :room-client="roomClient" />
      </div>
      <div class="me-button-container">
        <div class="icons flex-a">
          <span class="mr-2 pointer flex-c-m icon-28 ml-1" title="Mọi người">
            <font-awesome-icon
              :icon="['fas', 'users']"
              @click="showRightBar(tab.People)"
            />
          </span>
          <!-- <span class="mr-2 pointer flex-c-m icon-28 ">
            <font-awesome-icon
              :icon="['fas', 'comments']"
              @click="showRightBar(tab.Chat)"
            />
          </span> -->
          <span class="mr-2 pointer flex-c-m icon-28 " title="Tệp tin">
            <font-awesome-icon
              :icon="['fas', 'file']"
              @click="showRightBar(tab.File)"
            />
          </span>
          <span class="mr-2 pointer flex-c-m icon-28 " title="Sao chép phòng">
            <font-awesome-icon
              :icon="['fas', 'clone']"
              @click="onInvitationLinkClick"
            />
          </span>
        </div>
      </div>
      <div class="sidebar">
        <div
          class="button hide-videos flex-c-m mr-3"
          :class="{
            'not-available': me.audioOnly,
            disabled: me.audioOnlyInProgress
          }"
          title="ẩn/hiện video"
          @click="toggleParticipantsVideo"
        >
          <font-awesome-icon :icon="['fas', 'video']" />
        </div>

        <div
          class="button mute-audio  flex-c-m mr-3"
          :class="{ 'not-available': me.audioMuted }"
          title="Tắt/bật audio"
          @click="toggleMute"
        >
          <font-awesome-icon :icon="['fas', 'microphone']" />
        </div>
        <div
          class="button share-screen  flex-c-m mr-3"
          title="Chia sẻ màn hình"
          :class="{
            shareState,
            disabled: me.shareInProgress || me.webcamInProgress
          }"
          @click="toggleShare"
        >
          <font-awesome-icon :icon="['fas', 'share']" />
        </div>

 
        <div
          class="button share-screen stop-call  flex-c-m"
          title="Thoát"
          @click="stopCall"
        >
          <font-awesome-icon :icon="['fas', 'phone']" />
        </div>

        <!--        <div-->
        <!--          class="button restart-ice"-->
        <!--          :class="{-->
        <!--            disabled: me.restartIceInProgress-->
        <!--          }"-->
        <!--          title="Restart ICE"-->
        <!--          @click="roomClient.restartIce()"-->
        <!--        />-->
      </div>
      <Stats v-if="roomClientReady" :room-client="roomClient" />

      <!-- right bar -->
      <transition name="slide">
        <div class="right-bar" v-if="visibleRightBar">
          <DetailMeet
            :tabSelectedProp="tabSelected"
            :room-client="roomClient"
            @onHidden="hidenRightBar()"
          />
        </div>
      </transition>
      <!--end right bar -->

      <NetworkThrottle
        v-if="roomClientReady && NETWORK_THROTTLE_SECRET"
        :room-client="roomClient"
        :secret="NETWORK_THROTTLE_SECRET"
      />
    </div>
  </transition>
</template>
<script>
import clipboardCopy from 'clipboard-copy'

import UrlParse from 'url-parse'
import Notifications from '@/components/Notifications'
import NetworkThrottle from '@/components/NetworkThrottle'
import Stats from '@/components/Stats'

import DetailMeet from '@/components/DetailMeet'
import ChatInput from '@/components/ChatInput'
import Me from '@/components/Me'
import Peers from '@/components/Peers'
import RoomClient from '@/utils/RoomClient'
// import * as cookiesManager from '@/utils/cookiesManager'
import deviceInfo from '@/utils/deviceInfo'

import randomString from '@/utils/randomString'
import randomName from '@/utils/randomName'

import RecordRTC from 'recordrtc'

export default {
  props: {
    displayName: {
      type: String,
      required: true
    },
    disableAudio: {
      type: Boolean
    },
    disableWebcam: {
      type: Boolean
    }
  },
  components: {
    Notifications,
    NetworkThrottle,
    ChatInput,
    Me,
    Peers,
    DetailMeet,
    Stats
  },
  data() {
    return {
      roomClient: null,
      roomClientReady: false,
      tab: {
        Chat: 1,
        People: 2,
        File: 3
      },
      tabSelected: null,
      visibleRightBar: false,

      isRecording: false,
      recordRTC: null,
      stream: null,

      NETWORK_THROTTLE_SECRET: window.NETWORK_THROTTLE_SECRET
    }
  },
  computed: {
    me() {
      return this.$store.state.me
    },
    amActiveSpeaker() {
      return this.$store.state.me.id === this.$store.state.room.activeSpeakerId
    },
    room() {
      return this.$store.state.room
    },
    shareState() {
      if (Boolean(this.videoProducer) && this.videoProducer.type === 'share') {
        return 'on'
      } else {
        return 'off'
      }
    }
  },
  async mounted() {
    const urlParser = new UrlParse(window.location.href, true)

    const peerId = randomString(8).toLowerCase()

    let roomId = urlParser.query.roomId
    let displayName = this.displayName

    const handler = urlParser.query.handler
    const useSimulcast = urlParser.query.simulcast !== 'false'
    const useSharingSimulcast = urlParser.query.sharingSimulcast !== 'false'
    const forceTcp = urlParser.query.forceTcp === 'true'
    const produce = urlParser.query.produce !== 'false'
    const consume = urlParser.query.consume !== 'false'
    const forceH264 = urlParser.query.forceH264 === 'true'
    const forceVP9 = urlParser.query.forceVP9 === 'true'
    const svc = urlParser.query.svc
    const datachannel = urlParser.query.datachannel !== 'false'
    const info = urlParser.query.info === 'true'
    const faceDetection = urlParser.query.faceDetection === 'true'
    const externalVideo = urlParser.query.externalVideo === 'true'
    const throttleSecret = urlParser.query.throttleSecret

    /*
    // Enable face detection on demand.
    if (faceDetection) {
      await faceapi.loadTinyFaceDetectorModel('/resources/face-detector-models');
    }
    */

    if (info) {
      // eslint-disable-next-line require-atomic-updates
      window.SHOW_INFO = true
    }

    if (throttleSecret) {
      // eslint-disable-next-line require-atomic-updates
      window.NETWORK_THROTTLE_SECRET = throttleSecret
    }

    if (!roomId) {
      roomId = randomString({ length: 8 }).toLowerCase()

      urlParser.query.roomId = roomId
      window.history.pushState('', '', urlParser.toString())
    }

    // Get the effective/shareable Room URL.
    const roomUrlParser = new UrlParse(window.location.href, true)

    delete roomUrlParser.hash

    const roomUrl = roomUrlParser.toString()

    let displayNameSet

    // If displayName was provided via URL or Cookie, we are done.
    if (displayName) {
      displayNameSet = true
    }
    // Otherwise pick a random name and mark as "not set".
    else {
      displayNameSet = false
      displayName = randomName()
    }

    // Get current device info.
    const device = deviceInfo()

    this.$store.commit('room/setRoomUrl', { url: roomUrl })

    this.$store.commit('room/setFaceDetection', { flag: faceDetection })

    let disableAudio = this.disableAudio
    let disableWebcam = this.disableWebcam

    this.$store.commit('me/setMe', {
      peerId,
      displayName,
      displayNameSet,
      device,
      disableAudio,
      disableWebcam
    })

    this.roomClient = new RoomClient({
      roomId,
      peerId,
      displayName,
      device,
      handlerName: handler,
      useSimulcast,
      useSharingSimulcast,
      forceTcp,
      produce,
      consume,
      forceH264,
      forceVP9,
      svc,
      datachannel,
      externalVideo,

      store: this.$store,
      disableAudio,
      disableWebcam
    })

    await this.roomClient.join()

    this.roomClientReady = true
  },
  methods: {
    handleRecording() {
      this.isRecording = !this.isRecording

      if (this.isRecording) {
        this.startRecording()
      } else {
        this.stopRecording()
      }
    },

    startRecording() {
      let playbackElement = document.getElementById('hellooooo')
      playbackElement.play()
      let captureStream = playbackElement.captureStream()
      let options = {
        mimeType: 'video/mp4',
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 512000,
        bitsPerSecond: 512000
      }

      this.recordRTC = RecordRTC(captureStream, options)
      this.recordRTC.startRecording()
      let videoElm = document.getElementById('preview-video')
      videoElm.srcObject = captureStream
      videoElm.play()
    },

    stopRecording() {

      // var recordedBlob = this.recordRTC.getBlob();
      this.recordRTC.getBlob();
      this.recordRTC.stopRecording( (Blob)=> {
         this.recordRTC.save('video.mp4');
         console.log(Blob);
      })
      
      this.recordRTC.getDataURL(function(dataURL) {
        console.log(dataURL);
      })
    },

    toggleParticipantsVideo() {
      this.me.audioOnly
        ? this.roomClient.disableAudioOnly()
        : this.roomClient.enableAudioOnly()
    },
    toggleShare() {
      if (this.shareState === 'on') {
        this.roomClient.disableShare()
      } else {
        this.roomClient.enableShare()
      }
    },
    toggleMute() {
      this.me.audioMuted
        ? this.roomClient.unmuteAudio()
        : this.roomClient.muteAudio()
    },
    onInvitationLinkClick(event) {
      // If this is a 'Open in new window/tab' don't prevent
      // click default action.
      if (
        event.ctrlKey ||
        event.shiftKey ||
        event.metaKey ||
        // Middle click (IE > 9 and everyone else).
        (event.button && event.button === 1)
      ) {
        return
      }

      event.preventDefault()
      clipboardCopy(this.room.url).then(
        this.$store.dispatch('notify', {
          text: 'Room link copied to the clipboard'
        })
      )
    },
    showRightBar(tab) {
      this.tabSelected = tab
      this.visibleRightBar = true
    },
    hidenRightBar() {
      this.visibleRightBar = false
    },
    stopCall() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.record-screen {
  .circle {
    border: solid 1px;
    width: 22px;
    position: relative;
    height: 22px;
  }
  .circle::after {
    content: '';
    width: 10px;
    height: 10px;
    background: #ffffff;
    border-radius: 50%;
    position: absolute;
    top: 5px;
    left: 5px;
  }
  .stop-record::after {
    width: 10px;
    height: 10px;
    background: #c5221f;
    position: absolute;
    z-index: 1;
    border-radius: 2px;
  }
}

.stop-call {
  transform: rotate(-135deg);
  background-color: #c5221f !important;
  border: solid 1px #c5221f;
  color: #ffffff;
}

.stop-call:hover {
  background-color: #983a38 !important;
  border: solid 1px #983a38;
}

.right-bar {
  position: fixed;
  width: 360px;
  height: 100vh;
  top: 0px;
  right: 0px;
}

.slide-enter-active {
  -moz-transition-duration: 0.5s;
  -webkit-transition-duration: 0.5s;
  -o-transition-duration: 0.5s;
  transition-duration: 0.5s;
  -moz-transition-timing-function: ease-in-out;
  -webkit-transition-timing-function: ease-in-out;
  -o-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
}

.slide-leave-active {
  -moz-transition-duration: 0.5s;
  -webkit-transition-duration: 0.5s;
  -o-transition-duration: 0.5s;
  transition-duration: 0.5s;
  -moz-transition-timing-function: ease-in-out;
  -webkit-transition-timing-function: ease-in-out;
  -o-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
}

.slide-leave-to {
  transform: translate(100%, 0);
}

.slide-enter {
  transform: translate(100%);
}
.tooltip {
  background-color: #c5221f;
  height: 10px;
  width: 210px;
}
</style>
