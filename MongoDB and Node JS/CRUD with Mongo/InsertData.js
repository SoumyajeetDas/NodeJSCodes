const dbConnect = require('./config.js');

const insertdata = async () => {


    // Insert One Data

    // const result = await (await dbConnect()).insertOne({
    //     name:'Sounak',
    //     lang:'Python',
    //     exp:10
    // });



    //Insert Many Data

    const result = await (await dbConnect()).insertMany(
        [
            {
                name: 'Sounak',
                lang: 'Python',
                exp: 10
            },
            {
                name: 'Rahul',
                lang: 'Java',
                exp: 12
            }
        ]

    );



    if (result.acknowledged) {
        console.log(result);
    }
    else {
        console.log("Cannot be inserted");
    }
}

insertdata()