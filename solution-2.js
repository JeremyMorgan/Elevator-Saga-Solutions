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

            console.log("Checking Busiest in " + elevator.destinationQueue.length);
            console.log(JSON.stringify(elevator.destinationQueue));

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
        }

        Array.prototype.remove = function(from, to) {
            var rest = this.slice((to || from) + 1 || this.length);
            this.length = from < 0 ? this.length + from : from;
            return this.push.apply(this, rest);
        };
        
        elevator.on("floor_button_pressed", function (floorNum) {
            // add buttons to a queue ( in this case pushing it more times helps!)
            elevator.destinationQueue.push(floorNum);

        });

        elevator.on("stopped_at_floor", function (floorNum) {
            //checkBusiest();
        });

        // Whenever the elevator is idle (has no more queued destinations) ...
        elevator.on("idle", function () {
            // let's go to all the floors (or did we forget one?)
            checkBusiest();
        });
    },

        update: function (dt, elevators, floors) {
            // We normally don't need to do anything here
        }
}