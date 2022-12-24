var contractABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "ids",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "add",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "i",
        "type": "uint256"
      }
    ],
    "name": "get",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getAll",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "length",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];
var contractAddress = '0x58ce59853F0Bb8bF96f3Bc4A21609AC04692e341';
var web3 = new Web3('http://127.0.0.1:9545/');
var advancedStorageContract = new web3.eth.Contract(contractABI, contractAddress);

const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    if(typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      window.ethereum.enable()
        .then(() => {
          resolve(
            new Web3(window.ethereum)
          );
        })
        .catch(e => {
          reject(e);
        });
      return;
    }
    if(typeof window.web3 !== 'undefined') {
      return resolve(
        new Web3(window.web3.currentProvider)
      );
    }
    resolve(new Web3('http://localhost:9545'));
  });
};

const initContract = () => {
  //const deploymentKey = Object.keys(AdvancedStorage.networks)[0];
  return new web3.eth.Contract(
    contractABI, 
    contractAddress
  );
};

const initApp = () => {
  const $addData = document.getElementById('addData');
  const $data = document.getElementById('data');
  const $length = document.getElementById('length');
  let accounts = [];

  web3.eth.getAccounts()
  .then(_accounts => {
    accounts = _accounts;
    return advancedStorageContract.methods
      .getAll()
      .call();
  })
  .then(result => {
    $data.innerHTML = result.join(', ');
  });
  web3.eth.getAccounts()
  .then(_accounts => {
    accounts = _accounts;
    return advancedStorageContract.methods
      .length()
      .call();
  })
  .then(result => {
    $length.innerHTML = result;
  });

  $addData.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = e.target.elements[0].value;
    advancedStorageContract.methods
      .add(data)
      .send({from: accounts[0]})
      .then(result => {
        return advancedStorageContract.methods
          .getAll()
          .call();
      })
      .then(result => {
        $data.innerHTML = result.join(', ');
      });
  });
  
};

document.addEventListener('DOMContentLoaded', () => {
  initWeb3()
    .then(_web3 => {
      web3 = _web3;
      advancedStorageContract = initContract();
      initApp(); 
    })
    .catch(e => console.log(e.message));
});