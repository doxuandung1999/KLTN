<template>
  <div class="detail-meet">
    <div>
      <div class="text-right-bar">Chi tiết cuộc họp</div>
      <!-- tab -->
      <div class="tabs">
        <div
          class="people flex-c-m tab-item"
          v-bind:class="{ 'tab-active': tabSelected == tab.People }"
          @click="tabSelected = tab.People"
        >
          <span class="mr-2" >
            <font-awesome-icon :icon="['fas', 'user']"  />
          </span>
          Mọi người ({{ listParticipant.length }})
        </div>
        <!-- <div
          class="chat flex-c-m tab-item"
          v-bind:class="{ 'tab-active': tabSelected == tab.Chat }"
          @click="tabSelected = tab.Chat"
        >  <span class="mr-2">
          <font-awesome-icon :icon="['fas', 'comments']" />
          </span>
          Trò chuyện ({{ listMessage.length }})
        </div> -->
        <div
          class="chat flex-c-m tab-item"
          v-bind:class="{ 'tab-active': tabSelected == tab.File }"
          @click="tabSelected = tab.File"
        >
          <span class="mr-2">
            <font-awesome-icon :icon="['fas', 'file']" />
          </span>
          Tệp tin ({{ listFile.length }})
        </div>
      </div>
    </div>
    <!-- nội dung tab -->
    <div class="content-tab">
      <!-- tab người tham gia -->
      <div class="people-tab" v-if="tabSelected == tab.People">
        <!-- <div class="add-user" @click="addUser()">
          <div class="item-circle flex-c-m">
            <font-awesome-icon :icon="['fas', 'user-plus']" />
          </div>

          <div style="font-size: 14px">Thêm người</div> -->
        <!-- </div> -->
        <div class="list-user">
          <div
            class="user-item"
            v-for="user in listParticipant"
            :key="user.id"
          >
            <div class="avt flex-c-m">
              <img :src="avatar" alt="" />
            </div>
            <div class="full-name">{{ user.displayName }}</div>
          </div>
        </div>
      </div>
      <!-- tab file -->
      <div class="file-tab" v-if="tabSelected == tab.File">
        <div class="add-file">
          <font-awesome-icon :icon="['fas', 'plus']" />
          Thêm tệp tin
          <input
            type="file"
            id="file"
            ref="file"
            v-on:change="handleFileUpload()"
          />
        </div>
        <div class="list-file">
          <div class="file-item" v-for="file in listFile" :key="file.FileID">
            <div class="file-author">{{ file.AuthorName }}</div>
            <div class="file-name">
              <a class="mr-3 mb-1 pointer" :href="'https://' + this.hostname + file.url">
                <font-awesome-icon :icon="['fas', 'download']" />
              </a>

              <div class="name" :title="file.FileName">{{ file.url }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- tab chat -->
      <div class="chat-tab" v-if="tabSelected == tab.Chat">
        <template v-if="!loadingMessage">
          <div
            class="chat-item"
            v-for="message in listMessage"
            :key="message.Name"
          >
            <div class="chat-by">
              <div class="chat-name">{{ message.Name }}</div>
              <div class="chat-time">{{ message.ChatTime }}</div>
            </div>
            <div class="chat-content" v-html="message.Value"></div>
          </div>
        </template>
        <!-- loading -->
        <template v-if="loadingMessage">
          <div class="chat-loading">
            <div class="loading-name gradient"></div>
            <div class="loading-content gradient" style="width: 100%"></div>
          </div>
          <div class="chat-loading">
            <div class="loading-name gradient"></div>
            <div class="loading-content gradient"></div>
          </div>
          <div class="chat-loading">
            <div class="loading-name gradient"></div>
            <div class="loading-content gradient"></div>
          </div>
        </template>
      </div>
    </div>
    <!-- input nhập chat -->
    <div class="form-chat flex-c-m" v-if="tabSelected == tab.Chat">
      <div
        class="input-chat"
        @input="onMessageChange($event.target.innerHTML)"
        contenteditable="true"
        placeholder="Gửi tin nhắn cho mọi người"
      ></div>
      <button class="btn-send">
        <font-awesome-icon
          :icon="['fas', 'paper-plane']"
          @click="sendMessage()"
        />
      </button>
    </div>
    <div class="close" @click="hidenRightBar()">
      <font-awesome-icon :icon="['fas', 'times']" />
    </div>
  </div>
</template>

<script>
// import fakeAvt from '../assets/images/avt.jpg'

import { hostname } from '@/utils/urlFactory'
import UrlParse from 'url-parse'
// import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'DetailMeet',
  props: {
    tabSelectedProp: Number,

    roomClient: {
      type: Object,
      required: true
    }
  },
  computed: {
    listFile() {
      return this.$store.state.notifications.files
    },
    urlParser(){
      return new UrlParse(window.location.href, true)
    },
    listParticipant() {
      let peers = JSON.parse(JSON.stringify(this.$store.state.peers.peers))
      peers.push({  id: this.$store.state.me.id, displayName: this.$store.state.me.displayName })
      return peers
    }
  },
  data() {
    return {
      // avatar : fakeAvt,
      avatar : "",
      hostname: hostname,
      tab: {
        Chat: 1,
        People: 2,
        File: 3
      },
      tabSelected: null,
      listMessage: [
        {
          Name: 'Nguyễn Huy Việt1',
          ChatTime: '22:35',
          Value: 'Hello'
        }
      ],
      loadingMessage: false
    }
  },
  mounted() {
    this.tabSelected = this.tabSelectedProp
    this.getMessage()
  },
  methods: {
    getMessage() {
      this.loadingMessage = true
      setTimeout(() => {
        this.loadingMessage = false
      }, 1000)
    },
    // ẩn popup
    hidenRightBar() {
      this.$emit('onHidden')
    },
    // gửi tin nhắn
    sendMessage() {
      // gọi service gửi message
      const newMsg = {
        Name: 'Nguyễn Huy Việt',
        ChatTime: `${new Date().getHours()}:${new Date().getMinutes()}`,
        Value: this.message
      }
      this.listMessage.push(newMsg)
      // this.message = ''
    },
    //
    onMessageChange(value) {
      this.message = value;
      console.log(this.message);
    },

    //thêm user
    addUser() {},

    async handleFileUpload() {
      if (this.$refs.file.files[0]) {
        let roomId = this.urlParser.query.roomId
        const formData = new FormData();

        let  name_parts = this.$refs.file.files[0].name.split(".")
        name_parts[0] = name_parts[0] + "_" + Date.now()
        let file_name = name_parts.join(".").replaceAll(" ", "_")
        formData.append('file', this.$refs.file.files[0], file_name)
        try {
          // let hostname = this.hostname
          // let message = await this.$axios.$post('https://' + hostname + '/rooms/share/' + roomId, formData)
          await this.roomClient.sendBotMessage("@share /download/" + roomId + "/" + file_name)
        }
        catch (e){
          console.log("Error")
        }

      }
    },
    dowloadFile(file) {
      console.log(file);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.chat-loading {
  margin-bottom: 16px;
  .loading-name {
    height: 16px;
    border-radius: 4px;
    width: 160px;
  }
  .loading-content {
    margin-top: 8px;
    height: 16px;
    border-radius: 4px;
    width: 215px;
  }
}
.detail-meet {
  width: 100%;
  height: 100%;
  background: white;
  padding: 16px 0px;
  display: flex;
  flex-direction: column;

  .text-right-bar {
    font-size: 1.125rem;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1.5rem;
    box-flex: 1;
    /* flex-grow: 1; */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /* margin-bottom: 40px; */
    margin-left: 24px;
    height: 36px;
  }

  .tabs {
    display: flex;
    justify-content: center;
    position: relative;
    border-bottom: solid 1px #e0e0e0;
    font-size: 12px;

    .tab-item {
      width: 50%;
      height: 50px;
      font-weight: 500;
      cursor: pointer;
    }

    .tab-item:hover {
      background: rgba(0, 121, 107, 0.039);
    }

    .tab-active::after {
      content: '';
      position: absolute;
      background: #00aff0;
      height: 5px;
      width: 112px;
      top: 46px;
      border-radius: 4px;
    }
  }

  .content-tab {
    flex: 1;
    border-bottom: solid 1px #e0e0e0;
    font-size: 13px;
    .people-tab {
      .add-user {
        height: 60px;
        width: 90px;
        margin: 16px auto;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .add-user:hover {
        background-color: rgba(95, 99, 104, 0.039);
      }

      .list-user {
        height: calc(100vh - 170px);
        overflow-y: auto;
        overflow-x: hidden;
        border-top: solid 1px #e0e0e0;

        .user-item {
          display: flex;
          align-items: center;

          height: 60px;

          .avt {
            height: 100%;
            width: 100px;
            background-color: rgba(95, 99, 104, 0.039);

            img {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              object-fit: cover;
            }
          }

          .full-name {
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 226px;
            overflow: hidden;
            padding-left: 16px;
          }
        }
      }
    }
    .file-tab {
      .add-file {
        padding-top: 17px;
        text-align: center;
        background: #98b5be;
        cursor: pointer;
        position: relative;
        height: 50px;
        color: #ffffff;
        input {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          opacity: 0;
          cursor: pointer;
        }
      }
      .list-file {
        height: calc(100vh - 170px);
        overflow-y: auto;
        overflow-x: hidden;
        .file-item {
          margin-top: 8px;
          border: solid 1px #e0e0e0;
          border-radius: 4px;
          box-shadow: 0 1px 6px -5px;
          padding: 8px;
          .file-author {
            font-weight: 500;
            margin-bottom: 8px;
          }
          .file-name {
            display: flex;
            align-items: center;
            .name {
              text-overflow: ellipsis;
              overflow: hidden;
              padding-bottom: 2px;
              white-space: nowrap;
              width: 100%;
            }
          }
        }
      }
    }
    .chat-tab {
      padding: 8px 24px;

      .chat-item {
        margin-bottom: 16px;
      }

      .chat-by {
        display: flex;

        .chat-name {
          font-weight: 500;
          margin-right: 8px;
        }

        .chat-time {
          font-size: 13px;
          color: grey;
        }
      }

      .chat-content {
        word-break: break-word;
        text-align: left;
      }
    }
  }

  .form-chat {
    height: 75px;

    .input-chat {
      outline: none;
      width: 75%;
      border-bottom: solid 1px #e0e0e0;
      font-size: 13px;
      cursor: text;
    }

    .input-chat:focus {
      border-bottom: solid 2px #00796b;
    }

    .input-chat[contentEditable='true']:empty:not(:focus):before {
      content: attr(placeholder);
      color: grey;
    }

    .input-chat[contentEditable='true']:empty:before {
      content: attr(placeholder);
      color: grey;
    }

    .btn-send {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      border: none;
      background: white;
      color: #00796b;
      margin-left: 12px;
      outline: none;
    }

    .btn-send:hover {
      background-color: rgba(95, 99, 104, 0.039);
    }

    .btn-send:focus {
      background-color: rgba(95, 99, 104, 0.157);
    }
  }

  .close {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
  }
}
</style>
