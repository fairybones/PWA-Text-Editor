import { openDB } from 'idb';

// create a new database called '' - version 1
const initdb = async () =>
  openDB('jate', 1, {
    // add db schema if it has not already been initialized
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      // create object store to hold data, accessible via keyName that increments automatically
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// Add logic to a method that accepts some content and adds it (POST) to the database
export const putDb = async (content) => {
    // create a connection to db with version
    const jateDb = await openDB('jate', 1);
    // new transaction (specify db & data privileges)
    const trans = jateDb.transaction('jate', 'readwrite');
    // cd the desired objectStore
    const storage = trans.objectStore('jate');
    // use the .add() method to pass in content
    const request = storage.add({ content });
    // confirm the request,
    const result = await request;
    console.log('Data successfully saved!', result);
    // ELSE handle error
    if (!result) {
     console.error('putDb not implemented');
    }
}; 

// Add logic for a method that gets all the content from the database
export const getDb = async () => {
    // create a connection to db with version
    const jateDb = await openDB('jate', 1);
    // new transaction (specify db & data privileges)
    const trans = jateDb.transaction('jate', 'readonly');
    // cd the desired objectStore
    const storage = trans.objectStore('jate');
    // use the .getAll() method to fetch all data in db
    const request = storage.getAll();
    // get confirmation of the request
    const result = await request;
    console.log('Data successfully retrieved!');
      // ELSE handle error
      if (!result) {
        console.error('getDb not implemented');
       }
    return result;
};

// start db
initdb();