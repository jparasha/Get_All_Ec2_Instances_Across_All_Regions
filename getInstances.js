var AWS = require('aws-sdk');
exports.handler = (event, context, callback) => {
    var viewThisData = [];
    var response;
    var callBackCount=0;
    var instanceCount = 0;
    var runningInstances=0;
    var stoppedInstances=0;
    var nont2microInstances=0;
    response = {
        TotalInstanceCount: '',
        TotalRunningInstances: '',
        TotalNonT2MicroInstances: '',
        AllInstances: []
    };
    var regionNames = ['us-west-1', 'us-west-2', 'us-east-1', 'eu-west-1', 'eu-central-1', 'sa-east-1', 'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2'];
    
    regionNames.forEach(function(region) {
        getInstances(region);
    });
    function getInstances(region) {
        var regionName = region;
        var info = {
            region: ''
        };
        info.region = regionName;
        var EC2 = new AWS.EC2(info);
        var callbackData = {};
        var params = {};
        EC2.describeInstances(params, function(err, data) {
            var Ids = [];
            if (err) return console.log("Error connecting to AWS, No Such Instance Found!");
            data.Reservations.forEach(function(reservation) {
                var localData = {
                    InstanceId: '',
                    State: '',
                    InstanceType: '',
                    KeyName: ''
                };
                reservation.Instances.forEach(function(instance) {
                    if (instance.InstanceId[0] !== undefined) {
                        localData.InstanceId = (instance.InstanceId);
                        localData.KeyName = (instance.KeyName);
                        localData.InstanceType = (instance.InstanceType);
                        localData.State = (instance.State);
                        Ids.push(localData);
                        instanceCount++;
                        if(instance.State.Name==='running'){
                            runningInstances++;
                        }
                        else{
                            stoppedInstances++;
                        }
                        if(instance.InstanceType !== 't2.micro'){
                            nont2microInstances++;
                        }
                        else{
                            //
                        }
                    } else {
                        console.log("no inst");
                    }
                });
            });
            view(Ids, region);
        });
    }
    function view(Ids, region) {
        callBackCount++;
        if (Ids[0] === undefined) {
            //
        } else {
            var viewData = {
                region: "",
                Instances: []
            };
            viewData.region = region;
            viewData.Instances.push(Ids);
            viewThisData.push(viewData);
            response.TotalInstanceCount = instanceCount;
            response.TotalRunningInstances = runningInstances;
            response.TotalNonT2MicroInstances = nont2microInstances;
            response.AllInstances.push(viewData);
        }
        if (callBackCount == 10 && viewThisData[0] === undefined) {
            //console.log("ran-");
        } else if (callBackCount == 10 && viewThisData[0] !== undefined) {
            console.log(JSON.stringify(response));
            var local = JSON.stringify(response, undefined, 3);
            callback(null, local);
        } else {
            //console.log("operation pending across few regions");
        }
    }
    console.log(JSON.stringify(event));
};