const state = {
  casparcg: [],
  'media-scanner': []
}

const maxRows = 500

const mutations = {
  LOG_LINE (state, {id, data}) {
    state[id].push(data)

    if (state[id].length > maxRows) {
      state[id].splice(0, state[id].length - maxRows)
    }
  },

  LOG_CLEAR (state, {id}) {
    state[id].splice(0)
  }
}

const actions = {
  logLine ({ commit }, {id, data}) {
    // do something async
    commit('LOG_LINE', {id, data})
  },
  logClear ({ commit }, data) {
    commit('LOG_CLEAR', data)
  }
}

export default {
  state,
  mutations,
  actions
}
