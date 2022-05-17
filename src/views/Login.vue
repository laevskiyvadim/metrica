<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="logo-wrapper">
          <span class="logo"></span>
        </div>
        <div class="footer">
          <div class="validation">
            <ul>
              <li>You must enter login, email or phone.</li>
              <li>You must enter password.</li>
            </ul>
          </div>
          <form @submit.prevent method="post">
            <input
              class="form-control"
              id="login"
              placeholder="LOGIN"
              type="text"
              v-model="login"
            />
            <input
              class="form-control input-validation-error"
              id="pass1"
              placeholder="PASSWORD"
              type="password"
              v-model="pass"
            />

            <div class="buttons">
              <input
                type="submit"
                value="SIGN IN"
                class="sign-in-btn"
                @click="sendForm"
              />
              <input
                type="hidden"
                name="__RequestVerificationToken"
                :value="RequestVerificationToken"
              />
              <a placement="left" class="sign-in-btn">
                <img src="/image/public/face.png" alt="facebook" />
                Login with Facebook
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      login: "",
      pass: "",
      authType: "default",
      RequestVerificationToken: "1",
    };
  },
  mounted() {
    this.__RequestVerificationToken = "1";
  },

  methods: {
    sendForm: function () {
      const { login, pass, authType, $store } = this;
      if (login && pass) {
        $store.dispatch("signIn", {
          login,
          pass,
          authType,
          __RequestVerificationToken:
            "CfDJ8BeiDxnZl6RAn32fCvOnE331RvCcR8wK7xOcJlYJ1Tu3iq3ZXkDD3X83--Ic4wqrhSxeHz7eg4vnhJmZKoSdhhT4uEVtQE-S7zAs97noMU0SgGDRxoW707R0VnwxaVsPS67BlMbAS4VGRedxAorK8yE",
        });
      }
    },
  },
};
</script>
<style scoped>
.sign_in1 {
  background: white;
  background-size: cover;
  display: block;
  height: 540px;
  padding-top: 20px;
}
.container {
  width: 500px;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}
.container::before {
  display: table;
  content: " ";
}
.container::after {
  clear: both;
  display: table;
  content: " ";
}
.row {
  outline: none;
  position: relative;
  margin-right: -15px;
  margin-left: -15px;
}
.logo-wrapper {
  margin-top: 100px;
  text-align: center;
}

.logo {
  background: url("/assets/logo-sign-in-mini.png");
  width: 250px;
  height: 112px;
  display: inline-block;
}
.footer {
  position: relative;
  min-height: 1px;
  padding-right: 15px;
  padding-left: 15px;
  margin-left: 0;
  text-align: center;
  margin-top: 60px;
}
.footer form {
  margin: 0 0 46px 0;
}
.form-control {
  display: block;
  padding: 6px 12px;
  line-height: 1.42857143;
  border: 1px solid #ccc;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  font-family: "Fira Sans Condensed", sans-serif;
  background: #fff;
  border-bottom: 1px dashed #d0dde9;
  border-left: 0 none;
  border-radius: 0px;
  border-right: 0 none;
  border-top: 0 none;
  box-shadow: none;
  font-size: 20px;
  height: 35px;
  margin: 10px auto;
  margin-top: 4px;
  width: 85%;
}
input {
  outline: none;
}
ul {
  color: maroon;
  margin-left: 0;
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 10px;
}
li {
  list-style-type: none;
}
.buttons {
  margin-top: 50px;
}
.sign-in-btn {
  border: 0 none;
  border-radius: 3px;
  color: #fff;
  font-size: 15px;
  padding: 8px 18px;
  text-transform: uppercase;
  cursor: pointer;
  margin-left: 5px;
  background: linear-gradient(45deg, #260075, #5d0086);
  transition: background linear 0.2s, box-shadow linear 0.2s;
}
.sign-in-btn:hover {
  background: linear-gradient(45deg, #4a0acef5, #5d0086d4);
}
img {
  height: 16px;
  vertical-align: -3px;
  margin-right: 6px;
}
@media (min-width: 1200px) {
  .container {
    width: 940px;
  }
}
@media (min-width: 1200px) {
  .container {
    width: 1170px;
  }
}
@media (min-width: 992px) {
  .container {
    width: 970px;
  }
  .footer {
    float: left;
    width: 100%;
  }
}
@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}
</style>
