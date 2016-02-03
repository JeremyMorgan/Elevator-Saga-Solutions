{
    init: function (elevators, floors) {

        var elevator = elevators[0]; // Let's use the first elevator
        var elevator1 = elevators[1];

        var lastQueueUsed = "";

        // queue up destination requests
        elevator.destinationQueue = [];
        elevator1.destinationQueue = [];

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

            if (elevator.destinationQueue.length > 0) {

                for (i = 0; i < getbusiestFloor(elevator.destinationQueue).length; i++) {
                    var busiestfloor = getbusiestFloor(elevator.destinationQueue)[i][0];
                    var location = elevator.destinationQueue.indexOf(busiestfloor);
                    elevator.destinationQueue.remove(location);
                    elevator.goToFloor(busiestfloor);
                }
                elevator.goToFloor(0);
            } else {
                elevator.goToFloor(0);
            }
            
            if (elevator1.destinationQueue.length > 0) {

                for (i = 0; i < getbusiestFloor(elevator1.destinationQueue).length; i++) {
                    var busiestfloor = getbusiestFloor(elevator1.destinationQueue)[i][0];
                    var location = elevator1.destinationQueue.indexOf(busiestfloor);
                    elevator1.destinationQueue.remove(location);
                    elevator1.goToFloor(busiestfloor);
                }
                elevator1.goToFloor(0);
            } else {
                elevator1.goToFloor(0);
            }
            
        }

        function checkNear(floor){

            var nextfloor = floor + 1;
            var prevfloor = floor - 1;


            if(elevator.destinationQueue.indexOf(nextfloor) > -1 || elevator.destinationQueue.indexOf(prevfloor) > -1){

                var counts = {};

                for(var i = 0; i< elevator.destinationQueue.length; i++) {
                    var num = elevator.destinationQueue[i];
                    counts[num] = counts[num] ? counts[num]+1 : 1;
                }

                if (counts[nextfloor] < counts[prevfloor]){
                    elevator.goToFloor(prevfloor);
                }else {
                    elevator.goToFloor(nextfloor);
                }

                elevator.goToFloor(nextfloor);
            }
        }


        // function to remove element from array
        Array.prototype.remove = function(from, to) {
            var rest = this.slice((to || from) + 1 || this.length);
            this.length = from < 0 ? this.length + from : from;
            return this.push.apply(this, rest);
        };

        elevator.on("floor_button_pressed", function (floorNum) {
            // add buttons to a queue ( in this case pushing it more times helps!)
            if ((lastQueueUsed == "") || (lastQueueUsed = 1)){
                elevator.destinationQueue.push(floorNum);
                lastQueueUsed = 0;
            }else {
                elevator1.destinationQueue.push(floorNum);
                lastQueueUsed = 1;
            }


        });

        elevator.on("stopped_at_floor", function (floorNum) {

            checkNear(floorNum);
        });

        // Whenever the elevator is idle (has no more queued destinations) ...
        elevator.on("idle", function () {
            // let's go to all the floors (or did we forget one?)
            checkBusiest();
        });
        elevator1.on("idle", function () {
            // let's go to all the floors (or did we forget one?)
            elevator1.goToFloor(0);
            elevator1.goToFloor(1);
            elevator1.goToFloor(2);
            elevator1.goToFloor(3);
            elevator1.goToFloor(4);
            elevator1.goToFloor(5);
            elevator1.goToFloor(6);
            elevator1.goToFloor(7);
        });
    },

        update: function (dt, elevators, floors) {
            // We normally don't need to do anything here
        }
}