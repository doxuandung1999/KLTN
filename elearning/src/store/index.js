import Vue from 'vue'
import Vuex from 'vuex'
import randomString from '@/utils/randomString'
import { me } from './me'
import { notifications } from './notifications'
import { peers } from './peers'
import { producers } from './producers'
import { room } from './room'
import { dataProducers } from './dataProducers'
import { dataConsumers } from './dataConsumers'
import {consumers} from './consumers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    notify(
      // { state, commit, rootState },
      { commit },
      { type = 'info', text, title, timeout }
    ) {
      if (!timeout) {
        switch (type) {
          case 'info':
            timeout = 3000
            break
          case 'error':
            timeout = 5000
            break
        }
      }

      const notification = {
        id: randomString(6),
        type,
        title,
        text,
        timeout
      }

      commit('notifications/addNotification', notification)

      setTimeout(() => {
        commit('notifications/removeNotification', {
          notificationId: notification.id
        })
      }, timeout)
    }
  },
  modules: {
    me: me,
    notifications: notifications,
    peers: peers,
    producers: producers,
    room: room,
    dataProducers: dataProducers,
    dataConsumers: dataConsumers,
    consumers: consumers
  }
})
