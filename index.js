const express = require("express");
const app = express();
const server = app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port %d", server.address().port);
});

app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/files"));
app.get("/", (_req, res) => {
  res.sendFile("index.html");
});

const io = require("socket.io")(server);
const crypto = require("crypto"); // For generating random alphanumeric booking IDs

io.on("connection", (socket) => {
  console.log("A user connected");

  let step = 0; // Track the conversation state
  let name = null;
  let mobileNumber = null;
  let generatedOtp = null; // Store OTP for verification
  let foreignerCount = 0; // To store the count of foreigners
  let above5YearsCount = 0;
  let below5YearsCount = 0;
  let totalAmount = 0; // To store the total amount

  socket.on("userInput", async (input) => {
    if (step === 0 && input.toLowerCase().includes("book ticket")) {
      socket.emit("botResponse", "Enter your name:");
      step++;
    } else if (step === 1) {
      name = input;
      if (name) {
        socket.emit(
          "botResponse",
          `Hi ${name}, please enter your mobile number:`
        );
        step++;
      } else {
        socket.emit("botResponse", "Please enter a valid name.");
      }
    } else if (step === 2) {
      mobileNumber = input;
      if (/^\d{10}$/.test(mobileNumber)) {
        // Generate and send OTP
        generatedOtp = Math.floor(100000 + Math.random() * 900000);
        socket.emit(
          "botResponse",
          `Hey ${name}, an OTP has been sent to your mobile number ${mobileNumber}.`
        );

        try {
          const accountSid = "AC4366cfdab1912a0229a850e0ce2f11e0";
          const authToken = "e8319b4768f159e0cc6d22eaa915187b";
          const client = require("twilio")(accountSid, authToken);

          await client.messages
            .create({
              body: `Hello ${name}, your OTP is ${generatedOtp}`,
              to: `+91${mobileNumber}`, // Use the user's mobile number
              from: "+19493935392", // Your Twilio number
            })
            .then((message) => console.log("OTP sent, SID:", message.sid))
            .catch((error) => {
              console.error("Error sending OTP:", error);
              socket.emit(
                "botResponse",
                "Error sending OTP, please try again later."
              );
            });
        } catch (error) {
          socket.emit("botResponse", "Something went wrong, please try again.");
          console.log(error)
        }

        step++;
      } else {
        socket.emit(
          "botResponse",
          "Invalid mobile number. Please enter a valid 10-digit number."
        );
      }
    } else if (step === 3) {
      const userOtp = input;
      if (Number(userOtp) === generatedOtp) {
        socket.emit("botResponse", "OTP successfully verified.");
        socket.emit("botResponse", "Are you a foreigner? (yes/no)");
        step++;
      } else {
        socket.emit(
          "botResponse",
          "Invalid OTP. Please enter the correct OTP."
        );
      }
    } else if (step === 4) {
      if (input.toLowerCase() === "yes") {
        socket.emit("botResponse", "How many foreigners are there?");
        step++;
      } else if (input.toLowerCase() === "no") {
        socket.emit("botResponse", "How many persons are there above 5 years?");
        step = 6; // Skip foreigner count step
      } else {
        socket.emit(
          "botResponse",
          "Invalid response. Please answer 'yes' or 'no'."
        );
      }
    } else if (step === 5) {
      foreignerCount = Number(input);
      newforeignerCount= foreignerCount
      if (foreignerCount >= 0) {
        totalAmount = foreignerCount * 500;
        socket.emit(
          "botResponse",
          `Your total is ${totalAmount}. Do you want to proceed with payment? (yes/no)`
        );
        step +=3;
      } else {
        socket.emit(
          "botResponse",
          "Invalid input. Please enter a valid number of foreigners."
        );
      }
    } else if (step === 6) {
      above5YearsCount = Number(input);
      if (above5YearsCount >= 0) {
        socket.emit("botResponse", "How many persons are there below 5 years?");
        step++;
      } else {
        socket.emit(
          "botResponse",
          "Invalid input. Please enter the number of persons above 5 years."
        );
      }
    } else if (step === 7) {
      below5YearsCount = Number(input);
      if (below5YearsCount >= 0) {
        // Calculate totals
        
          totalAmount = above5YearsCount * 79 + below5YearsCount * 49;
        

        socket.emit(
          "botResponse",
          `You've entered ${below5YearsCount} people below 5 years.`
        );
        socket.emit(
          "botResponse",
          `Your total is ${totalAmount}. Do you want to proceed with payment? (yes/no)`
        );
        step+=2;
      } else {
        console.log(input)
        socket.emit(
          "botResponse",
          "Invalid input. Please enter the number of persons below 5 years."
        );
      }
    } else if (step === 8) {
      if (input.toLowerCase() === "yes") {
        // Generate a random alphanumeric booking ID
        const bookingId = crypto.randomBytes(6).toString("hex").toUpperCase();

        // Send SMS with booking details
        try {
          const accountSid = "AC4366cfdab1912a0229a850e0ce2f11e0";
          const authToken = "e8319b4768f159e0cc6d22eaa915187b";
          const client = require("twilio")(accountSid, authToken);

          await client.messages
            .create({
              body: `Booking ID: ${bookingId}\nName: ${name}\nTotal Persons: ${
                newforeignerCount
              }\nTotal Amount: ${totalAmount}`,
              to: `+91${mobileNumber}`, // Use the user's mobile number
              from: "+19493935392", // Your Twilio number
            })
            .then((message) =>
              console.log("Booking SMS sent, SID:", message.sid)
            )
            .catch((error) => {
              console.error("Error sending booking SMS:", error);
              socket.emit(
                "botResponse",
                "Error sending booking SMS, please try again later."
              );
            });

          socket.emit(
            "botResponse",
            "Your payment is being processed. Thank you for booking with us."
          );
          step = 0; // Reset or handle further steps as needed
          foreignerCount=0;
        } catch (error) {
          socket.emit(
            "botResponse",
            "Something went wrong with the payment process. Please try again."
          );
        }
      } else if (input.toLowerCase() === "no") {
        socket.emit(
          "botResponse",
          "Payment not processed. If you need further assistance, please let us know."
        );
        step = 0; // Reset or handle further steps as needed
        foreignerCount=0
      } else {
        socket.emit(
          "botResponse",
          "Invalid response. Please answer 'yes' or 'no'."
        );
      }
      
    } else if (step === 9) {
      if (input.toLowerCase() === "yes") {
        // Generate a random alphanumeric booking ID
        const bookingId = crypto.randomBytes(6).toString("hex").toUpperCase();

        // Send SMS with booking details
        try {
          const accountSid = "AC4366cfdab1912a0229a850e0ce2f11e0";
          const authToken = "e8319b4768f159e0cc6d22eaa915187b";
          const client = require("twilio")(accountSid, authToken);

          await client.messages
            .create({
              body: `Booking ID: ${bookingId}\nName: ${name}\nTotal Persons: ${
                above5YearsCount + below5YearsCount
              }\nTotal Amount: ${totalAmount}`,
              to: `+91${mobileNumber}`, // Use the user's mobile number
              from: "+19493935392", // Your Twilio number
            })
            .then((message) =>
              console.log("Booking SMS sent, SID:", message.sid)
            )
            .catch((error) => {
              console.error("Error sending booking SMS:", error);
              socket.emit(
                "botResponse",
                "Error sending booking SMS, please try again later."
              );
            });

          socket.emit(
            "botResponse",
            "Your payment is being processed. Thank you for booking with us."
          );
          step = 0; // Reset or handle further steps as needed
          below5YearsCount=0;
          above5YearsCount=0;
        } catch (error) {
          socket.emit(
            "botResponse",
            "Something went wrong with the payment process. Please try again."
          );
        }
      } else if (input.toLowerCase() === "no") {
        socket.emit(
          "botResponse",
          "Payment not processed. If you need further assistance, please let us know."
        );
        step = 0; // Reset or handle further steps as needed
        below5YearsCount=0;
        above5YearsCount=0;
      } else {
        socket.emit(
          "botResponse",
          "Invalid response. Please answer 'yes' or 'no'."
        );
      }
      
    } else {
      socket.emit("botResponse", "Invalid command. Please type 'book ticket'.");
    }
    

  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
