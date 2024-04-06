// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.25;

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

    function buyToken(uint256 amount) public {
        require(amount > 1, "Minimun 1 MEMO");
        uint256 total = amount * priceOfToken;

        // payment to contract
        bool sent = payable (address(this)).send(total);
        require(sent, "Payment error");

        // transfer token to buyer
        // msg.sender : nguoi dung
        address to = msg.sender;

        // chuyen tu contract to buyer

        // transfer
        // msg.sender trong một function được gọi ở một function khác thì
        // msg.sender : là contract address
        // customTransfer(address(this),to, amount);

        transfer(to, amount);
    }

    function customTransfer(address _from, address _to, uint256 _amount) private returns (bool) {
        _transfer(_from, _to, _amount);
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
        bool transfered = customTransfer(msg.sender,contractAddress, amount);
        require(transfered);

        bool sent = payable (msg.sender).send(total);
        require(sent);
    }
}