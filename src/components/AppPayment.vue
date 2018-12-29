<template>
  <div class="appPayment">
    <div>
      <div class="container">
        <div class="credit">
            <div class="credit__card" :class="[backColor,flipped]">
              <div class="credit__card--front">
                <div class="credit__card__background"></div>
                <div class="credit__card__chip"></div>
                <div class="credit__card__number" :class="{'credit__card--focus':turnFocus == 1,'credit__number--large':isLarge==true}">{{cardNumber|filterNum(defaultStyle[maxLength])}}</div>
                <div class="credit__card__issuer">{{cardMsg.bankName}}</div>
                <div class="credit__card__name" :class="{'credit__card--focus':turnFocus == 2}">{{cardMsg.userName|filterUser}}</div>
                <div class="credit__card__expiry" :class="{'credit__card--focus':turnFocus == 3}">
                  <div>valid thru</div>
                  <div>{{cardValid|filterThru}}</div>
                </div>
              </div>
              <div class="credit__card--back">
                <div class="credit__card__background"></div>
                <div class="credit__card__stripe"></div>
                <div class="credit__card__signature"></div>
                <div class="credit__card__cvc" :class="{'credit__card--focus':turnFocus == 4}">{{cardMsg.cvc}}</div>
                <div class="credit__card__issuer">{{cardMsg.bankName}}</div>
              </div>
            </div>
        </div>
        <form class="formStyle">
          <div class="form-group">
            <input type="tel" name="number" class="form-control" :value="cardNumber" @input="changeStyle" placeholder="Card Number" pattern="[\d| ]{16,22}" @focus="turnFocus = 1,isFlipped = false" @keydown="limitInput" required/>
            <small>E.g.: 49..., 51..., 36..., 37...</small>
          </div>
          <div class="form-group">
            <input type="text" name="userName" class="form-control" placeholder="Name" v-model="cardMsg.userName" @focus="turnFocus = 2,isFlipped = false" required/>
          </div>
          <div class="row">
            <div class="col-6">
              <input type="tel" name="expiry" class="form-control" placeholder="Valid Thru" pattern="\d\d/\d\d" maxlength="5" :value="cardValid"  @focus="turnFocus = 3,isFlipped = false" @input="changeValid" required>
            </div>
            <div class="col-6">
              <input type="tel" name="cvc" class="form-control" placeholder="CVC" pattern="\d{3,4}" maxlength="4" v-model="cardMsg.cvc" @focus="turnFocus = 4,isFlipped = true" required>
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-primary btn-block">PAY</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppPayment',
  data(){
    return{
      isFlipped: false,
      isLarge: false,
      cardMsg:{},
      cardNumber:'',
      cardValid:'',
      maxLength: 19,
      turnFocus:0,
      indexType: -1,
      creditType:[
        {
          id: 0,
          keyValue:/^4/,
          name:'VISA',
          type:'visa',
          valid_length:[13,19],
          maxLength: 19,
          back: ''
        },
        {
          id: 1,
          keyValue:/^(5[1-5]|22(2[1-9]|[3-9])|2[3-6]\d|27([0-1]\d|20))/,
          name:'mastercard',
          type:'mastercard',
          valid_length:[16],
          maxLength: 16,
        },
        {
          id: 2,
          keyValue:/^36/,
          name:'Diners Club international',
          type:'dinersclub',
          valid_length:[14],
          maxLength:14,
        },
        {
          id: 3,
          keyValue:/^3(4|7)/,
          name:'American Express',
          type:'amex',
          valid_length:[15],
          maxLength: 15,
        },
        {
          id: 4,
          keyValue:/^6(011|4[4-9]|5|22(1(2[6-9]|[3-9]\d)|[2-8]\d\d|9([0-1]\d|2[0-5])))/,
          name:'Discover',
          type:'discover',
          valid_length:[16],
          maxLength: 16,
        },
        {
          id: 5,
          keyValue:/^30[0-5]/,
          name:'Diners Club carte blanche',
          type:'dinersclub',
          valid_length:[14],
          maxLength: 14,
        },{
          id: 6,
          keyValue:/^35(2[8-9]|[3-7]\d|89)/,
          name: 'JCB',
          type:'jcb',
          valid_length: [16],
          maxLength: 16,
          back:''
        },{
          id: 7,
          keyValue:/^6(304|706|709|771)/,
          name:'laser',
          type:'laser',
          valid_length:[16,19],
          maxLength: 19,
        },{
          id: 8,
          keyValue:/^4(026|17500|508|844|913|917)/,
          name:'visa electorn',
          type:'visa',
          valid_length:[16],
          maxLength: 16,
        },{
          id: 9,
          keyValue:/^5019/,
          name:'Dankort',
          type:'dankort',
          valid_length:[16],
          maxLength: 16,
        },{
          id: 10,
          keyValue:/^(50|5[6-9]|6\d)/,
          name:'maestro',
          type:'maestro',
          valid_length:[12,19],
          maxLength: 19,
        },{
          id: 11,
          keyValue:/^1/,
          name:'uatp',
          type:'uatp',
          valid_length:[15],
          maxLength: 15,
        }
      ],
      defaultStyle:{
        14:'•••• •••••• ••••',
        15:'•••• •••••• •••••',
        16:'•••• •••• •••• ••••',
        17:'•••• •••• •••• •••••',
        18:'•••• •••• •••• ••••••',
        19:'•••• •••• •••• •••••••',
      }
    }
  },
  computed:{
    backColor(){
      return this.indexType>-1 ? 'credit__card--'+this.creditType[this.indexType].type : 'credit__card--unknown'
    },
    flipped(){
      return this.isFlipped?'credit__card--flipped':''
    }
  },
  methods:{
    changeStyle:function(e){
      // 更改卡号的样式
      let self = this
      let value = e.target.value
      self.cardMsg.number = value.replace(/\s/g,'')
      self.indexType = self.determine(self.cardMsg.number)
      self.cardMsg.bankName = self.indexType>-1 ? self.creditType[self.indexType].name : ''
      self.maxLength = self.indexType>-1 ? self.creditType[self.indexType].maxLength : 19
      // 根据卡的长度maxLength，cardNumber不同
      if(self.maxLength == 14 || self.maxLength==15){
        self.cardNumber = self.cardMsg.number.replace(/(\d{4})(?=\d)/,'$1 ').replace(/(\d{6})(?=\d)/,'$1 ')
      }
      if(self.maxLength == 16){
        self.cardNumber = self.cardMsg.number.replace(/(\d{4})(?=\d)/g, '$1 ')
      }
      if(self.maxLength == 17 || self.maxLength == 18 || self.maxLength == 19){
        self.cardNumber = self.cardMsg.number.slice(0,16).replace(/(\d{4})(?=\d)/g, '$1 ')+self.cardMsg.number.slice(16)
      }
      // 
      self.isLarge = self.cardMsg.number.length>16 ? true:false
    },
    determine:function(value){
      // 判断银行卡类型
      return this.creditType.findIndex(function(item){
        return value.match(item.keyValue)
      })
    },
    changeValid:function(){
      // 更改日期的样式
      let self = this
      self.cardMsg.validThru = event.target.value.replace(/[\s/]/g, '')
      console.log(self.cardMsg.validThru)
      self.cardValid = self.cardMsg.validThru.replace(/(\d{2})(?=\d)/,'$1/')
    },
    limitInput:function(){
      // 限制只能输入数字
      if(event.keyCode == 46 || event.keyCode == 8){
        return true
      }
      if(!(event.keyCode==46)&&!(event.keyCode==8)&&!(event.keyCode==37)&&!(event.keyCode==39)){
        if(!((event.keyCode>=48 && event.keyCode<=57)||(event.keyCode>=96 && event.keyCode<=105))){
          event.returnValue = false
        }
      }
      // 限制输入的长度
      if(event.target.value.replace(/[\s/]/g, '').length>=this.maxLength){
        event.returnValue = false
      }
    }
  },
  filters:{
    filterNum:function(number,value){
      if(!number) return '•••• •••• •••• ••••'
      let def = value
      let length = number.length>19? '22':19
      return number + def.slice(number.length,length)
    },
    filterUser:function(name){
      if(!name) return 'YOUR NAME HERE'
      return name
    },
    filterThru:function(thru){
      if(!thru) return '••/••'
      let def = '••/••'
      let value = thru + def.slice(thru.length)
      return value
    }
  }
}
</script>
<!-- 使用 BEM 约定 -->
<style lang="stylus">
@import '../css/app.styl'
</style>
