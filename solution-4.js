{
    init: function (elevator0s, floors) {

        // ------------ INIT VALUES ----------- //
        // first elevator0
        var elevator0 = elevators[0];

        // queue up destination requests
        elevator0.destinationQueue = [];

        // ------------ FUNCTIONS ------------ //
        
        function getbusiestFloor(arr) {

            var counts = {};
            // put all the instances in the queue into an object
            for (var i = 0; i < arr.length; i++) {
                counts[arr[i]] = 1 + (counts[arr[i]] || 0);
            }
            // create an array
            var sortable = [];
            //push value pairs into array
            for (key in counts) {
                if (counts.hasOwnProperty(key)) {
                    sortable.push([key, counts[key]])
                }
            }
            // return the top value set
            return sortable.sort(function (a, b) {
                return a[1] - b[1]
            }).reverse();
        }

        function checkBusiest() {

            console.log("Checking Busiest");
            
            if (elevator0.destinationQueue.Length > 0) {
                //elevator0.goToFloor(elevator0.destinationQueue.pop);
                for (i = 0; i < getbusiestFloor(ourarr).length; i++) {
                    var busiestfloor = getbusiestFloor(ourarr)[i][0];
                    console.log("Going to floor " + busiestfloor);
                    elevator0.goToFloor(busiestfloor);
                }
                // empty it
                elevator0.destinationQueue = [];
                elevator0.goToFloor(0);
            } else {
                elevator0.goToFloor(0);
            }
        }
        
        function isInQueue(ouritem) {
            var a;
            a = elevator0.destinationQueue.indexOf(ouritem);
            if (a > 0) {
                return true;
            } else {
                return false;
            }
        }
        
        function removeFromQueue(ourNumber){
            // this could cause a conflict
            console.log("removing " +ourNumber);
            for(var i = elevator0.destinationQueue.length - 1; i >= 0; i--) {
                if(elevator0.destinationQueue[i] === ourNumber) {
                    elevator0.destinationQueue.splice(i, 1);
                }
            }
        }
        
        // ------------ EVENTS ------------ //

        elevator0.on("floor_button_pressed", function (floorNum) {
            // add buttons to a queue ( in this case pushing it more times helps!)
            elevator0.destinationQueue.push(floorNum);
            checkBusiest();
        });

        // if we are stopped at a floor we may go to a closer floor if someone is waiting
        elevator0.on("stopped_at_floor", function (floorNum) {          
            // check a nearby floor
            var above = floorNum +1;
            var below = floorNum -1;
            
            if (isInQueue(above)){
                elevator0.goToFloor(above);              
                removeFromQueue(above);
            }
            if (isInQueue(below)){
                elevator0.goToFloor(below);
                removeFromQueue(below);
            }
            // go back to checking busiest floor
            checkBusiest();
            
        });

        // Whenever the elevator0 is idle (has no more queued destinations) ...
        elevator0.on("idle", function () {
            // let's go to all the floors (or did we forget one?)
            elevator0.goToFloor(0);
            //elevator0.goToFloor(1);
            //elevator0.goToFloor(2);
            //elevator0.goToFloor(3);
            //elevator0.goToFloor(4);
        });
    },

        update: function (dt, elevator0s, floors) {
            // We normally don't need to do anything here
        }
}