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
        {keyValue:/^6(011|4[4-9]|5)/,name:'Discover',maxlength:19},
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
      self.indexType = self.creditType.findIndex(function(item){
        return value.match(item.keyValue)
      })
      // 匹配银行卡类型 方法二：用正则
      self.cardMsg.bankName = self.indexType>-1 ? self.creditType[self.indexType].name:''
      self.maxLength = self.indexType>-1 ? self.creditType[self.indexType].maxlength: 19
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
<style lang="stylus" scoped>
@import "../assets/app.styl"
</style>

