# PraveshMitra - Ticket Booking Chatbot

PraveshMitra is a web-based chatbot application designed to streamline the process of booking museum tickets. It provides a conversational interface for users to book their tickets, receive OTP verification, and get booking confirmations via SMS.

---

## ✨ Features

* **Conversational Interface:** An intuitive and user-friendly chat interface for a seamless booking experience.
* **OTP Verification:** Securely verifies the user's mobile number using OTP sent via Twilio.
* **Dynamic Ticket Pricing:** Calculates the total booking amount based on the number and type of visitors (e.g., general, below 5 years, foreigners).
* **SMS Confirmation:** Sends a booking confirmation with a unique booking ID to the user's mobile number.
* **Real-time Communication:** Built with Socket.io for instant messaging between the user and the chatbot.

---

## 💻 Technologies Used

* **Backend:** Node.js, Express.js
* **Frontend:** HTML, CSS, JavaScript
* **Real-time Communication:** Socket.io
* **SMS Service:** Twilio
* **Deployment:** Vercel

---

## 🛠️ Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/pratyush4932/praveshmitra.git](https://github.com/pratyush4932/praveshmitra.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd praveshmitra/PraveshMitra-8579fec483c42632b6c217cb5e902a880dc29ba3
    ```

3.  **Install the dependencies:**
    ```bash
    npm install
    ```

4.  **Create a `.env` file** in the root directory and add your Twilio credentials:
    ```
    ACCOUNT_SID=your_twilio_account_sid
    AUTH_TOKEN=your_twilio_auth_token
    ```

5.  **Start the server:**
    ```bash
    npm start
    ```

6.  Open your browser and go to `http://localhost:5000` to use the application.

---

## 🚀 Usage

1.  When you open the application, the chatbot will greet you.
2.  Type "book ticket" to start the booking process.
3.  Follow the chatbot's prompts to enter your name, mobile number, and the number of people.
4.  Verify your mobile number with the OTP sent to you.
5.  Confirm the booking and payment to receive a confirmation SMS.

---

## 📸 Screenshots

*You can add screenshots of the application here to showcase the user interface and the chatbot's functionality.*

---

## 🔮 Future Scope

* **Integration with Payment Gateway:** To handle real-time online payments.
* **Multi-language Support:** To cater to a more diverse audience.
* **Admin Dashboard:** To manage bookings and view analytics.
* **Enhanced AI:** Use of more advanced NLP models for a more natural conversation flow.
