// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BNBEnviroment is ERC1155 {
    // Constantes
    uint256 public constant BNB_TOKEN = 1;

    // Variables
    using Counters for Counters.Counter;
    Counters.Counter private _totalTypes;
    mapping (uint256 => string) _listUris;

    // Eventos
    event CreateToken( address indexed  owner, uint256 indexed _id, uint256 _amount, bytes _data);
    event DeleteToken( address indexed  owner, uint256 indexed _id, uint256 _amount);

    // Modificadores

    constructor() ERC1155("") {
        _totalTypes.increment();
        _listUris[BNB_TOKEN] = "https://bafkreigaodcf2yaiubhvh7jko57zeruwr6k2zcej6ftv4aglg7mtoosz7u.ipfs.nftstorage.link/";
        _mint(msg.sender, BNB_TOKEN, 10**18, "");
    }

    function uri(uint256 _tokenid) override public view returns (string memory) {
        return _listUris[_tokenid];
    }

    function createFNFT(uint256 _amount, string memory _urlURI) public returns(uint256){
        _totalTypes.increment();
        uint256 _id = _totalTypes.current();
        _listUris[_id] = _urlURI;
        _mint(msg.sender, _id, _amount, "");
        emit CreateToken( msg.sender, _id, _amount, "");
        return _id;
    }

    function createFNFTBatch(uint256[] memory _amounts, string[] memory _urlURI) public returns( uint256[] memory){
        require(_urlURI.length == _amounts.length, "Los arrays deben tener la misma longitud");
        uint256[] memory _ids = new uint[](_amounts.length);
        for (uint i = 0; i < _amounts.length; i++) {
            _totalTypes.increment();
            uint256 _id = _totalTypes.current();
            _listUris[_id] = _urlURI[i];
            _mint(msg.sender, _id, _amounts[i], "");
            emit CreateToken( msg.sender, _id, _amounts[i], "");
            _ids[i] = _id;
        }
        return _ids;
    }    
}