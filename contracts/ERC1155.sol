// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BNBEnviroment is ERC1155 {
    // Constantes
    uint256 public constant BNB_TOKEN = 0;

    // Variables
    using Counters for Counters.Counter;
    Counters.Counter private _totalFNFTs;
    mapping (uint256 => string) _listUris;
    // Variables para ERC20
    string private _nameToken;
    string private _symbolToken;
    uint8 private _decimalsToken;
    uint256 private _totalSupplyTokens;

    // Eventos
    event CreateToken( address indexed  owner, uint256 indexed _id, uint256 _amount, bytes _data);
    event DeleteToken( address indexed  owner, uint256 indexed _id, uint256 _amount);

    // Modificadores

    constructor() ERC1155("") {
        // ERC20
        _nameToken = "BNB Token";
        _symbolToken = "BNB";
        _decimalsToken = 18;
        _totalSupplyTokens = 10**_decimalsToken;
        _mint(msg.sender, BNB_TOKEN, _totalSupplyTokens, "");

        // ERC721
        _listUris[BNB_TOKEN] = "https://bafkreigaodcf2yaiubhvh7jko57zeruwr6k2zcej6ftv4aglg7mtoosz7u.ipfs.nftstorage.link/";
    }

    // Funciones ERC20

    function nameToken() public view returns(string memory){
        return _nameToken;
    }

    function symbolToken() public view returns(string memory){
        return _symbolToken;
    }

    function decimalsToken() public view returns(uint8){
        return _decimalsToken;
    }

    function totalSupplyToken() public vire returns(uint256){
        return _totalSupplyTokens;
    }

    function balanceOfToken() public view returns(uint256){
        return balanceOf(msg.sender, BNB_TOKEN);
    }

    function transferToken(address _to, uint256 _amount ) public returns(bool){
        return safeTransferFrom(msg.sender, _to, BNB_TOKEN, _amount, "");
    }

    // Funciones ERC721

    function balanceOfFNFT(address _owner) external view returns (uint256){
        
    }

    function uri(uint256 _tokenid) override public view returns (string memory) {
        return _listUris[_tokenid];
    }

    function createFNFT(string memory _urlURI) public returns(uint256){
        _totalFNFTs.increment();
        uint256 _id = _totalFNFTs.current();
        _listUris[_id] = _urlURI;
        _mint(msg.sender, _id, 1, "");
        emit CreateToken( msg.sender, _id, 1, "");
        return _id;
    }

    function createFNFTBatch(string[] memory _urlURI) public returns( uint256[] memory){
        uint256[] memory _ids = new uint[](_urlURI.length);
        for (uint i = 0; i < _urlURI.length; i++) {
            _totalFNFTs.increment();
            uint256 _id = _totalFNFTs.current();
            _listUris[_id] = _urlURI[i];
            _mint(msg.sender, _id, 1, "");
            emit CreateToken( msg.sender, _id, 1, "");
            _ids[i] = _id;
        }
        return _ids;
    }    
}