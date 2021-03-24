<template>
  <div id="mediasoup-demo-app-container">
    <room
      :display-name="displayName"
      :disable-audio="disableAudio"
      :disable-webcam="disableWebcam"
      v-if="!visiblePreMeet"
    ></room>
    <PreMeet v-if="visiblePreMeet" @joinNow="joinMeetNow" />
  </div>
</template>

<script>

// import axios from 'axios'
import Room from '@/components/Room'
import PreMeet from '@/components/PreMeet'

export default {
  components: {
    Room,
    PreMeet,
  },
  data() {
    return {
      visiblePreMeet: true,
      peerId: '',
      displayName: '',
      disableAudio: false,
      disableWebcam: false,
    }
  },
  beforeMount() {
    // let roomId = this.$route.query.roomId
    // var token = localStorage.getItem('token')
    // if (token !== null && typeof token !== undefined && token !== '') {
    //   var reqContent = {
    //     method: 'get',
    //     url: `${this.$axios.defaults.baseURL}intergrates/authen`,
    //     headers: {
    //       Authorization: "Bearer " + token,
    //       'Content-Type': 'application/json',
    //     },
    //   }
    //   axios(reqContent)
    //     .then((result) => {
    //       if (result.status == 200) {
          
    //       } else {
    //         this.$router.push({name: 'login',  query: { roomId: roomId}})
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //       this.$router.push({name: 'login',  query: { roomId: roomId}})
    //     })
    // } else {
    //   this.$router.push({name: 'login',  query: { roomId: roomId}})
    // }
  },
  methods: {
    joinMeetNow(obj) {
      this.displayName = obj.displayName

      this.disableAudio = !obj.useMicro

      this.disableWebcam = !obj.useCamera

      this.visiblePreMeet = false
    },
  },
}
</script>
