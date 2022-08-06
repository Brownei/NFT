"reach 0.1";
const [ isOutcome, B_WINS, B_LOSE ] = makeEnum(2);
t
export const main = Reach.App(() => {
  const Alice = Participant('Alice', {
    ...hasRandom,
    getNoTickets: Fun([],UInt),
    getToken: Fun([], Token),
    getWinningNo: Fun([UInt], UInt),
    //getRand: Fun([], UInt),
    getHash:Fun([Digest], Null),
    showNo:Fun([UInt], Null),
    seeOutcome: Fun([Bool,Address], Null),
    seeTokenBalance:Fun([], Null)
  });

  const Bobs = API('Bobs', {
    getTicket: Fun([], UInt),
  });
  init();

 Alice.only(() => {
    const tickets = declassify(interact.getNoTickets());
    const tk = declassify(interact.getToken());
    const _getWinningNo = interact.getWinningNo(tickets);
   const [_commitAlice, _saltAlice] = makeCommitment(interact, _getWinningNo);
   const commitAlice = declassify(_commitAlice);
  });
  Alice.publish(tickets, tk, commitAlice);
  Alice.interact.getHash(commitAlice);
  commit();
  Alice.pay([[1, tk]]);
  const bidsM = new Map(Address, UInt);
  commit();
  Alice.only(() => {
    const saltAlice = declassify(_saltAlice);
    const winningNo = declassify(_getWinningNo);
   });
  Alice.publish(saltAlice, winningNo); 
  const [tickNo, count] =
    parallelReduce([1, 0])
    .invariant(balance() == balance())
    .while( count < tickets )
    .api(Bobs.getTicket,
      (k) => {
        k(tickNo)
         bidsM[this] = tickNo;
           if(tickNo == winningNo){
             Alice.interact.seeOutcome(true, this)
             transfer(balance(tk), tk).to(this);
           }
           else if(tickNo != winningNo){
            Alice.interact.seeOutcome(false, this)
           }
           Alice.interact.showNo(winningNo);
        return [tickNo + 1, count + 1];
      }
    )
  Alice.interact.seeTokenBalance()
  transfer(balance(tk), tk).to(Alice);
  transfer(balance()).to(Alice);
  commit();
  exit();
});