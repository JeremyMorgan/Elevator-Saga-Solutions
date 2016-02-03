{
    init: function (elevators, floors) {

        var elevator = elevators[0]; // Let's use the first elevator

        // queue up destination requests
        elevator.destinationQueue = [];
   
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
            console.log(JSON.stringify(elevator.destinationQueue));

            if (elevator.destinationQueue.Length > 0) {
                //elevator.goToFloor(elevator.destinationQueue.pop);
                console.log("Entering Queue");
                for (i = 0; i < getbusiestFloor(elevator.destinationQueue).length; i++) {
                    var busiestfloor = getbusiestFloor(elevator.destinationQueue)[i][0];
                    console.log("Going to floor " + busiestfloor);
                    elevator.goToFloor(busiestfloor);
                }
                // empty it
                elevator.destinationQueue = [];
                elevator.goToFloor(0);
            } else {
                elevator.goToFloor(0);
            }
        }

        elevator.on("floor_button_pressed", function (floorNum) {
            // add buttons to a queue ( in this case pushing it more times helps!)
            elevator.destinationQueue.push(floorNum);

        });

        elevator.on("stopped_at_floor", function (floorNum) {
            checkBusiest();
        });

        // Whenever the elevator is idle (has no more queued destinations) ...
        elevator.on("idle", function () {
            // let's go to all the floors (or did we forget one?)
            checkBusiest();
            //elevator.goToFloor(0);
            //elevator.goToFloor(1);
            //elevator.goToFloor(2);
            //elevator.goToFloor(3);
            //elevator.goToFloor(4);
        });
    },

        update: function (dt, elevators, floors) {
            // We normally don't need to do anything here
        }
}