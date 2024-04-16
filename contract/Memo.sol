// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MEMO is ERC20, Ownable {
    constructor()
        ERC20("MEMO", "MM")
        Ownable(msg.sender)
    {}

    uint256 public constant priceOfToken = 100000000000000 wei;

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function getPriceOfToken() public pure returns(uint256) {
        return priceOfToken;
    }

    function buyToken() public payable  {
        require(msg.value >= 100000000000000 wei, "Minimun 1 MEMO");

        uint256 amount = msg.value * 1e18 / priceOfToken;

        // transfer token to buyer
        // msg.sender : nguoi dung

        // chuyen tu contract to buyer

        // transfer
        // msg.sender trong một function được gọi ở một function khác thì
        // msg.sender : là contract address
        // customTransfer(address(this),to, amount);
        transfer(address(this),msg.sender, amount);
    }

    function transfer(address from, address to, uint256 value) public virtual returns (bool) {
        // msg.sender => contract (this)
        _transfer(from, to, value);
        return true;
    }

    function sellToken(uint256 amount) public {
        require(amount > 1, "Minimun 1 MEMO");
        uint256 balance = balanceOf(msg.sender);
        require(balance >= amount);

        uint256 total = amount * priceOfToken;

        // chuyen token cho owner
        address contractAddress = address(this);

        // transfer
        // msg.sender trong một function được gọi ở một function khác thì
        // msg.sender : là contract address
        bool transfered = transfer(msg.sender,contractAddress, amount);
        require(transfered);

        bool sent = payable (msg.sender).send(total);
        require(sent);
    }
}