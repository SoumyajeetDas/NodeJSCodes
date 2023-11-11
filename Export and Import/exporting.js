let  f = ()=>{
    console.log("Hi I am function")
}

const obj1 = {
    salary:2000
}

// module.exports={
//     x:2,
//     func:f,
//     y:{
//         name:'Soumyajeet',
//         age:30
//     },
//     obj:obj1

// }

module.exports = function(){
    console.log("Exported");
}

// module.exports = "Soumyajeet"
