<template>
  <header class="header" :class="{ min: min }">
    <a :class="{ a: true, min: min }" @click.prevent="$emit('toggleSize')">
      <i class="i"></i>
    </a>
    <TheHeaderNav />
    <!-- {{ messages }} -->
  </header>
</template>
<script>
import TheHeaderNav from "./TheHeaderNav.vue";
// import { HubConnectionBuilder } from "@microsoft/signalr";
export default {
  props: { min: { type: Boolean, required: true } },

  components: { TheHeaderNav },
  data() {
    return {
      messages: [], //Return message
      connection: null,
    };
  },
  async mounted() {
    // const a = await POSTToServer("/hub/negotiate?negotiateVersion=1").then(
    //   (resp) => resp.json()
    // );
    // // const { connectionToken } = a;
    // console.log(a);
    // let connection = new HubConnectionBuilder().withUrl("/hub").build();
    // connection.on("notify", (data) => {
    //   console.log(data);
    // });
    // connection.start();
    // console.log(connection);
    // let url = `wss://localhost:8080/hub?id=${connectionToken}`;
    // this.connection = new WebSocket(url);
    // this.connection.onopen = function (event) {
    //   console.log(event, "open");
    // };
    // this.connection.onmessage = function (event) {
    //   console.log(event);
    // };
    // this.connection.onerror = function (event) {
    //   console.log(event);
    // };
    // this.connection.onclose = function (event) {
    //   console.log(event);
    // };
    // console.log(this.connection);
    // this.connection.addEventListener("message", (data) => {
    //   console.log(data);
    // });
  },

  methods: {},
};
</script>
