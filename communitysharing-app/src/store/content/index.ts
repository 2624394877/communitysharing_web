import { defineStore } from 'pinia'

export const useContentStore = defineStore('content', {
  state: () => ({
    hasData: true
  }),
  actions: {
    setHasData(hasData: boolean) {
        this.hasData = hasData
    },
    getHasData() {
        return this.hasData
    },
  },
})