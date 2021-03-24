export const notifications = {
  namespaced: true,
  state : () => ({
    notifications: [],
    files: []
  }),

  ShareFileMessageRegex : new RegExp('^(.*) "@share (.*)"'),

  mutations : {
    addNotification(state, payload) {
      const notification = payload

      let text = payload.text
      const match = this.ShareFileMessageRegex.exec(text)

      if (match) {
        let parts = payload.text.split(" ")

        let url = parts[parts.length - 1]
        url = url.substring(0, url.length - 1)
        let file = {
          "AuthorName": parts[0],
          "url": url
        }
        state.files.push(file)
      }
      else {
        state.notifications.push(notification)
      }
    },

    removeNotification(state, payload) {
      const { notificationId } = payload

      state.notifications = state.notifications.filter(
        (notification) => notification.id !== notificationId
      )
    },

    removeAllNotifications(state) {
      state.notifications = []
    }
  }

}
