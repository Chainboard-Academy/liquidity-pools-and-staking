import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract StakingRewards is AccessControl {
    IERC20 public immutable staking;
    ERC20 public immutable rewards;

    constructor(address _stakingToken, address _rewardsToken) {
        staking = IERC20(_stakingToken);
        rewards = ERC20(_rewardsToken);
    }

    event Stake(address indexed staker, uint256 amount);
    event Unstake(address indexed staker, uint256 amount);

    

}