const { kafka } = require("./client");


async function init(){
    const admin = kafka.admin();
    console.log ('admin coonnecting ...')

    await admin.connect();
    console.log('admin connected');

    await admin.createTopics({
        topics: [{
            topic: 'rider-updates',
            numPartitions: 2,
            replicationFactor: 1
        }]
    });
    console.log('topic created:rider-updates');

    await admin.disconnect();
    console.log('admin disconnected');

    return admin;
}

init ();


