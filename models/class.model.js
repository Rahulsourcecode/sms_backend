const mongoose = require('mongoose');

const classSchema = mongoose.Schema({
  name: {
    type: Number,
    unique:true,
    required: true,
  },
  division:{
    type:String,
    default:"A",
  },
  strength:{
    type:Number,
    default:0,
  },
  student:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student',

  }]
})

classSchema.methods.inc = async function() { 
    if(this.strength%10 ===0){
    this.division=String.fromCharCode(this.division.charCodeAt(0)+1)
    console.log("inc"+this.division)
    await this.save()
  }
}

const Myclass = mongoose.model('class', classSchema);

module.exports = { Myclass }
