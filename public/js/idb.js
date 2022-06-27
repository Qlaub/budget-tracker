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
    // uploadTransaction
  }
};

request.onerror = function(event) {
  console.log(event.target.errorCode);
};