<template>
  <div class="settings">
    <ul class="set-ul">
      <Loader v-if="loading" />
      <Dropdown />
      <Notification :icon="'icon-bullhorn'" />
      <Notification :icon="'icon-bell'" />

      <li class="set">
        <a href="/profile.aspx" @click.stop class="username">Administrator</a>
      </li>
      <li class="set">
        <a class="link" href="/iaa/logout.aspx" @click.stop>
          <i class="exit"></i>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
import Dropdown from "./Elements/Dropdown.vue";
import Notification from "./Elements/Notification.vue";
import Loader from "../../Main/shared/Loader.vue";
export default {
  computed: {
    loading() {
      const { $store } = this;
      return $store.state.loadingPage;
    },
  },

  components: {
    Dropdown,
    Notification,
    Loader,
  },
};
</script>
