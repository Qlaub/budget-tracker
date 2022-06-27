// variable for connection
let db;

// establish connection to db, set version to 1
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore('new_transaction', { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;

  if (navigator.onLine) {
    uploadTransaction();
  }
};

request.onerror = function(event) {
  console.log(event.target.errorCode);
};

// executed upon user submission while offline
function saveRecord(record) {
  const transaction = db.transaction(['new_transaction'], 'readwrite');

  const transactionObjectStore = transaction.objectStore('new_transaction');

  transactionObjectStore.add(record);
}

function uploadTransaction() {
  // open a transaction on indexedDB
  const transaction = db.transaction(['new_transaction'], 'readwrite');

  // access local object store
  const transactionObjectStore = transaction.objectStore('new_transaction');

  // get all records from store and set to a variable
  const getAll = transactionObjectStore.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          const transaction = db.transaction(['new_transaction'], 'readwrite');
          const transactionObjectStore = transaction.objectStore('new_transaction');
          transactionObjectStore.clear();

          alert('Transaction(s) submitted!');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
}

window.addEventListener('online', uploadTransaction);
