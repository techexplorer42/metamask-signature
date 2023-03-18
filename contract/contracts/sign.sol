// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentSigner {
    mapping(bytes32 => mapping(address => uint256)) private signatures;

    event DocumentSigned(bytes32 indexed documentHash, address indexed signer);

    function hasSigned(bytes32 documentHash, address signer) public view returns (uint256) {
        return signatures[documentHash][signer];
    }

    function signDocument(bytes32 _docHash) public {
        require(signatures[_docHash][msg.sender] == 0, "You have already signed this document.");
        signatures[_docHash][msg.sender] = block.timestamp;
        emit DocumentSigned(_docHash, msg.sender);
    }
}
