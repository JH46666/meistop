<template>
  <div>
    <div class="appDiv flex column">
      <div class="flex column j-between">
        <span class="textNameSpan">绑定手机后，可通过手机号登录</span>
        <div class="flex center">
          <button
            v-if="autoPhone"
            class="autoPhone"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
          />
          <input
            v-else
            class="input grow"
            maxlength="11"
            type="number"
            :focus="focusInput"
            :value="form.phoneNumber"
            @input="bindPhoneNumber"
          >
        </div>
      </div>
      <div class="flex column textAdd center">
        <button
          class="lightButton flex center"
          @click="hold"
        >
          继续
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import shareMix from "@/mixins/mixin";
import { promisify } from "@/utils/index";

export default {
  mixins: [shareMix],
  data() {
    return {
      autoPhone: true,
      focusInput: true,
      form: {
        code: "", // 临时授权码
        encryptedData: "", // 加密数据
        iv: "", // 初始向量
        phoneNumber: "", //手机号，
      },
      code: "",
      user: {}
    };
  },
  methods: {
    async getPhoneNumber(e) {
      if (!e.detail.iv) {
        this.autoPhone = false;
        this.focusInput = true;
        return;
      }
      let { iv, encryptedData } = e.detail;
      const session_key = getApp().globalData.sessionkey;
      this.$request
        .post("/user/bind.html", {
          session_key,
          ivstr:iv,
          encryptedData
        })
        .then(res => {
          this.autoPhone = false
          this.form.phoneNumber = res.result.mobile;
          const phoneNumber = this.form.phoneNumber;
            return this.$router.push({
              query: { phoneNumber },
              path: "/pages/bindPhone/detail"
            })
        })
        .catch(err => {
          return wx.showToast({
            title: "获取手机号失败",
            icon: "none"
          });
        });
    },
    bindPhoneNumber(e) {
      this.form.phoneNumber = e.detail.value;
    },
    hold() {
      const { phoneNumber, code } = this.form;
      if (/^1[3|4|5|7|8]\d{9}$/.test(phoneNumber) == false) {
        return wx.showToast({
          icon: "none",
          title: "请输入正确的手机号"
        });
      }
      this.$request.post("/user/bind.html", { mobile: phoneNumber }).then(res => {
        wx.showToast({
          title: "发送成功"
        });
      });
      this.$router.push({
        query: { phoneNumber },
        path: "/pages/bindPhone/detail"
      });
    }
  },
  onShow() {
    const { user } = getApp().globalData;
    this.user = user;
  }
};
</script>
<style lang="less" scoped>
.appDiv {
  margin: 40rpx 40rpx;
  min-height: 90vh;
  background-color: #ffffff;
  padding: 20rpx 0;
}
.text {
  background-color: #ffffff;
  min-height: 600rpx;
  padding: 40rpx;
  color: rgba(189, 189, 192, 1);
}
.textNameSpan {
  color: #4d495b;
  font-size: 32rpx;
  margin-bottom: 16rpx;
  margin-top: 40rpx;
}
.textAdd {
  padding-bottom: 60rpx;
}

.input {
  height: 84rpx;
  padding-left: 20rpx;
  background-color: rgba(189, 189, 192, 0.1);
}
.autoPhone {
  height: 84rpx;
  width: 100%;
  background: rgba(189, 189, 192, 0.1);
  padding-left: 20rpx;
}

button.countdown {
  padding: 0;
  margin: 0;
  font-size: 28rpx;
  color: #bdbdc0;
  background-color: transparent;
}

button.lightButton {
  height: 92rpx;
  font-size: 32rpx;
  padding: 26rpx 102rpx;
}
.towast {
  font-size: 32rpx;
  color: #4d495b;
  margin: 40rpx 0;
  line-height: 46rpx;
}
</style>
