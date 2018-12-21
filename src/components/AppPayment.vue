<template>
  <div class="appPayment">
    <div>
      <div class="card-box">
        <div class="card-container">
          <transition name="move" type="animation">
          <div class="card card-forward" v-show="!turn" :class="{'fontColor':indexType==2 || indexType==4}">
            <div class="card-background" :class="backColor"></div>
            <div class="card-chip alpha"></div>
            <div class="card-number alpha" :class="{'active':index ==1,'mixfont':fleg}" >{{cardNumber | filterA(maxLength)}}</div>
            <div class="card-issuer alpha">{{cardMsg.bankName}}</div>
            <div class="card-name alpha" :class="{'active':index == 2}" >{{cardMsg.name | filterB}}</div>
            <div class="card-ecpiry alpha" :class="{'active':index ==3}" >
              <div>valid thru</div>
              <div>{{cardValid | filterC}}</div>
            </div>
          </div>
          </transition>
          <transition name="moveBack" type="animation">
          <div class="card card-back" v-show="turn" >
            <div class="card-background" :class="backColor"></div>
            <div class="card-stripe"></div>
            <div class="card-signature"></div>
            <div class="card-cvc">{{cardMsg.cvc}}</div>
            <div class="card-issuer">{{cardMsg.bankName}}</div>
          </div>
          </transition>
        </div>
      </div>
    </div>
    <form class="form-style" action="post">
      <div class="form-group">
        <input type="tel" name="number" :value="cardNumber" @input="changeNumber" class="form-control" placeholder="Card Number" pattern="[\d| ]{16,22}" :maxlength="maxLength" @focus="turn = false; index = 1" @keydown="limit" required/>
        <small>E.g.: 49..., 51..., 36..., 37...</small>
      </div>
      <div class="form-group">
        <input type="text" name="name" v-model="cardMsg.name" class="form-control" placeholder="Name" @focus="turn = false; index = 2" required />
      </div>
      <div class="row">
        <div class="col-6">
          <input type="tel" name="expiry" :value="cardValid" @input="changeValid" class="form-control" placeholder="Valid Thru" pattern="\d\d/\d\d" maxlength="5"  @focus="turn = false; index=3" required />
        </div>
        <div class="col-6">
          <input type="tel" name="cvc" v-model="cardMsg.cvc" class="form-control" placeholder="CVC" pattern="\d{3,4}" maxlength="4" @focus="turn = true;index=4" required />
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-primary btn-block" >PAY</button>
      </div>
    </form>
    <div class="reslut-submit" v-show="isShow">
      <div>number: {{cardMsg.number}}</div>
      <div>name: {{cardMsg.name}}</div>
      <div>cvc: {{cardMsg.cvc}}</div>
      <div>valid thru: {{cardMsg.validThru}}</div>
      <div>issuer: {{cardMsg.bankName}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppPayment',
  data(){
    return{
      cardMsg:{
        name:'',
        number:'',
        cvc:'',
        validThru:'',
        bankName:''
      },
      cardNumber:'',
      cardValid:'',
      turn:false,
      fleg: false,
      isShow: false,
      index: 0,
      creditType:[
        {keyValue:/^4/,name:'VISA',maxlength:22 },
        {keyValue:/^5[1-5]/,name:'mastercard',maxlength: 22},
        {keyValue:/^36/,name:'Diners Club',maxlength: 16},
        {keyValue:/^3(4|7)/,name:'American Express',maxlength: 17},
        {keyValue:/^6(011|4[4-9]+|5)/,name:'Discover',maxlength:19},
        {keyValue:/^60/,name:'Hipercard',maxlength: 22},
        {keyValue:/^62/,name:'银联',maxlength: 22},
      ],
      indexType: -1,
      maxLength: 19,
      numberType: ''
    }
  },
  computed:{
    backColor(){
      return{
        bgColor0: this.indexType ==0,
        bgColor1: this.indexType ==1, 
        bgColor2: this.indexType ==2,
        bgColor3: this.indexType ==3, 
        bgColor4: this.indexType ==4,
        bgColor5: this.indexType ==5, 
        bgColor6: this.indexType ==6,
      }
    }
  },
  methods:{
    changeNumber:function(){
      let self = this
      let value = event.target.value
      self.cardMsg.number = value
      // 匹配银行卡类型 方法一：笨拙
      // self.indexType = self.creditType.findIndex(function(item){
      //   return item.keyValue.some((key)=>value.indexOf(key)==0)
      // })
      self.indexType = self.creditType.findIndex(function(item){
        // console.log(value.match(item.keyValue))
        return value.match(item.keyValue)
      })
      // 匹配银行卡类型 方法二：用正则
      self.cardMsg.bankName = self.indexType>-1 ? self.creditType[self.indexType].name:''
      self.maxLength = self.indexType>-1 ? self.creditType[self.indexType].maxlength: 19
      // console.log(self.maxLength)
      // 在此已经知道了卡的类型，那么定义一个变量，让该变量根据maxlength的值，展示number，例如36:•••• •••••• ••••
      if(self.maxLength==16 || self.maxLength==17){
        self.cardNumber = value.replace(/\s/g,'').replace(/(\d{4})(?=\d)/,'$1 ').replace(/(\d{6})(?=\d)/,'$1 ')
      }
      if(self.maxLength== 18 || self.maxLength==19){
        self.cardNumber = value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
      }
      if(self.maxLength==20 || self.maxLength==21 || self.maxLength==22){
        self.cardNumber = value.slice(0,19).replace(/\s/g,'').replace(/(\d{4})(?=\d)/g, '$1 ')+value.slice(19)
      }
      // 设置number的font-size大小
      self.fleg= self.cardNumber.length>19 ? true: false
    },
    changeValid:function(){
      let self = this
      self.cardMsg.validThru = event.target.value
      self.cardValid = self.cardMsg.validThru.replace(/[\s/]/g, '').replace(/(\d{2})(?=\d)/,'$1/')
    },
    limit:function(event){
      // 只允许输入数字
      if(event.keyCode == 46 || event.keyCode == 8){
        return true
      }
      if(!(event.keyCode==46)&&!(event.keyCode==8)&&!(event.keyCode==37)&&!(event.keyCode==39)){
        if(!((event.keyCode>=48 && event.keyCode<=57)||(event.keyCode>=96 && event.keyCode<=105))){
          event.returnValue = false
        }
      }
    }
  },
  filters:{
    filterA:function(number,length){
      if(!number) return '•••• •••• •••• ••••'
      var def='•••• •••• •••• ••••'
      if(length == 16) def = '•••• •••••• ••••'
      if(length == 17) def = '•••• •••••• •••••'
      if(length == 18) def = '•••• •••••• ••••••'
      if(number.length > 19 ){
        def = '•••• •••• •••• •••••••'
      }
      let value = number + def.slice(number.length)
      return value
    },
    filterB:function(name){
      if(!name) return 'YOUR NAME HERE'
      return name
    },
    filterC:function(thru){
      if(!thru) return '••/••'
      let def = '••/••'
      let value = thru + def.slice(thru.length)
      return value
    }
  }
}
</script>
<style lang="stylus">
$backColor0 = linear-gradient(25deg, #0f509e, #1399cd) !important
$backColor1 = linear-gradient(25deg, #f37b26, #fdb731) !important
$backColor2 = linear-gradient(25deg, #fff, #eee) !important
$backColor3 = linear-gradient(25deg, #308c67, #a3f2cf) !important
$backColor4 = linear-gradient(25deg, #8b181b, #de1f27) !important
$backColor5 = linear-gradient(25deg, #939393, #717171) !important
@keyframes turnForward{
  0%{
    transform rotateY(-180deg)
  }
  100%{
    transform rotateY(0deg)
  }
}
@keyframes turnBack{
  0%{
    transform rotateY(0deg)
  }
  100%{
    transform rotateY(-180deg)
  }
}
@keyframes turnBack2{
  0%{
    transform rotateY(180deg)
  }
  100%{
    transform rotateY(0deg)
  }
}
@keyframes turnForward2{
  0%{
    transform rotateY(0deg)
  }
  100%{
    transform rotateY(180deg)
  }
}
@keyframes myfirst{
  0%{
    left -170%
  }
  100%{
    left -30%
  }
}
.mixfont{
  font-size 17px !important
}
.fontColor
  color #555 !important
.bgColor0
  background $backColor0
  animation myfirst 0.5s
.bgColor1
  background $backColor1
  animation myfirst 0.5s
.bgColor2
  background $backColor2
  animation myfirst 0.5s
.bgColor3
  background $backColor3
  animation myfirst 0.5s
.bgColor4
  background $backColor2
  animation myfirst 0.5s
.bgColor5
  background $backColor4
  animation myfirst 0.5s
.bgColor6
  background $backColor5
  animation myfirst 0.5s
.active
  font-weight 700
  opacity 1 !important
.card-background
  position relative 
  height 200%
  width 150%
  top -60%
  left -30%
  transform rotate(25deg)
.appPayment
  padding 30px
  .card-box 
    width 290px
    perspective 1000px
    margin 0 auto
  .card-container
    width 290px
    height 183px
    margin 0 auto
    position relative
    transition all .4s linear 
    .card
      height 100%
      width 100%
      background linear-gradient(25deg, #999, #999)
      border-radius 15px
      position absolute
      top 0
      left 0
      color #fff
      overflow hidden
      backface-visibility hidden
    .card-forward
      z-index 20
      transform rotateY(0deg)
      &.move-enter-active
        animation turnForward .8s
      &.movel-enter, &.move-leave-active
        animation turnBack .8s
      .card-chip
        font-size 20px
        left 10%
        top 10%
        width 36px
        height 25px
        background midnightblue
      .card-number 
        left 10%
        top 45%
        font-size 20px
      .card-issuer
        top 10%
        right 10%
        width 40%
        height 23%
        font-size 20px
        text-align center
      .card-name
        font-size 17px 
        left 10%
        bottom 15%
        width 60%
        overflow hidden
        text-overflow ellipsis
        text-transform uppercase
      .card-ecpiry 
        right 10%
        bottom 15%
        font-size 10px
      .alpha
        font-family Consolas, Courier, monospace
        opacity 0.5
        position absolute
        transition opacity 0.3s
    .card-back
      z-index 10
      transform rotateY(0deg)
      &.moveBack-enter-active,&.moveBack-leave
        animation turnBack2 .8s
      &.moveBack-leave-active,&.moveBack-enter 
        animation turnForward2 .8s
      .card-stripe
        background-color #2a1d16
        height 22%
        left 0
        position absolute
        top 9%
        width 100%
      .card-signature
        background repeating-linear-gradient(0.1deg, #fff 20%, #fff 40%, #fea 40%, #fea 44%, #fff 44%)
        height 18%
        left 5%
        position absolute
        top 35%
        width 75%
      .card-cvc
        color #222
        font-size 14px
        left 67%
        line-height 1
        position absolute
        top 42%
      .card-issuer
        position absolute
        background-position bottom center
        bottom 5%
        left 50%
        opacity 0.6
        right auto
        top auto
        font-size 30px
        width 60%
        text-align center
        -webkit-transform translateX(-50%)
        transform translateX(-50%)
  .form-style
    margin 30px auto 0
    max-width 400px
    .form-group
      margin-bottom 1rem
    .form-control
      width 100%
      display block
      font-size 1rem
      line-height 1.25
      color #495057
      padding .5rem .75rem
      border 1px solid rgba(0,0,0,.15)
      border-radius .25rem
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
    .row
      display flex
      justify-content space-between
      .col-6
        flex 0 0 45%
        max-width 50%
    .form-actions
      margin-top 15px
      .btn
        display inline-block
        font-weight 400
        text-align center
        white-space nowrap
        vertical-align middle
        -webkit-user-select none
        -moz-user-select none
        -ms-user-select none
        user-select none 
        padding .5rem .75rem
        font-size 1rem
        line-height 1.25
        border-radius .25rem
        transition all .15s ease-in-out
      .btn-primary
        color #ffffff
        background-color #007bff
        border 1px solid #007bff
        &:hover
          background-color #0069d9
          border-color #0069d9
      .btn-block
        display block
        width 100%
  .reslut-submit
    padding-top 20px
    max-width 300px
    margin 0 auto
    font-size 18px
</style>

