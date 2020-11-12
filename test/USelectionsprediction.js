const USelectionsprediction = artifacts.require("USelectionsprediction.sol");

const SIDE = {
  BIDEN: 0,
  TRUMP: 1
};

contract("USelectionsprediction", addresses => {
  const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;

 it("should work", async () => {
      const USelectionsprediction = await USelectionsprediction.new(oracle);

      await USelectionsprediction.placeBet(
        SIDE.BIDEN,
        {from: gambler1, value: web3.utils.toWei("1")}
      );
      await USelectionsprediction.placeBet(
          SIDE.BIDEN,
        {from: gambler2, value: web3.utils.toWei("1")}
      );
      await USelectionsprediction.placeBet(
              SIDE.BIDEN,
        {from: gambler3, value: web3.utils.toWei("2")}
      );
      await USelectionsprediction.placeBet(
              SIDE.TRUMP,
          {from: gambler4, value: web3.utils.toWei("4")}
      );

      await USelectionsprediction.reportResult(
        SIDE.BIDEN,
        SIDE.TRUMP,
        {from: oracle}
      );

      const balancesBefore = (await Promise.all(
        [gambler1, gambler2, gambler3, gambler4].map(gambler => (
          web3.eth.getBalance(gambler)
        ))
      )
      .map(balance => web3.utils.toBN(balance));
      await Promise.all(
        [gambler1, gambler2, gambler3].map(gambler => (
          USelectionsprediction.withdrawGain({from: gambler})
        ))
      );
      const balancesAfter = (await Promise.all(
        [gambler1, gambler2, gambler3, gambler4].map(gambler => (
          web3.eth.getBalance(gambler)
        ))
      ))
      .map(balance => web3.utils.toBN(balance));

      assert(balancesAfter[0].sub(balancesBefore[0]).toString().slice(0, 3) === "199");
      assert(balancesAfter[1].sub(balancesBefore[1]).toString().slice(0, 3) === "199");
      assert(balancesAfter[2].sub(balancesBefore[2]).toString().slice(0, 3) === "399");
      assert(balanceAfter[3].sub(balancesBefore[3]).isZero());
   });
});
