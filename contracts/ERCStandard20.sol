// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ERCStandard20 is AccessControl {
  
    string _name;
    string _symbol;
    uint256 _totalSupply;
    uint256 _decimals = 18;
    address _contractOwner;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
 
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 _value);

    constructor(string memory name_, string memory symbol_, address _minter) {
         _setupRole(MINTER_ROLE, _minter);
        _name = name_;
        _symbol = symbol_;
        _totalSupply = 1000;
        _balances[msg.sender] = _totalSupply;
    }


    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function decimals() public view returns (uint256) {
        return _decimals;
    }


    function allowance(address _owner, address _spender) public view returns (uint256){
        return _allowances[_owner][_spender];
    }

    function mint(address account, uint256 amount) public returns (bool){
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        require(account != address(0), "ERC20: mint to the zero address");

        _balances[account] += amount;
        _totalSupply += amount;

        emit Transfer(account, address(0), amount);
        return true;
    }

    function burn(address account, uint256 amount) public returns (bool){
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        require(_balances[account] >= amount, "The balance is less than burning amount");

        _balances[account] -= amount;
        _totalSupply -= amount;
        emit Transfer(account, address(0), amount);

        return true;
    }


    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_balances[msg.sender] >= _value, "Sender does not have enough money");
        require(_to != address(0), "Address is required");

        _balances[msg.sender] -= _value;
        _balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }
   

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(_balances[_from] > _value, "Sender balance is too low");
        require(_allowances[_from][msg.sender] >= _value, "Sender allowance is below the value needed");

        _allowances[_from][msg.sender] -= _value;
        _balances[_from] -= _value;
        _balances[_to] += _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

  
    function approve(address _spender, uint256 _amount) external returns (bool) {
        require(_spender != address(0), "ERC20: zero address");
        _allowances[msg.sender][_spender] = _amount;
        emit Approval(msg.sender, _spender, _amount);
        return true;
    }


    function increaseAllowance(address _spender, uint256 _amount) public returns (bool){
        _approve(
            msg.sender,
            _spender,
            _allowances[msg.sender][_spender] + _amount
        );

        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool){
        uint256 currentAllowance = _allowances[msg.sender][spender];
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");

        _approve(msg.sender, spender, currentAllowance - subtractedValue);

        return true;
    }

    function _approve(address _owner, address _spender, uint256 _amount) internal {
        require(_spender != address(0), "ERC20: zero address");
        _allowances[_owner][_spender] = _amount;
        emit Approval(_owner, _spender, _amount);
    }
}

