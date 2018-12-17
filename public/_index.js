// init firebase
var config = {
    apiKey: "AIzaSyA21oDEZt1A6rJ6Bpov4-vB80ah3rRotYk",
    authDomain: "toiletalarm-e06b4.firebaseapp.com",
    databaseURL: "https://toiletalarm-e06b4.firebaseio.com",
    projectId: "toiletalarm-e06b4",
    storageBucket: "toiletalarm-e06b4.appspot.com",
    messagingSenderId: "965770177483"
};
firebase.initializeApp(config);

// reset data
resetdata(0,'main');
resetdata(1,'new');


// init toiletalarm
import * as toiletalarm from './toilet.js';
toiletalarm.load();
toiletalarm.addcallback(function() {
    console.log(toiletalarm.buildings[0].floors[0].male.toilets[0].available);
});


function resetdata(num, building, floors, toilets_male, toilets_female) {
    let database = firebase.database();
    database.ref('root/' + num).set({
        name: building,
    });
    for(let i=0; i<floors; ++i) {
        database.ref('root/' + num + '/floors/'+i).set({
            num: i
        });
        for(let j=0; j<toilets_male[i]; ++j) {
            database.ref('root/' + num + '/floors/'+i+'/male/'+j).set({
                available: true,
                intime: 0
            });
        }
        for(let j=0; j<toilets_female[i]; ++j) {
            database.ref('root/' + num + '/floors/'+i+'/female/'+j).set({
                available: true,
                intime: 0
            });
        }
    }
}