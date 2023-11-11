const dbConnect = require('./config');


// Deeleting One data without using async await.
function deletedata(){
    dbConnect().then((resp)=>{
        resp.deleteOne({name:'Sounak'}).then((result)=>{
            if(result.acknowledged && result.deletedCount>0){ //If the cond does not gets matched and nothing gets matched then 
                                                            //also it will return acknowledged: true but the deletedCount:0
                                                            //and that will help to identify that cond. is not matched and so no deletion happened.
                console.log(result);
            }
            else{
                console.log("Data Cannot be Deleted")
            }
        })
    })

}


// Deleting Many Data with async/await

// const deletedata = async()=>{
//     let result = await (await dbConnect()).deleteMany({name:'Rahul'})

//     if(result.acknowledged){
//         console.log(result);
//     }
//     else{
//         console.log("Data Deleted");
//     }
// }

deletedata();