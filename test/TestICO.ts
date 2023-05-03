import { ethers } from "hardhat";
import { expect } from "chai";

import { MyToken } from "../typechain";

describe("ICO", function () {
  let myToken: MyToken;

  beforeEach(async function () {
    const MyToken = await ethers.getContractFactory("ICO");
    myToken = await MyToken.deploy("My Token", "MTK", 18, 1000000, 2000000);
    await myToken.deployed();
  });

  describe("name", function () {
    it("should return the correct name", async function () {
      expect(await myToken.name()).to.equal("My Token");
    });
  });

  describe("symbol", function () {
    it("should return the correct symbol", async function () {
      expect(await myToken.symbol()).to.equal("MTK");
    });
  });

  describe("decimals", function () {
    it("should return the correct decimals", async function () {
      expect(await myToken.decimals()).to.equal(18);
    });
  });

  describe("totalSupply", function () {
    it("should return the correct total supply", async function () {
      expect(await myToken.totalSupply()).to.equal(1000000);
    });
  });

  describe("balanceOf", function () {
    it("should return the correct balance for an account", async function () {
      const [account] = await ethers.getSigners();
      expect(await myToken.balanceOf(account.address)).to.equal(1000000);
    });
  });

  describe("transfer", function () {
    it("should transfer tokens from sender to recipient", async function () {
      const [sender, recipient] = await ethers.getSigners();
      const initialBalanceSender = await myToken.balanceOf(sender.address);
      const initialBalanceRecipient = await myToken.balanceOf(recipient.address);
      const transferAmount = ethers.utils.parseUnits("1000", 18);

      await myToken.transfer(recipient.address, transferAmount);

      expect(await myToken.balanceOf(sender.address)).to.equal(initialBalanceSender.sub(transferAmount));
      expect(await myToken.balanceOf(recipient.address)).to.equal(initialBalanceRecipient.add(transferAmount));
    });

    it("should revert if the sender has insufficient balance", async function () {
      const [sender, recipient] = await ethers.getSigners();
      const transferAmount = ethers.utils.parseUnits("2000", 18);

      await expect(myToken.transfer(recipient.address, transferAmount)).to.be.rejectedWith("ERC20: insufficient balance");
    });
  });

  describe("approve", function () {
    it("should approve a spender to spend tokens on behalf of the owner", async function () {
      const [owner, spender] = await ethers.getSigners();
      const initialAllowance = await myToken.allowance(owner.address, spender.address);
      const approveAmount = ethers.utils.parseUnits("1000", 18);

      await myToken.approve(spender.address, approveAmount);

      expect(await myToken.allowance(owner.address, spender.address)).to.equal(initialAllowance.add(approveAmount));
    });
  });

  describe("transferFrom", function () {
    it("should transfer tokens from sender to recipient on behalf of owner", async function () {
      const [owner, sender, recipient] = await ethers.getSigners();
      const approveAmount = ethers.utils.parseUnits("1000", 18);
      const transferAmount = ethers.utils.parseUnits("500", 18);
      await myToken.approve(sender.address, approveAmount);

      const initialBalanceOwner = await myToken.balanceOf(owner.address);
      const initialBalanceSender = await myToken.balanceOf(sender.address);
      const initialBalanceRecipient = await myToken.balanceOf(recipient.address);
      await myToken.connect(sender).transferFrom(owner.address, recipient.address, transferAmount);

      expect(await myToken.allowance(owner.address, sender.address)).to.equal(approveAmount.sub(transferAmount));
      expect(await myToken.balanceOf(owner.address)).to.equal(initialBalanceOwner.sub(transferAmount));
      expect(await myToken.balanceOf(sender.address)).to.equal(initialBalanceSender);
      expect(await myToken.balanceOf(recipient.address)).to.equal(initialBalanceRecipient.add(transferAmount));
    });
    
    it("should revert if the owner has insufficient balance", async function () {
      const [owner, spender, recipient] = await ethers.getSigners();
      const approveAmount = ethers.utils.parseUnits("500", 18);
      const transferAmount = ethers.utils.parseUnits("1000", 18);
      await myToken.approve(spender.address, approveAmount);
    
      await expect(myToken.connect(spender).transferFrom(owner.address, recipient.address, transferAmount)).to.be.rejectedWith("ERC20: insufficient balance");
    });
    
    it("should revert if the spender has insufficient allowance", async function () {
      const [owner, spender, recipient] = await ethers.getSigners();
      const approveAmount = ethers.utils.parseUnits("500", 18);
      const transferAmount = ethers.utils.parseUnits("1000", 18);
      await myToken.approve(spender.address, approveAmount);
    
      await expect(myToken.connect(spender).transferFrom(owner.address, recipient.address, transferAmount)).to.be.rejectedWith("ERC20: transfer amount exceeds allowance");
    });
  });

  describe("increaseAllowance", function () {
  it("should increase the spender's allowance by the specified amount", async function () {
  const [owner, spender] = await ethers.getSigners();
  const initialAllowance = await myToken.allowance(owner.address, spender.address);
  const increaseAmount = ethers.utils.parseUnits("1000", 18);
  await myToken.increaseAllowance(spender.address, increaseAmount);

  expect(await myToken.allowance(owner.address, spender.address)).to.equal(initialAllowance.add(increaseAmount));
});
});

describe("decreaseAllowance", function () {
it("should decrease the spender's allowance by the specified amount", async function () {
const [owner, spender] = await ethers.getSigners();
const initialAllowance = await myToken.allowance(owner.address, spender.address);
const decreaseAmount = ethers.utils.parseUnits("500", 18);
await myToken.decreaseAllowance(spender.address, decreaseAmount);

expect(await myToken.allowance(owner.address, spender.address)).to.equal(initialAllowance.sub(decreaseAmount));
});

it("should revert if the spender's allowance would be decreased below zero", async function () {
const [owner, spender] = await ethers.getSigners();
const initialAllowance = await myToken.allowance(owner.address, spender.address);
const decreaseAmount = initialAllowance.add(1);

await expect(myToken.decreaseAllowance(spender.address, decreaseAmount)).to.be.rejectedWith("ERC20: decreased allowance below zero");
});
});

describe("mint", function () {
it("should mint new tokens to the specified account", async function () {
const [owner, account] = await ethers.getSigners();
const initialTotalSupply = await myToken.totalSupply();
const mintAmount = ethers.utils.parseUnits("1000", 18);
await myToken.connect(owner).mint(account.address, mintAmount);

expect(await myToken.totalSupply()).to.equal(initialTotalSupply.add(mintAmount));
expect(await myToken.balanceOf(account.address)).to.equal(mintAmount);
});

});

describe("burn", function () {
it("should burn tokens from the specified account", async function () {
const [owner, account] = await ethers.getSigners();
const initialTotalSupply = await myToken.totalSupply();
const initialBalanceAccount = await myToken.balanceOf(account.address);
const burnAmount = ethers.utils.parseUnits("500", 18);
await myToken.connect(account).burn(burnAmount);

expect(await myToken.totalSupply()).to.equal(initialTotalSupply.sub(burnAmount));
expect(await myToken.balanceOf(account.address)).to.equal(initialBalanceAccount.sub(burnAmount));
});

it("should revert if the account has insufficient balance", async function () {
const [owner, account] = await ethers.getSigners();
const initialBalanceAccount = await myToken.balanceOf(account.address);
const burnAmount = initialBalanceAccount.add(1);

await expect(myToken.connect(account).burn(burnAmount)).to.be.rejectedWith("ERC20: burn amount exceeds balance")});


describe("burnFrom", function () {
it("should burn tokens from the specified account on behalf of owner", async function () {
const [owner, account, spender] = await ethers.getSigners();
const initialTotalSupply = await myToken.totalSupply();
const initialBalanceAccount = await myToken.balanceOf(account.address);
const burnAmount = ethers.utils.parseUnits("500", 18);
await myToken.approve(spender.address, initialBalanceAccount);
await myToken.connect(spender).burnFrom(account.address, burnAmount);

expect(await myToken.totalSupply()).to.equal(initialTotalSupply.sub(burnAmount));
expect(await myToken.balanceOf(account.address)).to.equal(initialBalanceAccount.sub(burnAmount));
expect(await myToken.allowance(account.address, spender.address)).to.equal(0);
});

it("should revert if the account has insufficient balance", async function () {
const [owner, account, spender] = await ethers.getSigners();
const initialBalanceAccount = await myToken.balanceOf(account.address);
const burnAmount = initialBalanceAccount.add(1);
await myToken.approve(spender.address, initialBalanceAccount);

await expect(myToken.connect(spender).burnFrom(account.address, burnAmount)).to.be.rejectedWith("ERC20: burn amount exceeds balance");
});

it("should revert if the spender has insufficient allowance", async function () {
const [owner, account, spender] = await ethers.getSigners();
const initialBalanceAccount = await myToken.balanceOf(account.address);
const burnAmount = ethers.utils.parseUnits("500", 18);
await myToken.approve(spender.address, initialBalanceAccount.sub(burnAmount));

await expect(myToken.connect(spender).burnFrom(account.address, burnAmount)).to.be.rejectedWith("ERC20: burn amount exceeds allowance");});
});

describe("pause", function () {
it("should pause the contract", async function () {
const [owner] = await ethers.getSigners();
await myToken.connect(owner).pause();
expect(await myToken.paused()).to.be.true;
});

it("should revert if not called by the owner", async function () {
  const [, account] = await ethers.getSigners();
  await expect(myToken.connect(account).pause()).to.be.rejectedWith("Ownable: caller is not the owner");
});

it("should revert if the contract is already paused", async function () {
  const [owner] = await ethers.getSigners();
  await myToken.connect(owner).pause();
  await expect(myToken.connect(owner).pause()).to.be.rejectedWith("Pausable: paused");
  });
  });
  
  describe("unpause", function () {
  it("should unpause the contract", async function () {
  const [owner] = await ethers.getSigners();
  await myToken.connect(owner).pause();
  await myToken.connect(owner).unpause();
  expect(await myToken.paused()).to.be.false;
  });
  
  it("should revert if not called by the owner", async function () {
    const [, account] = await ethers.getSigners();
    await myToken.pause();
    await expect(myToken.connect(account).unpause()).to.be.rejectedWith("Ownable: caller is not the owner");
  });
  
  it("should revert if the contract is not paused", async function () {
    const [owner] = await ethers.getSigners();
    await expect(myToken.connect(owner).unpause()).to.be.rejectedWith("Pausable: not paused");
  });
  });
  });
  