# PayRollio
Automate your employee payments, perks and recognition in one simple dapp

## What it does

Its an employee management system where you can create, modify and delete employees. Linked to an NFT system to prove employment in the company and also a DAO to vote for outstanding employees. This comes with an internal company token to buy perks and benefits.



### How we built it
The first step we had to take was deciding the direction we wanted to go with this by choosing a problem to solve. The idea came very quickly after we realized how many problems we ware facing with late payments due to not only company liability,but also for holidays delaying the date of payments.

#### The Bases of the project With a direction to follow, we now need a clear idea of this project should provide. At this phase we did a lot a brainstorming trying to figure out what we should add and what was to advanced for a MVP. We came up with the main parts for the app to function correctly:

   1. Employees contract to contain data structures and keep track of time
   2. Payroll to hold the payment token
   3. DAO do run and register the voting sections
   4. Chainlink Automation to call the app daily and update all the state variables
   
#### Transforming the ideas into code Once we know what we ware going for we just had to break down the whole app into small pieces for a better version control and testing purposes. At this phase we also imagined a lot of extra functionalities that could be added, but ware too "company specific" for a MVP.

#### Using the app as the final user Putting the app to production, testing in the final environment. This was also useful to see if the user experience was intuitive and easy to pick up for newcomers.

Run the app in the development mode.\
Clone the project it git clone https://github.com/thobbyAk/PayRollio
run npm install on your terminal 
start the project with npm run start 
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.




