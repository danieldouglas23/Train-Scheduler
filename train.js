var config = {
    apiKey: "AIzaSyAaxUJXxMumvjlQOfuN-Z1EfBDSn4ZwBWo",
    authDomain: "goofy-project-8bc85.firebaseapp.com",
    databaseURL: "https://goofy-project-8bc85.firebaseio.com",
    projectId: "goofy-project-8bc85",
    storageBucket: "goofy-project-8bc85.appspot.com",
    messagingSenderId: "427883022961"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    // Uploads train data to firebase
    database.ref().push({
        name: trainName,
        dest: destination,
        first: firstTrain,
        freq: frequency
    });

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (snapshot) {
    console.log(snapshot.val());

    // Store everything into a variable.
    var trainName = snapshot.val().name;
    var destination = snapshot.val().dest;
    var firstTrain = snapshot.val().first;
    var frequency = snapshot.val().freq;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    console.log(firstTrainConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    var nextArrival = moment(nextTrain).format("hh:mm");

    // Create the new row
    var tRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(tMinutesTillTrain)        
    );

    // Append the new row to the table
    $("tbody").append(tRow);
});


