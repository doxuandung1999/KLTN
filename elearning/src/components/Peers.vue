<template>
  <div data-component="Peers">
    <transition v-for="peer in peers" :key="peer.id" appear>
      <vue-resizable
        :width="peerW"
        :height="peerH"
        :max-width="maxW"
        :max-height="maxH"
        :min-width="minW"
        :min-height="minH"
        :active="handlers"
        class="peer-container flex-c-m"
      >
        <div
          style="width: 100%;height:100%"
          class="flex-c-m"
          :class="{
            'active-speaker': peer.id === activeSpeakerId
          }"
        >
          <Peer :peer="peer" :room-client="roomClient" />
        </div>

        <div class="pin"></div>
      </vue-resizable>
    </transition>
  </div>
</template>

<script>
import Peer from '@/components/Peer'
// import resize from 'vue-resize-directive'
// import VueResizable from 'vue-resizable'
export default {
  components: { Peer },
  // directives: {
  //   resize
  // },
  data() {
    return {
      peerW: 360,
      peerH: 200,
      maxW: 1920,
      maxH: 1080,
      minW: 360,
      minH: 200,
      handlers: ['r', 'rb', 'b'],
    }
  },
  props: {
    roomClient: {
      type: Object,
      required: true
    }
  },
  computed: {
    peers() {
      return this.$store.state.peers.peers
    },
    activeSpeakerId() {
      return this.$store.state.room.activeSpeakerId
    },
    // onResize() {}
  },
  watch:{
     peers() {
       this.getWindowWidth();
     }
  },
  mounted() {
    this.$nextTick(function() {
      // window.addEventListener('resize', this.getWindowWidth)
      this.getWindowWidth()
    })
  },
  methods: {
    getWindowWidth() {
      const listpeer = this.$store.state.peers.peers
      const windowWidth = window.innerWidth
      if (windowWidth > 1600) {
        if (listpeer.length == 1) {
          this.peerW = 1440
          this.peerH = 800
        } else if (listpeer.length <= 4) {
          this.peerW = 720
          this.peerH = 400
        } else {
          this.peerW = 360
          this.peerH = 200
        }
      } else if (windowWidth > 1360) {
        if (listpeer.length == 1) {
          this.peerW = 1260
          this.peerH = 700
        } else if (listpeer.length <= 4) {
          this.peerW = 630
          this.peerH = 350
        }else {
          this.peerW = 360
          this.peerH = 200
        }
      } else if (windowWidth > 1024) {
        if (listpeer.length == 1) {
          this.peerW = 1080
          this.peerH = 600
        } else if (listpeer.length <= 4) {
          this.peerW = 540
          this.peerH = 300
        }else {
          this.peerW = 360
          this.peerH = 200
        }
      } else {
        this.peerW = 360
        this.peerH = 200
      }
    }
  }
}
</script>
<style  scoped>
.pin{
     position: absolute;
    width: 19px;
    height: 1px;
    background: white;
    z-index: 10;
    transform: rotate(-45deg);
    bottom: 7px;
    right: -8px;

}
.pin::after{
      content: '';
    position: absolute;
    width: 22px;
    height: 1px;
    background: white;
    bottom: 5px;
    right: 3px;
}
</style>