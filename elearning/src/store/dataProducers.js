export const dataProducers = {
  namespaced: true,
   state : () => ({
    dataProducers: []
  }),
  
   mutations : {
    setRoomState(state, payload) {
      if (payload.state === 'closed') {
        state.dataProducers = []
      }
    },
  
    addDataProducer(state, payload) {
      const { dataProducer } = payload
      state.dataProducers.push(dataProducer)
    },
  
    removeDataProducer(state, payload) {
      const { dataProducerId } = payload
      state.dataProducers = state.dataProducers.filter(
        (consumer) => consumer.id !== dataProducerId
      )
    }
  }
  
}
