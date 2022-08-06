import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

const stdlib = loadStdlib({ REACH_NO_WARN: 'Y' });
const sbal = stdlib.parseCurrency(100);
const accAlice = await stdlib.newTestAccount(sbal);
const fmt = (x) => stdlib.formatCurrency(x, 4);
const deadline = stdlib.connector === 'CFX' ? 500 : 250;

const ctcAlice = accAlice.contract(backend);

const users = await stdlib.newTestAccounts(5, sbal);
const ctcWho = (whoi) =>
  users[whoi].contract(backend, ctcAlice.getInfo());

const tId = await stdlib.launchToken(accAlice, "BORED CHIMP", "BC", { supply: 1});
  console.log('NFT HAS BEEN CREATED');
  console.log(`Opt-ing in on ALGO`);
  await users[0].tokenAccept(tId.id);
  await users[1].tokenAccept(tId.id);
  await users[2].tokenAccept(tId.id);
  await users[3].tokenAccept(tId.id);
  await users[4].tokenAccept(tId.id);

const getTicketNo = async (whoi) => {
  const who = users[whoi];
  const ctc = ctcWho(whoi);
  const y = await ctc.apis.Bobs.getTicket();
  console.log(`${stdlib.formatAddress(who)} ticket number is ${y}`);
};

const getBalance = async () => {
  const x = fmt(await stdlib.balanceOf(accAlice, tId.id));
  console.log('Alice NFT balance is ', x, tId.sym);
}

await Promise.all([
  backend.Alice(ctcAlice, {
    ...stdlib.hasRandom,
    getNoTickets: () =>{
      const x = 5;
      console.log('The Number of Tickets is',  x)
      return x;
      
    },
    getToken : () => {
        console.log('Sending NFT parameters to the backend');
        return tId.id;
    },
    getWinningNo : (x) => {
      const num = (Math.floor(Math.random() * x) + 1);
      return num;
    },
    
    showNo : (x) => {
      console.log(`WINNING NUMBER IS ${x}`)
    },
    seeOutcome : (x, y) => {
     if(x == true){
      console.log(`${stdlib.formatAddress(y)} Won the raffle `)
     }
     else console.log(`${stdlib.formatAddress(y)} Sorry you did not  win the raffle`)
    },
    seeTokenBalance: () => {
      getBalance()
    }

  }),

await getTicketNo(0),
await getTicketNo(1),
await getTicketNo(2),
await getTicketNo(3),
await getTicketNo(4),
]);
